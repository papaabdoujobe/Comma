import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import KeywordsClient from './keywords-client';

export default async function KeywordsPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = params.domain;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch tracked keywords for this user and domain
  const { data: keywords, error } = await supabase
    .from('tracked_keywords')
    .select('*')
    .eq('domain', domain)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tracked keywords:", error);
  }

  return <KeywordsClient domain={domain} initialKeywords={keywords || []} user={user} />;
}
