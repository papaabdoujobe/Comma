import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = params.domain;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const firstName = user.user_metadata?.first_name || 'Guest';
  const websiteUrl = user.user_metadata?.website_url || domain;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {firstName} 👋</h2>
          <p className="text-gray-500 mt-1">Here is the latest data for <a href={websiteUrl} target="_blank" className="text-primary hover:underline font-medium">{websiteUrl}</a></p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            className="block w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-white shadow-sm text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow outline-none"
            placeholder="Search"
            type="text"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl border-none shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Organic Traffic</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-3xl font-bold text-gray-900">12,345</div>
            <div className="text-sm font-medium text-green-500 mt-1">+10%</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-none shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Domain Authority</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-3xl font-bold text-gray-900">65</div>
            <div className="text-sm font-medium text-green-500 mt-1">+5%</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-none shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Backlinks</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-3xl font-bold text-gray-900">2,500</div>
            <div className="text-sm font-medium text-green-500 mt-1">+15%</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-none shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-3xl font-bold text-gray-900">500</div>
            <div className="text-sm font-medium text-green-500 mt-1">+8%</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Traffic Trends</h3>
        <Card className="rounded-2xl border-none shadow-sm overflow-hidden p-6">
          <div className="mb-4">
            <div className="text-sm text-gray-500">Website Traffic</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">12,345</span>
              <span className="text-sm font-medium text-green-500">Last 30 Days +10%</span>
            </div>
          </div>
          <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
             <span className="text-gray-400">Chart Placeholder</span>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Tasks</h3>
        <Card className="rounded-2xl border-none shadow-sm p-6">
          {[
            { title: "Draft Blog Post", category: "Content Creation", time: "2d ago" },
            { title: "Optimize Landing Page", category: "SEO Optimization", time: "3d ago" },
            { title: "Schedule Posts", category: "Social Media", time: "4d ago" }
          ].map((task, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-100 last:border-0">
              <div className="flex flex-col mb-2 md:mb-0">
                <h4 className="font-semibold text-gray-900 text-sm">{task.title}</h4>
                <p className="text-[0.85rem] text-gray-500">{task.category}</p>
              </div>
              <div className="flex items-center justify-end gap-4">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                  {task.category}
                </span>
                <span className="text-xs text-gray-400">{task.time}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
