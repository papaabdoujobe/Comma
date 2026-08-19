import * as React from "react"
import { Bell, Search, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-transparent shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden text-gray-500 hover:text-gray-700" />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="w-64 pl-10 border-none rounded-lg bg-white shadow-sm focus-visible:ring-1"
            placeholder="Search"
            type="search"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 bg-white rounded-lg text-gray-500 hover:text-gray-700 shadow-sm focus:outline-none transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
