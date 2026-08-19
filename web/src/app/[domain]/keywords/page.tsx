"use client"

import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KeywordsPage() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    setLoading(true);
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keyword,
          location_name: 'United States',
          language_name: 'English',
          depth: 10
        })
      });

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#f0f2f5]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Keywords</h2>
          <p className="text-sm text-gray-500 mt-1">Track your SEO performance and rankings</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Live SERP Check</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter a keyword to track..."
                type="text"
              />
            </div>
            <button
              disabled={loading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              type="submit"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Analyzing...' : 'Track Keyword'}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Mock Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">Keywords in Top 3</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold text-gray-900">12</div>
             <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1"/> +2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">Keywords in Top 10</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold text-gray-900">48</div>
             <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1"/> +5 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">Keywords in Top 100</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold text-gray-900">156</div>
             <p className="text-xs text-red-600 flex items-center mt-1"><TrendingDown className="w-3 h-3 mr-1"/> -3 this week</p>
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
                    <th className="px-4 py-3 font-medium">Change</th>
                    <th className="px-4 py-3 font-medium">Volume</th>
                    <th className="px-4 py-3 font-medium">KD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">seo strategies</td>
                    <td className="px-4 py-3">2</td>
                    <td className="px-4 py-3 text-green-600 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> 1</td>
                    <td className="px-4 py-3">12,100</td>
                    <td className="px-4 py-3 text-yellow-600">45</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">webflow agency</td>
                    <td className="px-4 py-3">5</td>
                    <td className="px-4 py-3 text-gray-400 flex items-center"><Minus className="w-3 h-3 mr-1"/> 0</td>
                    <td className="px-4 py-3">3,600</td>
                    <td className="px-4 py-3 text-green-600">21</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">nextjs 15 features</td>
                    <td className="px-4 py-3">12</td>
                    <td className="px-4 py-3 text-red-600 flex items-center"><TrendingDown className="w-3 h-3 mr-1"/> 3</td>
                    <td className="px-4 py-3">1,200</td>
                    <td className="px-4 py-3 text-red-600">76</td>
                  </tr>
                </tbody>
             </table>
           </div>
           
           {/* If we have API results, we can dump them here for testing */}
           {results && (
             <div className="mt-8">
               <h3 className="text-sm font-semibold mb-2">API Response (Debug)</h3>
               <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto max-h-96">
                 {JSON.stringify(results, null, 2)}
               </pre>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
