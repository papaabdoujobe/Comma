import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ChatAssistant } from "./chat-assistant"

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

  const { data: integrations } = await supabase
    .from('client_integrations')
    .select('id, clients!inner(agency_id)')
    .eq('clients.agency_id', user.id)
    .limit(1);

  const hasIntegrations = integrations && integrations.length > 0;

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

      {!hasIntegrations ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-dashed p-12 text-center shadow-sm">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Data Sources</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            You haven't connected any integrations yet. Connect WordPress, Google Analytics, or Social Media to start seeing insights.
          </p>
          <a 
            href="/sites" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Connect Websites & Data
          </a>
        </div>
      ) : (
        <>
          {/* Chat Interface */}
          <div className="mt-8">
            <ChatAssistant />
          </div>

          {/* 3 Statistic Cards Below Chat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl border-none shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg bg-white">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Organic Traffic</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold text-slate-900">12,450</div>
                <div className="text-sm font-medium text-emerald-500 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                  +14.2% from last month
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-none shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg bg-white">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Domain Authority</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold text-slate-900">42</div>
                <div className="text-sm font-medium text-emerald-500 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                  +2 points this week
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-none shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg bg-white">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Avg. Position</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold text-slate-900">14.8</div>
                <div className="text-sm font-medium text-emerald-500 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                  Improved by 1.2
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
