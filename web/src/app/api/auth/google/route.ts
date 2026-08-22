import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ error: "Missing clientId parameter" }, { status: 400 });
  }

  // Ensure the user is authenticated and owns this client
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: client, error } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .eq("agency_id", user.id)
    .single();

  if (error || !client) {
    return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 403 });
  }

  // Construct Google OAuth URL
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_ROOT_DOMAIN?.startsWith('localhost') ? 'http://' : 'https://'}${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/auth/google/callback`;
  
  if (!GOOGLE_CLIENT_ID) {
    console.error("Missing GOOGLE_CLIENT_ID env var");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // Pass the clientId in the state parameter so we know which client to attach the tokens to
  const state = Buffer.from(JSON.stringify({ clientId, userId: user.id })).toString('base64');
  
  const scope = [
    "https://www.googleapis.com/auth/webmasters.readonly", // Search Console
    "https://www.googleapis.com/auth/analytics.readonly", // Google Analytics
    "https://www.googleapis.com/auth/userinfo.email"
  ].join(" ");

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: scope,
    access_type: "offline",
    prompt: "consent", // Force consent to ensure we get a refresh token
    state: state,
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  return NextResponse.redirect(url);
}
