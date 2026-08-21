"use client"

import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Loader2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@/utils/supabase/client';

type Keyword = {
  id: string;
  keyword: string;
  location: string;
  intent: string | null;
  last_position: number | null;
  volume: number | null;
  kd: number | null;
  created_at: string;
};

export default function KeywordsClient({ domain, initialKeywords, user }: { domain: string, initialKeywords: Keyword[], user: any }) {
  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords);
  const supabase = createClient();

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordInput.trim()) return;

    setLoading(true);
    try {
      // First, simulate fetching data from DataForSEO
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keywordInput,
          location_name: 'United States',
          language_name: 'English',
          depth: 10
        })
      });
      
      let position = null;
      let volume = Math.floor(Math.random() * 10000); // Mock data for now
      let kd = Math.floor(Math.random() * 100);

      // In a real scenario, we parse the response.json() to get exact rank

      // Now insert into Supabase
      const { data, error } = await supabase
        .from('tracked_keywords')
        .insert([{
          user_id: user.id,
          domain,
          keyword: keywordInput.toLowerCase(),
          location: 'United States',
          last_position: position,
          volume,
          kd
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setKeywords([data, ...keywords]);
      }
      setKeywordInput('');
    } catch (err) {
      console.error("Error adding keyword:", err);
    } finally {
      setLoading(false);
    }
  };

  const top3 = keywords.filter(k => k.last_position && k.last_position <= 3).length;
  const top10 = keywords.filter(k => k.last_position && k.last_position <= 10).length;
  const top100 = keywords.filter(k => k.last_position && k.last_position <= 100).length;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#f0f2f5]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Keywords</h2>
          <p className="text-sm text-gray-500 mt-1">Track your SEO performance and rankings for {domain}</p>
        </div>
      </div>

      <Card className="mb-8 border-primary/20 bg-blue-50/30">
        <CardHeader>
          <CardTitle>Track New Keyword</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddKeyword} className="flex gap-4 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter a keyword to track..."
                type="text"
              />
            </div>
            <button
              disabled={loading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              type="submit"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {loading ? 'Adding...' : 'Add Keyword'}
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">Keywords in Top 3</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold text-gray-900">{top3}</div>
             <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1"/> Auto-updates daily</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">Keywords in Top 10</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold text-gray-900">{top10}</div>
             <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1"/> Auto-updates daily</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">Keywords in Top 100</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold text-gray-900">{top100}</div>
             <p className="text-xs text-gray-500 flex items-center mt-1"><Minus className="w-3 h-3 mr-1"/> Auto-updates daily</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tracked Keywords</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Keyword</th>
                    <th className="px-4 py-3 font-medium">Position</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Volume</th>
                    <th className="px-4 py-3 font-medium">KD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {keywords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No keywords tracked yet. Add one above!
                      </td>
                    </tr>
                  ) : (
                    keywords.map((kw) => (
                      <tr key={kw.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{kw.keyword}</td>
                        <td className="px-4 py-3">
                          {kw.last_position ? (
                            <span className="font-semibold text-gray-900">{kw.last_position}</span>
                          ) : (
                            <span className="text-gray-400">Processing...</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{kw.location}</td>
                        <td className="px-4 py-3 text-gray-600">{kw.volume ? kw.volume.toLocaleString() : '-'}</td>
                        <td className="px-4 py-3">
                          {kw.kd !== null ? (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${kw.kd > 70 ? 'bg-red-100 text-red-700' : kw.kd > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                              {kw.kd}
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
             </table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
