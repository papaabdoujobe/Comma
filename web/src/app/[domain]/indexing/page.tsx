import React from 'react';
import IndexingClient from './indexing-client';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function IndexingPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = params.domain;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch recent indexing requests
  const { data: requests, error } = await supabase
    .from('indexing_requests')
    .select('*')
    .eq('domain', domain)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching indexing requests:", error);
  }

  return <IndexingClient domain={domain} initialRequests={requests || []} user={user} />;
}
