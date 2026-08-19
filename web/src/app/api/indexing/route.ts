import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: 'Please provide an array of URLs' }, { status: 400 });
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      console.error("Google Indexing API credentials missing from environment variables");
      return NextResponse.json({ error: 'Service account credentials missing' }, { status: 500 });
    }

    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });

    const tokens = await jwtClient.authorize();

    // Construct multipart/mixed payload for batching
    const boundary = '===============Batch_Boundary_NextJS==';
    let requestBody = '';

    urls.forEach((url, index) => {
      requestBody += `--${boundary}\r\n`;
      requestBody += `Content-Type: application/http\r\n`;
      requestBody += `Content-ID: <item${index}>\r\n\r\n`;
      requestBody += `POST /v3/urlNotifications:publish HTTP/1.1\r\n`;
      requestBody += `Content-Type: application/json\r\n\r\n`;
      requestBody += JSON.stringify({
        url: url,
        type: 'URL_UPDATED'
      }) + '\r\n\r\n';
    });

    requestBody += `--${boundary}--\r\n`;

    const response = await fetch('https://indexing.googleapis.com/batch', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/mixed; boundary=${boundary}`,
        'Authorization': `Bearer ${tokens.access_token}`
      },
      body: requestBody
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Batch indexing failed:', errorText);
      return NextResponse.json({ error: 'Failed to process batch request' }, { status: response.status });
    }

    const result = await response.text();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Indexing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
