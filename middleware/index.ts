import createMiddleware from 'next-intl/middleware';
import {routing} from '../i18n/routing';

// Create middleware with custom configuration
const intlMiddleware = createMiddleware({
  ...routing,
  // Ensure the default locale is used from environment
  defaultLocale: routing.defaultLocale,
  // Optional: Add locale detection strategies
  localeDetection: true
});
 
export default intlMiddleware;
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};