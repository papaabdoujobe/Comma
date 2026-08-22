import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SocialClient } from "./social-client";

export default async function SocialPage({ params }: { params: { domain: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get active client
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('domain', params.domain)
    .single();

  if (!client) {
    return <div>Client not found</div>;
  }

  return <SocialClient client={client} />;
}
