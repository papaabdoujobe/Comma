"use client";

import React, { useState, useEffect } from 'react';
import { ContentEditor } from '@/components/content-editor';
import { SeoScoreGauge } from '@/components/seo-score-gauge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { calculateSeoScore } from '@/lib/scoring';

export default function ContentOptimizerClient({ initialDraft }: { initialDraft: any }) {
  const [content, setContent] = useState(initialDraft.content_body || '');
  const [score, setScore] = useState(initialDraft.seo_score || 0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Dynamic score calculation
    const currentScore = calculateSeoScore(content, initialDraft.focus_keyword || '');
    setScore(currentScore);
  }, [content, initialDraft.focus_keyword]);

  const handleAutoOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: content, keyword: initialDraft.focus_keyword || '' }),
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.optimizedHtml);
        await supabase.from('content_drafts').update({ content_body: data.optimizedHtml }).eq('id', initialDraft.id);
      }
    } catch (error) {
      console.error('Optimization failed', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await supabase.from('content_drafts').update({ content_body: content, seo_score: score }).eq('id', initialDraft.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  const keywordList = [
    { word: "google business profile", used: content.toLowerCase().includes("google business profile") },
    { word: "local citations", used: content.toLowerCase().includes("local citations") },
    { word: "local pack", used: content.toLowerCase().includes("local pack") },
    { word: "NAP consistency", used: content.toLowerCase().includes("nap consistency") },
    { word: "customer reviews", used: content.toLowerCase().includes("customer reviews") },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#f0f2f5]">
      {/* Header Bar */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`../content`} className="text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{initialDraft.title}</h1>
            <p className="text-sm text-gray-500">Focus Keyword: <span className="font-semibold text-primary">{initialDraft.focus_keyword || 'Not assigned'}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Draft</>}
          </Button>
          <Button className="bg-[#E06719] hover:bg-[#c95d17] text-white">
            Publish to {initialDraft.target_cms || 'CMS'}
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
              <h3 className="font-semibold text-gray-900 mb-4">LSI Keywords (Mocked)</h3>
              <div className="space-y-3">
                {keywordList.map((kw, i) => (
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
