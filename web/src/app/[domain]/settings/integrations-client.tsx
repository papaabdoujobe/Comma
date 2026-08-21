"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AVAILABLE_INTEGRATIONS = [
  {
    id: "wordpress",
    name: "WordPress",
    description: "Connect via WordPress REST API to sync content and publish directly.",
    icon: "https://s.w.org/style/images/about/WordPress-logotype-wmark.png",
    status: "available",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    description: "Pull website traffic, conversion, and engagement data.",
    icon: "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg",
    status: "coming_soon",
  },
  {
    id: "gsc",
    name: "Google Search Console",
    description: "Monitor website search performance, clicks, and impressions.",
    icon: "https://www.gstatic.com/images/branding/product/1x/search_console_48dp.png",
    status: "coming_soon",
  },
  {
    id: "zernio",
    name: "Zernio",
    description: "Unified social media and Google Business Profile reporting.",
    icon: "https://docs.zernio.com/favicon.ico", // Approximation
    status: "coming_soon",
  }
];

export function IntegrationsClient({ clients, initialIntegrations }: { clients: any[], initialIntegrations: any[] }) {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [isWPDialogOpen, setIsWPDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [wpUrl, setWpUrl] = useState("");
  const [wpUsername, setWpUsername] = useState("");
  const [wpAppPassword, setWpAppPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();

  const handleConnectWP = async () => {
    if (!selectedClientId || !wpUrl || !wpUsername || !wpAppPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    // Check if integration already exists for this client
    const existing = integrations.find(i => i.client_id === selectedClientId && i.provider === 'wordpress');
    
    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('client_integrations')
        .update({
          credentials: {
            url: wpUrl,
            username: wpUsername,
            app_password: wpAppPassword
          }
        })
        .eq('id', existing.id)
        .select(`*, clients!inner(id, name, agency_id)`)
        .single();
        
      if (error) {
        toast.error(error.message);
      } else if (data) {
        toast.success("WordPress integration updated");
        setIntegrations(integrations.map(i => i.id === existing.id ? data : i));
        setIsWPDialogOpen(false);
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('client_integrations')
        .insert([
          { 
            client_id: selectedClientId,
            provider: 'wordpress',
            credentials: {
              url: wpUrl,
              username: wpUsername,
              app_password: wpAppPassword
            }
          }
        ])
        .select(`*, clients!inner(id, name, agency_id)`)
        .single();

      if (error) {
        toast.error(error.message);
      } else if (data) {
        toast.success("WordPress connected successfully");
        setIntegrations([data, ...integrations]);
        setIsWPDialogOpen(false);
      }
    }
    
    setIsSubmitting(false);
  };

  const getIntegrationCount = (providerId: string) => {
    return integrations.filter(i => i.provider === providerId).length;
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      {clients.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <CardTitle className="text-xl mb-2">No clients available</CardTitle>
          <CardDescription className="max-w-sm mb-6">
            You need to create a client before you can map an integration to them.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE_INTEGRATIONS.map((app) => (
            <Card key={app.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-10 w-10 rounded overflow-hidden bg-slate-100 flex items-center justify-center p-1">
                    {/* Fallback to simple letter if icon fails */}
                    {app.icon ? (
                      <img src={app.icon} alt={app.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="font-bold text-slate-500">{app.name.charAt(0)}</span>
                    )}
                  </div>
                  {getIntegrationCount(app.id) > 0 && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {getIntegrationCount(app.id)} Connected
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl">{app.name}</CardTitle>
                <CardDescription className="h-10 mt-2">{app.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-6">
                {app.status === "available" ? (
                  <Button 
                    className="w-full" 
                    variant={getIntegrationCount(app.id) > 0 ? "outline" : "default"}
                    onClick={() => {
                      if (app.id === 'wordpress') {
                        // Reset form
                        setSelectedClientId("");
                        setWpUrl("");
                        setWpUsername("");
                        setWpAppPassword("");
                        setIsWPDialogOpen(true);
                      }
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> 
                    {getIntegrationCount(app.id) > 0 ? "Add Another Connection" : "Connect"}
                  </Button>
                ) : (
                  <Button className="w-full" variant="secondary" disabled>
                    <Lock className="mr-2 h-4 w-4" /> Coming Soon
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* WordPress Connect Dialog */}
      <Dialog open={isWPDialogOpen} onOpenChange={setIsWPDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect WordPress</DialogTitle>
            <DialogDescription>
              Enter the site credentials to connect WordPress to a specific client via the REST API.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="client" className="text-sm font-medium">Assign to Client</label>
              <select 
                id="client"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <label htmlFor="url" className="text-sm font-medium">WordPress URL</label>
              <Input 
                id="url" 
                placeholder="https://example.com" 
                value={wpUrl}
                onChange={(e) => setWpUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="username" className="text-sm font-medium">Admin Username</label>
              <Input 
                id="username" 
                placeholder="admin" 
                value={wpUsername}
                onChange={(e) => setWpUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="app_password" className="text-sm font-medium">Application Password</label>
              <Input 
                id="app_password" 
                type="password"
                placeholder="xxxx xxxx xxxx xxxx" 
                value={wpAppPassword}
                onChange={(e) => setWpAppPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Generate this in your WP Admin under Users {'>'} Profile {'>'} Application Passwords.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWPDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConnectWP} disabled={isSubmitting}>
              {isSubmitting ? "Connecting..." : "Connect WordPress"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
