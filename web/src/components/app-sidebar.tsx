"use client"

import * as React from "react"
import {
  Home,
  FileText,
  Search,
  Users,
  LineChart,
  Settings,
  Database,
  Briefcase,
  Plug,
  ChevronDown,
  Plus
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Briefcase,
    },
    {
      title: "Integrations",
      url: "/integrations",
      icon: Plug,
    },
    {
      title: "Content",
      url: "/content",
      icon: FileText,
    },
    {
      title: "Keywords",
      url: "/keywords",
      icon: Search,
    },
    {
      title: "Bulk Indexing",
      url: "/indexing",
      icon: Database,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: LineChart,
    },
  ],
}

export function AppSidebar({ clients = [], ...props }: React.ComponentProps<typeof Sidebar> & { clients?: any[] }) {
  const params = useParams();
  const pathname = usePathname();
  const [activeClient, setActiveClient] = React.useState(clients[0] || null);

  // With middleware rewrites, the domain is implicitly handled for absolute paths on the client,
  // but to be safe we can just use relative paths or let next router handle it since the root is the domain.
  // Actually, since we rewrite, navigating to `/content` will hit the middleware which rewrites it to `/[domain]/content`.
  
  return (
    <Sidebar {...props} className="border-r-0 shadow-sm bg-white">
      <SidebarHeader className="h-16 px-4 mt-2 flex items-center justify-start border-none">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md transition-colors outline-none">
            <div className="flex items-center gap-2 text-left">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Briefcase className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Commas</span>
                <span className="truncate text-xs text-gray-500">{activeClient ? activeClient.name : 'Select Client'}</span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" side="bottom" sideOffset={8}>
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">Switch Client</DropdownMenuLabel>
            {clients.map((client) => (
              <DropdownMenuItem 
                key={client.id} 
                onClick={() => setActiveClient(client)}
                className="cursor-pointer"
              >
                {client.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/clients">
                <Plus className="mr-2 h-4 w-4" />
                <span>Create Client</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-4 py-4 space-y-1">
          {data.navMain.map((item) => {
            const isActive = pathname === item.url;
            return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={item.title}
                className={`py-6 px-4 transition-colors ${isActive ? 'border-l-4 border-primary text-primary bg-primary/5 rounded-r-md rounded-l-none font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'}`}
              >
                <Link href={item.url} className="flex items-center gap-3 w-full cursor-pointer">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )})}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-6 px-4 text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors rounded-md">
              <div className="flex items-center gap-3 w-full cursor-pointer">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
