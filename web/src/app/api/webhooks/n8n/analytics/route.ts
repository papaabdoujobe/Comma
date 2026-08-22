import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Simple basic auth or secret key validation from n8n
    const EXPECTED_SECRET = process.env.N8N_WEBHOOK_SECRET || "comma-secret-key-replace-me";
    
    if (authHeader !== `Bearer ${EXPECTED_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, provider, date, metrics, insights } = body;

    if (!clientId || !provider || !date || !metrics) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use service role key since this is a server-to-server request
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Upsert time-series metrics
    const { error: metricsError } = await supabase
      .from("analytics_data")
      .upsert({
        client_id: clientId,
        provider: provider,
        date: date,
        metrics: metrics,
      }, { onConflict: "client_id,provider,date" });

    if (metricsError) {
      console.error("Failed to save metrics:", metricsError);
      return NextResponse.json({ error: "Failed to save metrics" }, { status: 500 });
    }

    // 2. Save insights (cannibalization, drops, etc) if any exist
    if (insights && Array.isArray(insights)) {
      const insightPayloads = insights.map((insight: any) => ({
        client_id: clientId,
        type: insight.type,
        insight_data: insight.data,
      }));

      const { error: insightsError } = await supabase
        .from("analytics_insights")
        .insert(insightPayloads);

      if (insightsError) {
        console.error("Failed to save insights:", insightsError);
        // Don't fail the whole request if insights fail, but log it
      }
    }

    return NextResponse.json({ success: true, message: "Analytics data ingested" });

  } catch (err: any) {
    console.error("Webhook ingestion error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
