import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const protocol = DOMAIN.startsWith("localhost") ? "http://" : "https://";

  if (error) {
    return NextResponse.redirect(`${protocol}${DOMAIN}/sites?error=google_oauth_denied`);
  }

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  // Decode state to get clientId
  let decodedState;
  try {
    decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
  } catch (e) {
    return NextResponse.json({ error: "Invalid state parameter" }, { status: 400 });
  }

  const { clientId, userId } = decodedState;

  if (!clientId || !userId) {
    return NextResponse.json({ error: "Invalid state payload" }, { status: 400 });
  }

  // Ensure user is still authenticated and matches the state
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized session mismatch" }, { status: 401 });
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = `${protocol}${DOMAIN}/api/auth/google/callback`;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Missing Google OAuth credentials in environment");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // Exchange code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    console.error("Google OAuth token exchange error:", tokenData);
    return NextResponse.redirect(`${protocol}${DOMAIN}/sites?error=google_oauth_failed`);
  }

  // Upsert the integration into client_integrations
  const { error: dbError } = await supabase
    .from("client_integrations")
    .upsert({
      client_id: clientId,
      provider: "google",
      credentials: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        scope: tokenData.scope,
        token_type: tokenData.token_type,
        updated_at: Date.now(),
      },
      updated_at: new Date().toISOString()
    }, { onConflict: "client_id,provider" });

  if (dbError) {
    console.error("Error saving integration to DB:", dbError);
    return NextResponse.redirect(`${protocol}${DOMAIN}/sites?error=db_save_failed`);
  }

  // Redirect back to the sites/integrations page with a success message
  return NextResponse.redirect(`${protocol}${DOMAIN}/sites?success=google_connected`);
}
