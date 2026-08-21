"use client";

import React, { useState, useEffect } from 'react';
import { ContentEditor } from '@/components/content-editor';
import { SeoScoreGauge } from '@/components/seo-score-gauge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ContentOptimizerPage() {
  const [content, setContent] = useState('<h1>The Ultimate Guide to Local SEO</h1><p>Start writing your content here...</p>');
  const [score, setScore] = useState(42);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Simulated live scoring based on content length/keywords for now
  useEffect(() => {
    const wordCount = content.split(' ').filter(Boolean).length;
    // Dummy scoring algorithm
    let newScore = Math.min(100, Math.max(10, Math.floor(wordCount / 5)));
    setScore(newScore);
  }, [content]);

  const handleAutoOptimize = () => {
    setIsOptimizing(true);
    // Simulate AI optimization delay
    setTimeout(() => {
      setContent(`<h1>The Ultimate Guide to Local SEO (Optimized)</h1><p>Local SEO is critical for small businesses to thrive in their communities. By optimizing your Google Business Profile and building local citations, you can significantly improve your local search visibility.</p><h2>Why Local SEO Matters</h2><p>In today's competitive landscape, showing up in the Local Pack is essential...</p>`);
      setScore(95);
      setIsOptimizing(false);
    }, 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#f0f2f5]">
      {/* Header Bar */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="../content" className="text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Local SEO Guide</h1>
            <p className="text-sm text-gray-500">Focus Keyword: <span className="font-semibold text-primary">local seo</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Draft</>}
          </Button>
          <Button className="bg-[#E06719] hover:bg-[#c95d17] text-white">
            Publish to CMS
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex justify-center">
          <div className="w-full max-w-4xl">
            <ContentEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar / Optimization Panel */}
        <div className="w-80 bg-white border-l shrink-0 overflow-y-auto hidden md:block">
          <div className="p-6 space-y-8">
            
            {/* Score Gauge */}
            <div className="flex flex-col items-center">
              <SeoScoreGauge score={score} />
            </div>

            {/* AI Auto Optimize */}
            <Card className="border-primary/20 bg-orange-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E06719]" />
                  Auto-Optimize
                </CardTitle>
                <CardDescription>
                  Let AI rewrite your content to hit a 90+ SEO score instantly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleAutoOptimize} 
                  disabled={isOptimizing}
                  className="w-full bg-[#E06719] hover:bg-[#c95d17] text-white"
                >
                  {isOptimizing ? 'Optimizing...' : '1-Click Optimize (1 Credit)'}
                </Button>
              </CardContent>
            </Card>

            {/* Keyword Checklist */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">LSI Keywords</h3>
              <div className="space-y-3">
                {[
                  { word: "google business profile", used: score > 50 },
                  { word: "local citations", used: score > 50 },
                  { word: "local pack", used: score > 80 },
                  { word: "NAP consistency", used: false },
                  { word: "customer reviews", used: false },
                ].map((kw, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    {kw.used ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 shrink-0" />
                    )}
                    <span className={kw.used ? "text-gray-900 line-through opacity-70" : "text-gray-700 font-medium"}>
                      {kw.word}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
