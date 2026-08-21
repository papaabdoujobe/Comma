"use client";

import { useState } from "react";
import { Plus, Briefcase, ExternalLink, Settings, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";

export function ClientsClient({ initialClients }: { initialClients: any[] }) {
  const [clients, setClients] = useState(initialClients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientDomain, setNewClientDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();

  const [services, setServices] = useState<string[]>([]);
    const availableServices = ["SEO", "Site Management", "Social Media", "Content Generation"];

    const toggleService = (service: string) => {
        setServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
    };

    const handleCreateClient = async () => {
    if (!newClientName) {
      toast.error("Client name is required");
      return;
    }

    setIsSubmitting(true);
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
        setIsSubmitting(false);
        return;
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([
        { 
          agency_id: userData.user.id,
          name: newClientName, 
          domain: newClientDomain,
          website_url: newClientDomain,
          services_offered: services
        }
      ])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success("Client created successfully");
      setClients([data, ...clients]);
      setIsDialogOpen(false);
      setNewClientName("");
      setNewClientDomain("");
      setServices([]);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button />}>
                <Plus className="mr-2 h-4 w-4" /> Add Client
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Create a new sub-account for a client. They will have their own isolated reports and data integrations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Client Name</label>
                  <Input 
                    id="name" 
                    placeholder="Acme Corp" 
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="domain" className="text-sm font-medium">Website URL</label>
                  <Input 
                    id="domain" 
                    placeholder="https://acmecorp.com" 
                    value={newClientDomain}
                    onChange={(e) => setNewClientDomain(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 mt-2">
                    <label className="text-sm font-medium">Services Offered</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        {availableServices.map(service => (
                            <label key={service} className="flex items-center space-x-2 text-sm">
                                <input 
                                    type="checkbox" 
                                    checked={services.includes(service)}
                                    onChange={() => toggleService(service)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span>{service}</span>
                            </label>
                        ))}
                    </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateClient} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Client"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {clients.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-xl mb-2">No clients yet</CardTitle>
          <CardDescription className="max-w-sm mb-6">
            Get started by adding your first client. You can connect their GA4, GSC, and social accounts later.
          </CardDescription>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="hover:border-primary/50 transition-colors cursor-pointer group relative">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{client.name}</CardTitle>
                {client.is_owner && (
                  <span className="bg-orange-100 text-[#E06719] text-xs px-2 py-1 rounded-md font-medium">Owner</span>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 flex items-center mb-4">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {client.website_url || client.domain || "No domain set"}
                </div>
                {client.services_offered && client.services_offered.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {client.services_offered.map((service: string) => (
                      <span key={service} className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">{service}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Settings className="mr-1 h-3 w-3" /> Manage Client
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
