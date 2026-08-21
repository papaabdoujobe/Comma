"use client";

import { useState } from "react";
import { Plus, LayoutDashboard, Globe, Lock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ReportsClient({ clients, initialReports }: { clients: any[], initialReports: any[] }) {
  const [reports, setReports] = useState(initialReports);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const handleCreateReport = async () => {
    if (!selectedClientId || !reportTitle) {
      toast.error("Client and Title are required");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('reports')
      .insert([
        { 
          client_id: selectedClientId,
          title: reportTitle,
          description: reportDescription
        }
      ])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success("Report created successfully");
      setIsDialogOpen(false);
      // Navigate to the builder
      router.push(`/reports/${data.id}`);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Client Reports</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button disabled={clients.length === 0} />}>
                <Plus className="mr-2 h-4 w-4" /> New Report
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Build a custom dashboard for your client using widgets.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="client" className="text-sm font-medium">Assign to Client</label>
                  <select 
                    id="client"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                  >
                    <option value="" disabled>Select a client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Report Title</label>
                  <Input 
                    id="title" 
                    placeholder="Monthly SEO Performance" 
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                  <Input 
                    id="description" 
                    placeholder="Overview of organic traffic and keyword rankings" 
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateReport} disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Report"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {reports.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
            <LayoutDashboard className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-xl mb-2">No reports yet</CardTitle>
          <CardDescription className="max-w-sm mb-6">
            Create your first custom client dashboard to track SEO, traffic, and social metrics.
          </CardDescription>
          <Button onClick={() => setIsDialogOpen(true)} disabled={clients.length === 0}>
            <Plus className="mr-2 h-4 w-4" /> Create Report
          </Button>
          {clients.length === 0 && (
            <p className="text-xs text-red-500 mt-4">You must create a client first.</p>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.id} className="hover:border-primary/50 transition-colors group relative flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">{report.title}</CardTitle>
                  <CardDescription className="mt-1 text-xs">{report.clients?.name}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-500 line-clamp-2">
                  {report.description || "No description provided."}
                </p>
                
                <div className="flex items-center mt-4 text-xs font-medium text-gray-500">
                  {report.is_public ? (
                    <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Globe className="h-3 w-3 mr-1" /> Public Link Active
                    </span>
                  ) : (
                    <span className="flex items-center bg-slate-100 px-2 py-1 rounded-full">
                      <Lock className="h-3 w-3 mr-1" /> Private
                    </span>
                  )}
                </div>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/reports/${report.id}`)}
                >
                  Open Builder
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
