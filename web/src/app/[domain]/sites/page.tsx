import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SitesClient } from "./sites-client";

export default async function SitesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('name');

  const { data: integrations } = await supabase
    .from('client_integrations')
    .select(`
      *,
      clients!inner(id, name, agency_id, website_url)
    `)
    .eq('clients.agency_id', user.id);

  return <SitesClient clients={clients || []} integrations={integrations || []} />;
}
