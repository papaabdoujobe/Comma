import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
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

  // Fetch reports across all clients for this agency
  const { data: reports } = await supabase
    .from('reports')
    .select(`
      *,
      clients!inner(id, name, agency_id)
    `)
    .eq('clients.agency_id', user.id)
    .order('created_at', { ascending: false });

  return <ReportsClient clients={clients || []} initialReports={reports || []} />;
}
