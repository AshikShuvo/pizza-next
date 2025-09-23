import {defineRouting} from 'next-intl/routing';

// Get default locale from environment variable, fallback to 'en'
const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';

// Validate that the environment variable contains a valid locale
const supportedLocales = ['en', 'no'];
const validDefaultLocale = supportedLocales.includes(defaultLocale) ? defaultLocale : 'en';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: supportedLocales,
 
  // Used when no locale matches - now uses environment variable
  defaultLocale: validDefaultLocale
});