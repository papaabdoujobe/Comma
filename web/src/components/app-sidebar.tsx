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
} from "lucide-react"

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
      title: "Social",
      url: "#",
      icon: Users,
    },
    {
      title: "Analytics",
      url: "#",
      icon: LineChart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const pathname = usePathname();
  // With middleware rewrites, the domain is implicitly handled for absolute paths on the client,
  // but to be safe we can just use relative paths or let next router handle it since the root is the domain.
  // Actually, since we rewrite, navigating to `/content` will hit the middleware which rewrites it to `/[domain]/content`.
  
  return (
    <Sidebar {...props} className="border-r-0 shadow-sm bg-white">
      <SidebarHeader className="h-16 px-8 mt-2 flex items-center justify-start border-none">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Comma
        </h1>
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
