"use client";

import { useState } from "react";
import { Plus, Save, Globe, Lock, ArrowLeft, BarChart3, Search, Users, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock Widget Components
const TrafficChartWidget = () => (
  <div className="h-64 bg-slate-50 border border-slate-100 rounded-md flex items-end p-4 gap-2">
    {/* Simple mock bar chart */}
    {[40, 70, 45, 90, 65, 85, 120].map((h, i) => (
      <div key={i} className="bg-blue-500 w-full rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
    ))}
  </div>
);

const KeywordsTableWidget = () => (
  <div className="w-full">
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
  <div className="grid grid-cols-3 gap-4 text-center">
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

const WIDGET_CATALOG = [
  { type: 'traffic_chart', title: 'Website Traffic', icon: BarChart3, desc: 'GA4 sessions over time.' },
  { type: 'keywords_table', title: 'Top Keywords', icon: Search, desc: 'Highest ranking search terms.' },
  { type: 'social_stats', title: 'Social Reach', icon: Users, desc: 'Zernio cross-platform metrics.' },
  { type: 'gbp_views', title: 'Local Views', icon: MapPin, desc: 'Google Business Profile views.' },
];

export function ReportBuilderClient({ report, initialWidgets }: { report: any, initialWidgets: any[] }) {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [isPublic, setIsPublic] = useState(report.is_public);
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const handleAddWidget = async (type: string, title: string) => {
    const { data, error } = await supabase
      .from('report_widgets')
      .insert([
        { 
          report_id: report.id,
          type,
          title,
          config: {} // For future layout coordinates
        }
      ])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success("Widget added");
      setWidgets([...widgets, data]);
      setIsWidgetDialogOpen(false);
    }
  };

  const handleRemoveWidget = async (id: string) => {
    const { error } = await supabase.from('report_widgets').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      setWidgets(widgets.filter(w => w.id !== id));
      toast.success("Widget removed");
    }
  };

  const togglePublic = async () => {
    const newVal = !isPublic;
    const { error } = await supabase
      .from('reports')
      .update({ is_public: newVal })
      .eq('id', report.id);
      
    if (error) {
      toast.error(error.message);
    } else {
      setIsPublic(newVal);
      toast.success(newVal ? "Report is now public" : "Report is now private");
    }
  };

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
    <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50 min-h-full">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <Button variant="ghost" className="mb-2 -ml-4 text-muted-foreground" onClick={() => router.push('/reports')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{report.title}</h2>
          <p className="text-muted-foreground mt-1">Client: {report.clients?.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={isPublic ? "outline" : "secondary"} onClick={togglePublic}>
            {isPublic ? (
              <><Globe className="mr-2 h-4 w-4 text-green-500" /> Public</>
            ) : (
              <><Lock className="mr-2 h-4 w-4" /> Private</>
            )}
          </Button>
          {isPublic && (
            <Button variant="outline" onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/public/report/${report.public_id}`);
              toast.success("Public link copied to clipboard!");
            }}>
              Copy Link
            </Button>
          )}
          <Dialog open={isWidgetDialogOpen} onOpenChange={setIsWidgetDialogOpen}>
            <DialogTrigger render={<Button />}>
                <Plus className="mr-2 h-4 w-4" /> Add Widget
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Widget Library</DialogTitle>
                <DialogDescription>
                  Select a data widget to add to your report canvas.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {WIDGET_CATALOG.map((w) => (
                  <Card key={w.type} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleAddWidget(w.type, w.title)}>
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded text-primary">
                          <w.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{w.title}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="pt-2">{w.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Canvas Area */}
      {widgets.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center bg-white text-center">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700">Canvas is empty</h3>
          <p className="text-slate-500 mt-2 max-w-sm mb-6">Start building your report by adding widgets from the library.</p>
          <Button onClick={() => setIsWidgetDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Widget
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {widgets.map((widget) => (
            <Card key={widget.id} className="relative group shadow-sm hover:shadow-md transition-shadow">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                onClick={() => handleRemoveWidget(widget.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{widget.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderWidgetContent(widget.type)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
