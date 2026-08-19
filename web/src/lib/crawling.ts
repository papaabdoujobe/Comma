import Sitemapper from 'sitemapper'

export async function extractSitemapUrls(websiteUrl: string): Promise<string[]> {
  // Ensure protocol exists
  if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
    websiteUrl = `https://${websiteUrl}`
  }

  const url = new URL(websiteUrl)
  const rootUrl = `${url.protocol}//${url.host}`
  
  // Initialize sitemapper
  const sitemapper = new Sitemapper({
    url: `${rootUrl}/sitemap.xml`,
    timeout: 15000, // 15 seconds
  })

  try {
    const { sites } = await sitemapper.fetch()
    
    // Fallback: If sitemapper fails, we would integrate DataForSEO or GSC API here
    
    return sites || []
  } catch (error) {
    console.error('Error fetching sitemap:', error)
    return []
  }
}
