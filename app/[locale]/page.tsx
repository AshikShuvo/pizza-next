import {Locale, useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {use} from 'react';
import {Link} from '../../i18n/navigation';

// Define the page props type
type PageProps = {
  params: Promise<{locale: string}>;
};

export default function Home({params}: PageProps) {
  const {locale} = use(params);

  // Enable static rendering
  setRequestLocale(locale as Locale);
  const t = useTranslations('HomePage');

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-5xl font-ringside-compressed-bold mb-6 text-gray-900">{t('title')}</h1>
        <h1 className="text-5xl font-ringside-compressed-bold mb-6 text-gray-900">
          Welcome to Your App
        </h1>
        <p className="text-xl font-ringside-compressed-regular mb-8 text-gray-600">
          Your local Ringside fonts are now set up and ready to use.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/theme" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-ringside-compressed-medium px-8 py-3 rounded-lg transition-colors duration-200"
          >
            View Font Theme Examples
          </Link>
          
          <div className="text-sm text-gray-500 font-ringside-narrow-regular">
            <p>Available fonts: Ringside Compressed & Ringside Narrow</p>
            <p>Visit <code>/theme</code> to see all font examples and usage instructions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
