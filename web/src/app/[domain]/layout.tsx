import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

export default function DomainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f0f2f5] min-h-screen">
        <AppHeader />
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
