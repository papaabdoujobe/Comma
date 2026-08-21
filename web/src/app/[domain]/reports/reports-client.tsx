"use client";

import { useState } from "react";
import { LayoutDashboard, Activity, Search, Share2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const REPORT_MODULES = [
  {
    id: "seo",
    title: "SEO Performance",
    description: "Track keyword rankings, organic traffic, and backlink growth over time.",
    icon: Search,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: "traffic",
    title: "Website Traffic",
    description: "Analyze visitor metrics, bounce rates, and user acquisition channels.",
    icon: Activity,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    id: "social",
    title: "Social Media",
    description: "Monitor engagement, follower growth, and post performance across platforms.",
    icon: Share2,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    id: "content",
    title: "Content ROI",
    description: "Measure how your blog posts and articles are driving conversions.",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-50",
  }
];

export function ReportsClient() {
  const [activeClient, setActiveClient] = useState("");

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports Hub</h2>
          <p className="text-muted-foreground mt-1">Select a module to view detailed analytics for your client.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mt-4">
        {REPORT_MODULES.map((module) => (
          <Card key={module.id} className="hover:border-primary/50 transition-all cursor-pointer group flex flex-col">
            <CardHeader>
              <div className={`h-12 w-12 rounded-lg ${module.bg} ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <module.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription className="mt-2 min-h-[60px]">{module.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4 border-t">
              <Button variant="ghost" className="w-full justify-between group-hover:text-primary">
                View Report
                <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                  &rarr;
                </span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
