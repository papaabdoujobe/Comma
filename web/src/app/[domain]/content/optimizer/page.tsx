import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ContentOptimizerHub(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = params.domain;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: drafts } = await supabase
    .from('content_drafts')
    .select('*')
    .eq('domain', domain)
    .order('updated_at', { ascending: false });

  return (
    <div className="flex-1 px-8 py-6 bg-[#f0f2f5] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Optimizer</h2>
          <p className="text-muted-foreground mt-1">Select a content draft to start optimizing.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drafts && drafts.length > 0 ? (
          drafts.map((draft) => (
            <Card key={draft.id} className="hover:border-primary/50 transition-colors flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{draft.title}</CardTitle>
                <CardDescription className="uppercase tracking-wider text-xs">
                  {draft.status} • Score: {draft.seo_score || 0}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link href={`/content/${draft.id}`} className="w-full">
                  <Button className="w-full">
                    Optimize Content
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed">
            <h3 className="text-xl font-bold mb-2">No drafts found</h3>
            <p className="text-muted-foreground mb-6">Create a draft in the Content Calendar first.</p>
            <Link href="/content/calendar">
              <Button>Go to Calendar</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
