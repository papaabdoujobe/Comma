import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ReportBuilderClient } from "./builder-client";

export default async function ReportBuilderPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the report
  const { data: report, error } = await supabase
    .from('reports')
    .select(`
      *,
      clients!inner(id, name, agency_id)
    `)
    .eq('id', params.id)
    .single();

  if (error || !report) {
    notFound();
  }

  // Verify ownership
  if (report.clients.agency_id !== user.id) {
    redirect('/');
  }

  // Fetch widgets
  const { data: widgets } = await supabase
    .from('report_widgets')
    .select('*')
    .eq('report_id', report.id);

  return <ReportBuilderClient report={report} initialWidgets={widgets || []} />;
}
