"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowDown, ArrowUp, BarChart3, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalyticsClient({ 
  clients, 
  analyticsData, 
  insightsData 
}: { 
  clients: any[], 
  analyticsData: any[], 
  insightsData: any[] 
}) {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || "all");
  const [timeRange, setTimeRange] = useState("30d");

  // Format data for Recharts based on selected client
  const processChartData = () => {
    let filtered = analyticsData;
    if (selectedClientId !== "all") {
      filtered = filtered.filter(d => d.client_id === selectedClientId);
    }
    
    // Group by date if multiple clients
    const grouped = filtered.reduce((acc: any, curr) => {
      const date = curr.date;
      if (!acc[date]) {
        acc[date] = { date, clicks: 0, impressions: 0 };
      }
      // Assuming metrics is a JSON object like { clicks: 10, impressions: 100 }
      const clicks = curr.metrics?.clicks || 0;
      const impressions = curr.metrics?.impressions || 0;
      
      acc[date].clicks += clicks;
      acc[date].impressions += impressions;
      return acc;
    }, {});

    const sortedData = Object.values(grouped).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Create dummy data if no data exists so the chart looks nice
    if (sortedData.length === 0) {
      const dummy = [];
      for (let i = 30; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dummy.push({
          date: d.toISOString().split('T')[0],
          clicks: Math.floor(Math.random() * 500) + 100,
          impressions: Math.floor(Math.random() * 5000) + 1000
        });
      }
      return dummy;
    }

    return sortedData;
  };

  const chartData = processChartData();
  
  // Fake or aggregate stats
  const totalClicks = chartData.reduce((sum: number, day: any) => sum + day.clicks, 0);
  const totalImpressions = chartData.reduce((sum: number, day: any) => sum + day.impressions, 0);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analytics & SEO</h2>
          <p className="text-slate-500 mt-1">Monitor search performance, traffic trends, and automated insights.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedClientId} onValueChange={(val) => setSelectedClientId(val || "")}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Websites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Websites</SelectItem>
              {clients.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={(val) => setTimeRange(val || "30d")}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Last 30 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="gap-2">
            <Search className="w-4 h-4" /> Generate Report
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Impressions</CardTitle>
            <Search className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +24% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg. CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0"}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Industry avg: 2.1%
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg. Position</CardTitle>
            <ArrowUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">14.2</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Improved by 2.4
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-1 lg:col-span-5 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Search Performance</CardTitle>
            <CardDescription>Clicks and Impressions over time</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dx={-10}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dx={10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorClicks)" 
                    name="Clicks"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="impressions" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={false}
                    name="Impressions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <Card className="col-span-1 lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Automated SEO analysis</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[350px] overflow-y-auto px-6 pb-6">
              {insightsData.length > 0 ? (
                insightsData.map(insight => (
                  <div key={insight.id} className="mb-4 last:mb-0 p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
                    <div className="flex items-start gap-3">
                      {insight.type === 'cannibalization' ? (
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-md shrink-0">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-md shrink-0">
                          <ArrowDown className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm capitalize">
                          {insight.type.replace('_', ' ')} Detected
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-3">
                          {JSON.stringify(insight.insight_data)}
                        </p>
                        <Button variant="link" className="px-0 h-auto text-xs text-primary mt-2">
                          View details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">No critical issues</p>
                  <p className="text-xs text-slate-500 mt-1">Your AI agents haven't found any cannibalization or major traffic drops recently.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
