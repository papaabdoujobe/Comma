"use client";

import { useState } from "react";
import { Send, Sparkles, User, Bot, LineChart, FileText, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  artifact?: "seo_chart" | "traffic_summary";
}

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your Commas AI assistant. I can help you analyze your SEO data, create content, or manage your sites. What would you like to do today?",
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate AI response with a Generative UI artifact
    setTimeout(() => {
      const isSEOQuery = userMsg.content.toLowerCase().includes("seo") || userMsg.content.toLowerCase().includes("traffic");
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isSEOQuery 
          ? "Here is a quick overview of your SEO performance over the last 30 days." 
          : "I can certainly help with that. Here are the details you requested.",
        artifact: isSEOQuery ? "seo_chart" : undefined,
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] max-h-[600px] mb-8">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Commas Assistant</h3>
          <p className="text-xs text-slate-500">Ask about your data, generate content, or automate tasks</p>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
            <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-slate-100" : "bg-primary/10"}`}>
              {msg.role === "user" ? <User className="h-4 w-4 text-slate-600" /> : <Bot className="h-4 w-4 text-primary" />}
            </div>
            
            <div className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm"
              }`}>
                {msg.content}
              </div>

              {/* Generative UI Artifacts */}
              {msg.artifact === "seo_chart" && (
                <Card className="w-full max-w-sm border-slate-200 shadow-sm mt-2 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <LineChart className="h-4 w-4 text-blue-500" />
                      Organic Traffic Overview
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-slate-900">12,450</span>
                      <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                        <TrendingUp className="h-3 w-3 mr-1" /> +14.2%
                      </span>
                    </div>
                    {/* Mock simple bar chart layout */}
                    <div className="flex items-end gap-1.5 h-24 pt-4 border-t border-slate-100">
                      {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-100 rounded-t-sm hover:bg-blue-200 transition-colors relative group">
                          <div 
                            className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-500"
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form 
          onSubmit={handleSend}
          className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your SEO traffic, or say 'draft a blog post'..."
            className="w-full bg-transparent border-none py-3 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <div className="flex gap-2 mt-3 px-1 overflow-x-auto pb-1 hide-scrollbar">
          {["Analyze my traffic", "Draft a new blog post", "Check keyword rankings"].map((suggestion) => (
            <button 
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="shrink-0 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <FileText className="h-3 w-3" /> {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
