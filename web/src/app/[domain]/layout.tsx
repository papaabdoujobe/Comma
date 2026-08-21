import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DomainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <SidebarProvider>
      <AppSidebar clients={clients || []} />
      <SidebarInset className="bg-[#f0f2f5] min-h-screen">
        <AppHeader />
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
