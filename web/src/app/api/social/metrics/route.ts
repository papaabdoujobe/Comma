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

    // Generate mock metrics for 30 days
    const mockMetrics = [];
    const now = new Date();
    
    let baseFollowers = 40500;
    
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      
      const newFollowers = Math.floor(Math.random() * 50) - 10; // slightly positive trend
      baseFollowers += newFollowers;
      
      mockMetrics.push({
        date: d.toISOString().split('T')[0],
        engagement: Math.floor(Math.random() * 500) + 100,
        reach: Math.floor(Math.random() * 5000) + 1500,
        followers: baseFollowers
      });
    }

    return NextResponse.json({ success: true, metrics: mockMetrics });
  } catch (error: any) {
    console.error('Zernio metrics error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch metrics' }, { status: 500 });
  }
}
