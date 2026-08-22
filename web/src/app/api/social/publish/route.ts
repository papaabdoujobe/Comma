import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, content, profiles, mediaUrls } = body;

    if (!clientId || !content || !profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const zernioApiKey = process.env.ZERNIO_API_KEY;

    if (zernioApiKey) {
      try {
        // Mock Zernio API call for publishing
        // We'd map over profiles and send requests, or Zernio might accept an array of profiles
        console.log("Mock publishing to Zernio:", { content, profiles, mediaUrls });
      } catch (err) {
        console.error("Zernio API Error:", err);
      }
    }

    // Save to our social_posts table as published
    const { data: post, error } = await supabase
      .from('social_posts')
      .insert([
        {
          user_id: user.id,
          client_id: clientId,
          content,
          profiles,
          media_urls: mediaUrls || [],
          status: 'published'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Zernio publish error:', error);
    return NextResponse.json({ error: error.message || 'Failed to publish post' }, { status: 500 });
  }
}
