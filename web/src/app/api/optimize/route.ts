import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { html, keyword } = await req.json();

    if (!html || !keyword) {
      return NextResponse.json({ error: 'Content and keyword are required' }, { status: 400 });
    }

    // MOCK LLM INTEGRATION
    // In production, we'd send this to OpenAI/Anthropic or via n8n webhook.
    // For now, we simulate an AI rewriting the content to inject keywords.

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

    let optimizedHtml = html;

    // Simulate AI adding an H1 if missing, or modifying it
    if (!optimizedHtml.includes('<h1')) {
      optimizedHtml = `<h1>The Ultimate Guide to ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}</h1>\n` + optimizedHtml;
    } else {
      optimizedHtml = optimizedHtml.replace(/<h1[^>]*>([^<]+)<\/h1>/i, `<h1>$1 and ${keyword}</h1>`);
    }

    // Simulate AI adding an H2
    if (!optimizedHtml.includes('<h2')) {
      optimizedHtml += `\n<h2>Why ${keyword} matters for your business</h2>\n<p>Integrating ${keyword} into your strategy is crucial for long-term success. It ensures that you stay ahead of the competition and maximize your ROI.</p>`;
    }

    // Add some body text with the keyword to increase density
    optimizedHtml += `\n<p>When considering the best approach, remember that ${keyword} is the foundation. We highly recommend focusing on ${keyword} to drive results.</p>`;

    return NextResponse.json({ 
      success: true, 
      optimizedHtml 
    });

  } catch (error: any) {
    console.error('API Optimize Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to optimize content' }, { status: 500 });
  }
}
