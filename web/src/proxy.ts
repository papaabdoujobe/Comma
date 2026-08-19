import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// List of available hostnames for development and production
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'wedreaminpixels.com'

export async function proxy(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get('host') || ''

  // e.g., 'report.theirdomain.com' or 'agency.wedreaminpixels.com'
  
  // Update user's auth session
  let response = await updateSession(req)

  // If the session update issued a redirect (e.g. to /login), return it immediately
  if (response.headers.get('location')) {
    return response
  }

  // Extract the subdomain or custom domain
  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
      ? hostname.replace(`.vercel.app`, '')
      : hostname.replace(`.localhost:3000`, '')

  // If the request is for the root domain or localhost, allow it to pass through
  // Or handle landing page rendering
  if (
    currentHost === ROOT_DOMAIN ||
    currentHost === 'localhost:3000' ||
    currentHost === '127.0.0.1:3000'
  ) {
    // Optionally rewrite to a specific marketing or landing page structure
    // return NextResponse.rewrite(new URL(`/home${url.pathname}`, req.url))
    return response
  }

  // Exclude public files and Next.js internal routes
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return response
  }

  // Rewrite to the dynamic [domain] folder
  // Make sure we preserve the cookies modified by Supabase middleware
  const rewriteUrl = new URL(`/${currentHost}${url.pathname}`, req.url)
  const finalResponse = NextResponse.rewrite(rewriteUrl)
  
  // Copy cookies from Supabase updateSession response
  response.cookies.getAll().forEach(cookie => {
    finalResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  return finalResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
