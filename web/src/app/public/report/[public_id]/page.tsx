import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { PublicReportClient } from "./public-client";

export default async function PublicReportPage({ params }: { params: { public_id: string } }) {
  const supabase = await createClient();

  // Fetch the report by public_id
  const { data: report, error } = await supabase
    .from('reports')
    .select(`
      *,
      clients!inner(id, name, domain)
    `)
    .eq('public_id', params.public_id)
    .eq('is_public', true)
    .single();

  if (error || !report) {
    notFound(); // Triggers 404 if report is not found or not public
  }

  // Fetch widgets
  const { data: widgets } = await supabase
    .from('report_widgets')
    .select('*')
    .eq('report_id', report.id);

  return <PublicReportClient report={report} widgets={widgets || []} />;
}
