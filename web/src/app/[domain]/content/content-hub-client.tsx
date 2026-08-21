"use client";

import { Calendar, Zap, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CONTENT_MODULES = [
  {
    id: "calendar",
    title: "Content Calendar",
    description: "Manage your editorial workflow, schedule posts, and track drafts.",
    icon: Calendar,
    color: "text-blue-500",
    bg: "bg-blue-50",
    href: "/content/calendar"
  },
  {
    id: "optimizer",
    title: "Content Optimizer",
    description: "Use AI to optimize existing content for target keywords and search intent.",
    icon: Zap,
    color: "text-orange-500",
    bg: "bg-orange-50",
    href: "/content/optimizer"
  }
];

export function ContentHubClient() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Hub</h2>
          <p className="text-muted-foreground mt-1">Manage your editorial workflow and optimize your existing content.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mt-4">
        {CONTENT_MODULES.map((module) => (
          <Card key={module.id} className="hover:border-primary/50 transition-all cursor-pointer group flex flex-col">
            <CardHeader>
              <div className={`h-12 w-12 rounded-lg ${module.bg} ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <module.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription className="mt-2 min-h-[40px]">{module.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4 border-t">
              <Link href={module.href} className="w-full">
                <Button variant="ghost" className="w-full justify-between group-hover:text-primary">
                  Open Module
                  <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                    &rarr;
                  </span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
