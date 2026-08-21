import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ClientsClient } from "./clients-client";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch clients for this agency
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return <ClientsClient initialClients={clients || []} />;
}
