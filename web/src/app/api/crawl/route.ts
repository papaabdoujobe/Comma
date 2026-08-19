import { NextResponse } from 'next/server'
import { extractSitemapUrls } from '@/lib/crawling'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Attempt to extract sitemap URLs
    let pages = await extractSitemapUrls(url)

    // Fallback if sitemap fails or is empty
    if (pages.length === 0) {
      console.log('Sitemap empty, falling back to API extraction (mocked for now)')
      
      // In a full integration, we would call DataForSEO SERP API for "site:domain.com"
      // or trigger the n8n webhook here to crawl the site.
      
      const baseUrl = new URL(url.startsWith('http') ? url : `https://${url}`).origin
      pages = [
        `${baseUrl}/`,
        `${baseUrl}/about`,
        `${baseUrl}/services`,
        `${baseUrl}/contact`,
        `${baseUrl}/blog/seo-tips`,
      ]
    }

    return NextResponse.json({ 
      success: true, 
      count: pages.length, 
      pages 
    })

  } catch (error: any) {
    console.error('API Crawl Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to crawl website' }, { status: 500 })
  }
}
