import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json({ error: "Missing clientId parameter" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership and get integration credentials
    const { data: integration, error } = await supabase
      .from("client_integrations")
      .select(`
        credentials,
        clients!inner(id, agency_id, website_url)
      `)
      .eq("client_id", clientId)
      .eq("provider", "google")
      .eq("clients.agency_id", user.id)
      .single();

    if (error || !integration) {
      return NextResponse.json({ error: "Integration not found or unauthorized" }, { status: 403 });
    }

    const creds = integration.credentials as { refresh_token?: string, access_token?: string, updated_at?: number, expires_in?: number };
    
    if (!creds || !creds.refresh_token) {
      return NextResponse.json({ error: "No refresh token available. Reconnect Google." }, { status: 400 });
    }

    // Check if we need to refresh the access token (assume expired if older than 50 minutes)
    let currentAccessToken = creds.access_token;
    const isExpired = !creds.updated_at || (Date.now() - creds.updated_at > 50 * 60 * 1000);

    if (isExpired) {
      const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
      const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

      if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        return NextResponse.json({ error: "Server misconfiguration: missing Google secrets" }, { status: 500 });
      }

      const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          refresh_token: creds.refresh_token,
          grant_type: "refresh_token",
        }),
      });

      const refreshData = await refreshResponse.json();

      if (refreshData.error) {
        console.error("Token refresh failed:", refreshData);
        return NextResponse.json({ error: "Failed to refresh Google token" }, { status: 400 });
      }

      currentAccessToken = refreshData.access_token;

      // Update DB with new token
      await supabase
        .from("client_integrations")
        .update({
          credentials: {
            ...creds,
            access_token: currentAccessToken,
            expires_in: refreshData.expires_in,
            updated_at: Date.now(),
          }
        })
        .eq("client_id", clientId)
        .eq("provider", "google");
    }

    // Trigger the n8n webhook
    // Using the MCP server path or a specific webhook path on n8n
    const n8nWebhookUrl = process.env.N8N_SEO_SYNC_WEBHOOK_URL || "https://flows.wdip.work/webhook/seo-sync";
    
    // Determine the siteUrl from the client record
    const clientData = Array.isArray(integration.clients) ? integration.clients[0] : integration.clients;
    const siteUrl = clientData.website_url;

    if (!siteUrl) {
      return NextResponse.json({ error: "Client missing website_url" }, { status: 400 });
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: clientId,
        siteUrl: siteUrl,
        accessToken: currentAccessToken,
      }),
    });

    if (!n8nResponse.ok) {
      console.error("n8n trigger failed:", await n8nResponse.text());
      return NextResponse.json({ error: "Failed to trigger n8n workflow" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Analytics sync triggered successfully" });

  } catch (err: any) {
    console.error("Error triggering SEO sync:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
