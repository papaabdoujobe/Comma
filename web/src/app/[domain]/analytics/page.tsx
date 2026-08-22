import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsClient } from "./analytics-client"

export default async function AnalyticsPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = params.domain;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Get the client for this domain or the first client if it's the main agency dash
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .eq('agency_id', user.id);

  if (!clients || clients.length === 0) {
    return (
      <div className="flex-1 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Analytics & SEO Data</h2>
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500 mb-4">No websites connected yet.</p>
          <a href={`/${domain}/sites`} className="text-primary hover:underline font-medium">Connect a Website</a>
        </div>
      </div>
    );
  }

  // Get analytics data for these clients
  const clientIds = clients.map(c => c.id);
  
  const { data: rawAnalyticsData } = await supabase
    .from('analytics_data')
    .select('*')
    .in('client_id', clientIds)
    .order('date', { ascending: true });

  const { data: insightsData } = await supabase
    .from('analytics_insights')
    .select('*')
    .in('client_id', clientIds)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <AnalyticsClient 
      clients={clients} 
      analyticsData={rawAnalyticsData || []} 
      insightsData={insightsData || []} 
    />
  );
}
