import React from 'react';
import { KanbanBoard } from '@/components/kanban-board';
import { Search, Plus } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ContentPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = params.domain;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: drafts } = await supabase
    .from('content_drafts')
    .select('*')
    .eq('domain', domain)
    .order('updated_at', { ascending: false });

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#f0f2f5]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Calendar</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and publish content for {domain}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              className="pl-9 pr-4 py-2 border-none rounded-lg bg-white shadow-sm text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none w-64"
              placeholder="Search content..."
              type="text"
            />
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Content
          </button>
        </div>
      </div>

      <KanbanBoard domain={domain} initialTasks={drafts || []} userId={user.id} />
    </div>
  );
}
