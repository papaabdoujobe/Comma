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

    const zernioApiKey = process.env.ZERNIO_API_KEY;

    let profiles = [];
    if (zernioApiKey) {
      try {
        // Mock Zernio API call to fetch authenticated profiles
        // e.g. await fetch('https://api.zernio.com/v1/profiles', { ... })
        // Since we don't have the real endpoint, we generate mock profiles.
        
        profiles = [
          { id: 'z_123', platform: 'linkedin', handle: 'Commas Agency', followers: 4500 },
          { id: 'z_456', platform: 'twitter', handle: '@commas_io', followers: 12000 },
          { id: 'z_789', platform: 'facebook', handle: 'Commas', followers: 8900 },
          { id: 'z_012', platform: 'instagram', handle: '@commas_io', followers: 15400 }
        ];
      } catch (err) {
        console.error("Zernio API Error:", err);
      }
    }

    return NextResponse.json({ success: true, profiles });
  } catch (error: any) {
    console.error('Zernio auth error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch profiles' }, { status: 500 });
  }
}
