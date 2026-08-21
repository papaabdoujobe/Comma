"use client"

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createClient } from '@/utils/supabase/client';

type IndexingRequest = {
  id: string;
  url: string;
  status: string;
  created_at: string;
};

export default function IndexingClient({ domain, initialRequests, user }: { domain: string, initialRequests: IndexingRequest[], user: any }) {
  const [urls, setUrls] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<IndexingRequest[]>(initialRequests);
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urls.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    const urlList = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0);

    try {
      // Hit the indexing API
      const response = await fetch('/api/indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlList })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit batch request');
      }

      // Save to Supabase
      const newRequestsToInsert = urlList.map(url => ({
        user_id: user.id,
        domain,
        url,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      }));

      const { data: insertedData, error: dbError } = await supabase
        .from('indexing_requests')
        .insert(newRequestsToInsert)
        .select();

      if (dbError) console.error("Error saving to db:", dbError);
      
      if (insertedData) {
        setRequests(prev => [...insertedData, ...prev]);
      }

      setResult({ count: urlList.length, details: data.result });
      setUrls(''); // Clear on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#f0f2f5]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Bulk Indexation</h2>
        <p className="text-sm text-gray-500 mt-1">Submit multiple URLs directly to Google's Indexing API</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary" />
                Submit URLs
              </CardTitle>
              <CardDescription>
                Paste up to 200 URLs below (one per line). We'll batch process them to request priority crawling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <textarea
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    placeholder="https://example.com/page-1&#10;https://example.com/page-2"
                    className="w-full h-64 p-4 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-none font-mono"
                    disabled={loading}
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !urls.trim()}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Processing Batch...' : 'Submit Batch Request'}
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-900">Submission Error</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-green-900">Successfully submitted {result.count} URLs!</h4>
                    <p className="text-xs text-green-700 mt-1">Google has received the ping. Note that crawling is not guaranteed immediately.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Recent Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <p className="text-sm text-gray-500">No recent submissions.</p>
              ) : (
                <ul className="space-y-4">
                  {requests.slice(0, 10).map((req) => (
                    <li key={req.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-gray-900 truncate" title={req.url}>{req.url}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          {req.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
