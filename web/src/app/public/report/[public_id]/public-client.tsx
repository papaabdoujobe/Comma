"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, MapPin } from "lucide-react";

// Reuse Mock Widgets for public view (read-only, no interactions)
const TrafficChartWidget = () => (
  <div className="h-64 bg-slate-50 border border-slate-100 rounded-md flex items-end p-4 gap-2">
    {[40, 70, 45, 90, 65, 85, 120].map((h, i) => (
      <div key={i} className="bg-blue-500 w-full rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
    ))}
  </div>
);

const KeywordsTableWidget = () => (
  <div className="w-full overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
        <tr>
          <th className="px-6 py-3">Keyword</th>
          <th className="px-6 py-3">Position</th>
          <th className="px-6 py-3">Volume</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="px-6 py-4 font-medium">plumber near me</td>
          <td className="px-6 py-4 text-green-600">#2</td>
          <td className="px-6 py-4">4,200</td>
        </tr>
        <tr className="border-b">
          <td className="px-6 py-4 font-medium">emergency plumbing</td>
          <td className="px-6 py-4 text-green-600">#5</td>
          <td className="px-6 py-4">1,800</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const SocialStatsWidget = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
    <div className="p-4 bg-blue-50 rounded-md">
      <div className="text-2xl font-bold text-blue-700">12.4K</div>
      <div className="text-xs text-blue-600 uppercase tracking-wide">FB Reach</div>
    </div>
    <div className="p-4 bg-pink-50 rounded-md">
      <div className="text-2xl font-bold text-pink-700">8.2K</div>
      <div className="text-xs text-pink-600 uppercase tracking-wide">IG Impressions</div>
    </div>
    <div className="p-4 bg-sky-50 rounded-md">
      <div className="text-2xl font-bold text-sky-700">342</div>
      <div className="text-xs text-sky-600 uppercase tracking-wide">X Mentions</div>
    </div>
  </div>
);

const GBPViewsWidget = () => (
  <div className="flex items-center justify-between p-4 bg-green-50 rounded-md">
    <div>
      <div className="text-3xl font-bold text-green-700">2,845</div>
      <div className="text-sm text-green-600">Maps & Search Views (30 days)</div>
    </div>
    <div className="text-green-500">
      <MapPin className="h-12 w-12 opacity-50" />
    </div>
  </div>
);

export function PublicReportClient({ report, widgets }: { report: any, widgets: any[] }) {
  const renderWidgetContent = (type: string) => {
    switch(type) {
      case 'traffic_chart': return <TrafficChartWidget />;
      case 'keywords_table': return <KeywordsTableWidget />;
      case 'social_stats': return <SocialStatsWidget />;
      case 'gbp_views': return <GBPViewsWidget />;
      default: return <div>Unknown widget type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{report.clients?.name}</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Performance Dashboard</p>
          </div>
        </div>
        <div className="text-sm text-slate-500">
          Powered by <span className="font-semibold text-slate-700">Commas</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{report.title}</h2>
          {report.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl">{report.description}</p>
          )}
        </div>

        {widgets.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No data widgets have been added to this report yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {widgets.map((widget) => (
              <Card key={widget.id} className="shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg">{widget.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {renderWidgetContent(widget.type)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <footer className="py-6 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} {report.clients?.name}. All rights reserved.
      </footer>
    </div>
  );
}
