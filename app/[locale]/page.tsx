import {Locale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {use} from 'react';
import HomePage from '@/components/HomePage';

// Define the page props type
type PageProps = {
  params: Promise<{locale: string}>;
};

export default function Home({params}: PageProps) {
  const {locale} = use(params);

  // Enable static rendering
  setRequestLocale(locale as Locale);

  return <HomePage />;
}
