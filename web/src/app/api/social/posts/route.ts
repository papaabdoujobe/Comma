import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    const { data: posts, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('client_id', clientId)
      .order('scheduled_for', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, content, profiles, mediaUrls, scheduledFor } = body;

    if (!clientId || !content || !profiles || profiles.length === 0 || !scheduledFor) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: post, error } = await supabase
      .from('social_posts')
      .insert([
        {
          user_id: user.id,
          client_id: clientId,
          content,
          profiles,
          media_urls: mediaUrls || [],
          status: 'scheduled',
          scheduled_for: scheduledFor
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
