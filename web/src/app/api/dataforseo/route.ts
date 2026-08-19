import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // In a real app, you would use process.env.DATAFORSEO_API_KEY
    // Provided by user: aGVsbG9AcGFwYWFiZG91am9iZS5jb206Zjk3ODE1YzgyOTI3MTBhNQ==
    const authHeader = 'Basic aGVsbG9AcGFwYWFiZG91am9iZS5jb206Zjk3ODE1YzgyOTI3MTBhNQ==';

    const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([data]) // DataForSEO expects an array of tasks
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DataForSEO API failed:', errorText);
      return NextResponse.json({ error: 'Failed to fetch DataForSEO data' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('DataForSEO error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
