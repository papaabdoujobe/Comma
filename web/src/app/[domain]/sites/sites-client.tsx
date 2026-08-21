"use client";

import { useState } from "react";
import { Plus, Settings, Globe, Server, CheckCircle2 } from "lucide-react";
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

const CMS_OPTIONS = [
  {
    id: "wordpress",
    name: "WordPress",
    description: "Connect via WordPress REST API or MCP Plugin.",
  },
  {
    id: "webflow",
    name: "Webflow",
    description: "Connect via Webflow Data API (Coming Soon).",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Connect via Shopify Admin API (Coming Soon).",
  }
];

export function SitesClient({ clients, integrations }: { clients: any[], integrations: any[] }) {
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCms, setSelectedCms] = useState("wordpress");
  const [wpUrl, setWpUrl] = useState("");
  const [wpApiKey, setWpApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();

  const handleConnect = async () => {
    if (!selectedClientId || !selectedCms) {
      toast.error("Please select a client and CMS");
      return;
    }

    if (selectedCms === 'wordpress' && (!wpUrl || !wpApiKey)) {
      toast.error("Please provide WordPress URL and API Key");
      return;
    }

    if (selectedCms !== 'wordpress') {
      toast.error(`${selectedCms} is coming soon!`);
      return;
    }

    setIsSubmitting(true);
    
    // Check if integration already exists for this client
    const existing = integrations.find(i => i.client_id === selectedClientId && i.provider === selectedCms);
    
    if (existing) {
      // Update
      const { error } = await supabase
        .from('client_integrations')
        .update({
          credentials: {
            url: wpUrl,
            api_key: wpApiKey
          }
        })
        .eq('id', existing.id);
        
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Website connection updated");
        setIsAddSiteOpen(false);
        // Refresh page or update state locally
        window.location.reload();
      }
    } else {
      // Insert
      const { error } = await supabase
        .from('client_integrations')
        .insert([
          { 
            client_id: selectedClientId,
            provider: selectedCms,
            credentials: {
              url: wpUrl,
              api_key: wpApiKey
            }
          }
        ]);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Website connected successfully");
        setIsAddSiteOpen(false);
        window.location.reload();
      }
    }
    
    setIsSubmitting(false);
  };

  const getClientSites = () => {
    // Only return clients that have an integration
    return integrations.map(i => {
      const client = clients.find(c => c.id === i.client_id);
      return {
        ...i,
        client_name: client?.name || 'Unknown',
        website_url: client?.website_url || client?.domain || i.credentials?.url
      };
    });
  };

  const activeSites = getClientSites();

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Websites</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Add New Website Card */}
        <Card className="flex flex-col border-dashed hover:border-primary/50 transition-colors cursor-pointer bg-slate-50/50" onClick={() => setIsAddSiteOpen(true)}>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center h-full">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl mb-2">Add New Website</CardTitle>
            <CardDescription className="max-w-[200px]">
              Connect a new CMS or static site to manage content and SEO.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Existing Sites */}
        {activeSites.map((site) => (
          <Card key={site.id} className="flex flex-col group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Globe className="h-5 w-5 text-slate-600" />
                </div>
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Connected
                </span>
              </div>
              <CardTitle className="text-xl truncate">{site.website_url || site.client_name}</CardTitle>
              <CardDescription className="uppercase tracking-wider text-xs font-semibold">{site.provider}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-slate-500 mb-2">Client: <span className="font-medium text-slate-900">{site.client_name}</span></p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs">
                <Settings className="mr-2 h-4 w-4" /> Manage Site
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Site Dialog */}
      <Dialog open={isAddSiteOpen} onOpenChange={setIsAddSiteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Connect New Website</DialogTitle>
            <DialogDescription>
              Select a CMS and provide your credentials to automate publishing and management.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">1. Assign to Client</label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option value="" disabled>Select a client...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2 mt-2">
              <label className="text-sm font-medium">2. Select CMS Platform</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CMS_OPTIONS.map((cms) => (
                  <div 
                    key={cms.id}
                    className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${selectedCms === cms.id ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => setSelectedCms(cms.id)}
                  >
                    <Server className={`h-6 w-6 mx-auto mb-2 ${selectedCms === cms.id ? 'text-primary' : 'text-slate-400'}`} />
                    <div className="font-medium text-sm">{cms.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedCms === 'wordpress' && (
              <div className="space-y-4 mt-2 p-4 bg-slate-50 rounded-lg border">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">WordPress Site URL</label>
                  <Input 
                    placeholder="https://example.com" 
                    value={wpUrl}
                    onChange={(e) => setWpUrl(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">MCP API Key / App Password</label>
                  <Input 
                    type="password"
                    placeholder="Enter your integration key" 
                    value={wpApiKey}
                    onChange={(e) => setWpApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    If using our Royal MCP plugin, enter your generated API key. Otherwise, use an application password.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSiteOpen(false)}>Cancel</Button>
            <Button onClick={handleConnect} disabled={isSubmitting}>
              {isSubmitting ? "Connecting..." : "Connect Website"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
