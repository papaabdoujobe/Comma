import React from 'react';
import ContentOptimizerClient from './content-optimizer-client';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ContentOptimizerPage(props: { params: Promise<{ domain: string, id: string }> }) {
  const params = await props.params;
  const domain = params.domain;
  const id = params.id;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the actual draft from the database
  const { data: draft, error } = await supabase
    .from('content_drafts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !draft) {
    console.error("Draft not found:", error);
    // You could redirect or show an error state here
    return <div className="p-8 text-center text-red-500">Draft not found or you do not have permission.</div>;
  }

  return <ContentOptimizerClient initialDraft={draft} />;
}
