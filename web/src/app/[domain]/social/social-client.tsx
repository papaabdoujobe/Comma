"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, Share2, Plus, Image as ImageIcon, Video, Activity, Users, Eye } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function SocialClient({ client }: { client: any }) {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerContent, setComposerContent] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [client.id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Auth Profiles
      const authRes = await fetch(`/api/social/auth?clientId=${client.id}`);
      const authData = await authRes.json();
      if (authData.success) {
        setProfiles(authData.profiles);
      }

      // 2. Fetch Metrics
      const metricsRes = await fetch(`/api/social/metrics?clientId=${client.id}`);
      const metricsData = await metricsRes.json();
      if (metricsData.success) {
        setMetrics(metricsData.metrics);
      }

      // 3. Fetch Posts
      const postsRes = await fetch(`/api/social/posts?clientId=${client.id}`);
      const postsData = await postsRes.json();
      if (postsData.success) {
        setPosts(postsData.posts);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load social data");
    }
    setIsLoading(false);
  };

  const handlePublish = async (action: 'publish' | 'schedule') => {
    if (!composerContent.trim() || selectedProfiles.length === 0) {
      toast.error("Content and at least one profile are required.");
      return;
    }

    if (action === 'schedule' && !scheduledDate) {
      toast.error("Please select a date and time to schedule.");
      return;
    }

    setIsPublishing(true);
    try {
      const endpoint = action === 'publish' ? '/api/social/publish' : '/api/social/posts';
      const body = {
        clientId: client.id,
        content: composerContent,
        profiles: selectedProfiles,
        mediaUrls: [],
        scheduledFor: action === 'schedule' ? new Date(scheduledDate).toISOString() : new Date().toISOString()
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success(action === 'publish' ? "Post published successfully!" : "Post scheduled!");
      setPosts([...posts, data.post]);
      setIsComposerOpen(false);
      setComposerContent("");
      setSelectedProfiles([]);
      setScheduledDate("");
    } catch (err: any) {
      toast.error(err.message);
    }
    setIsPublishing(false);
  };

  const toggleProfile = (profileId: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId) ? prev.filter(id => id !== profileId) : [...prev, profileId]
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'facebook': return <FaFacebook className="h-4 w-4 text-blue-600" />;
      case 'twitter': return <FaTwitter className="h-4 w-4 text-blue-400" />;
      case 'linkedin': return <FaLinkedin className="h-4 w-4 text-blue-700" />;
      case 'instagram': return <FaInstagram className="h-4 w-4 text-pink-600" />;
      default: return <Share2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Social Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your social calendar, publish to multiple accounts, and track metrics.
          </p>
        </div>
        <Button onClick={() => setIsComposerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="metrics">Reports</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>
        
        {/* CALENDAR TAB */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming & Published</CardTitle>
              <CardDescription>Your social content calendar</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-32 flex items-center justify-center text-slate-500">Loading calendar...</div>
              ) : posts.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-slate-500 bg-slate-50 border border-dashed rounded-lg">
                  <CalendarIcon className="h-8 w-8 mb-2 opacity-50" />
                  <p>No posts scheduled yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-md flex items-center justify-center shrink-0">
                          <ImageIcon className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span className="flex items-center">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {new Date(post.scheduled_for).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              {post.profiles.map((pId: string) => {
                                const prof = profiles.find(p => p.id === pId);
                                return prof ? <span key={pId} title={prof.platform}>{getPlatformIcon(prof.platform)}</span> : null;
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          post.status === 'published' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                          post.status === 'scheduled' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                          'bg-gray-50 text-gray-700 ring-gray-600/20'
                        }`}>
                          {post.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* METRICS TAB */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.length > 0 ? metrics[metrics.length - 1].followers.toLocaleString() : '0'}</div>
                <p className="text-xs text-muted-foreground">+3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.reduce((acc, curr) => acc + curr.engagement, 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total interactions last 30d</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reach</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.reduce((acc, curr) => acc + curr.reach, 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Unique views last 30d</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Audience Growth</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                {metrics.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                      <Tooltip />
                      <Area type="monotone" dataKey="followers" stroke="#10b981" fillOpacity={1} fill="url(#colorFollowers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">Loading data...</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACCOUNTS TAB */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Zernio API Integration Status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {profiles.map(profile => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        {getPlatformIcon(profile.platform)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm capitalize">{profile.platform}</p>
                        <p className="text-xs text-slate-500">{profile.handle}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* COMPOSER DIALOG */}
      <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Compose Post</DialogTitle>
            <DialogDescription>Create a post and select which social profiles to publish to.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            
            {/* Account Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">1. Select Accounts</label>
              <div className="flex flex-wrap gap-2">
                {profiles.map(profile => (
                  <div 
                    key={profile.id} 
                    className={`flex items-center gap-2 px-3 py-2 border rounded-full text-sm cursor-pointer transition-colors ${selectedProfiles.includes(profile.id) ? 'bg-primary text-primary-foreground border-primary' : 'bg-slate-50 hover:bg-slate-100'}`}
                    onClick={() => toggleProfile(profile.id)}
                  >
                    {getPlatformIcon(profile.platform)}
                    <span>{profile.handle}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Entry */}
            <div>
              <label className="text-sm font-medium mb-2 block">2. Post Content</label>
              <Textarea 
                placeholder="What do you want to share?" 
                className="h-32 resize-none"
                value={composerContent}
                onChange={(e) => setComposerContent(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm"><ImageIcon className="h-4 w-4 mr-2" /> Add Image</Button>
                <Button variant="outline" size="sm"><Video className="h-4 w-4 mr-2" /> Add Video</Button>
              </div>
            </div>

            {/* Scheduling */}
            <div>
              <label className="text-sm font-medium mb-2 block">3. When to Publish?</label>
              <div className="flex items-center gap-4 bg-slate-50 p-4 border rounded-lg">
                <div className="flex-1">
                  <Input 
                    type="datetime-local" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave empty to publish immediately.</p>
                </div>
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsComposerOpen(false)}>Cancel</Button>
            {scheduledDate ? (
              <Button onClick={() => handlePublish('schedule')} disabled={isPublishing}>
                <Clock className="h-4 w-4 mr-2" />
                {isPublishing ? 'Scheduling...' : 'Schedule Post'}
              </Button>
            ) : (
              <Button onClick={() => handlePublish('publish')} disabled={isPublishing}>
                <Share2 className="h-4 w-4 mr-2" />
                {isPublishing ? 'Publishing...' : 'Publish Now'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
