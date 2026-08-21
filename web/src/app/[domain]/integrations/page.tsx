import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { IntegrationsClient } from "./integrations-client";

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch clients to populate the assignment dropdown
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('name');

  // Fetch existing integrations across all clients for this agency
  const { data: integrations } = await supabase
    .from('client_integrations')
    .select(`
      *,
      clients!inner(id, name, agency_id)
    `)
    .eq('clients.agency_id', user.id);

  return <IntegrationsClient clients={clients || []} initialIntegrations={integrations || []} />;
}
