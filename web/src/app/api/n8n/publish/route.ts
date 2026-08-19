import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Retrieve the webhook URL from environment variables
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

    if (!webhookUrl) {
      return NextResponse.json({ error: 'N8N Webhook URL not configured' }, { status: 500 })
    }

    // Forward the payload to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('N8n webhook failed:', errorText)
      return NextResponse.json({ error: 'Failed to trigger N8n workflow' }, { status: response.status })
    }

    const result = await response.json().catch(() => ({ success: true }))
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('N8n publish error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
