import createMiddleware from 'next-intl/middleware';
import {routing} from '../i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Create middleware with custom configuration
const intlMiddleware = createMiddleware({
  ...routing,
  // Ensure the default locale is used from environment
  defaultLocale: routing.defaultLocale,
  // Optional: Add locale detection strategies
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude auth routes from internationalization
  if (pathname === '/auth' || pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }
  
  // Apply internationalization middleware to all other routes
  return intlMiddleware(request);
}
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};