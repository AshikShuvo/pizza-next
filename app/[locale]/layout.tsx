import { ringsideCompressed, ringsideNarrow } from "../fonts";
import "../globals.css";
import {Locale, hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '../../i18n/routing';
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout";
// Define the layout props type
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
export async function generateMetadata(
  props: Omit<LayoutProps, 'children'>
) {
  const {locale} = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'LocaleLayout'
  });

  return {
    title: t('title'),
    description: "Peppes Next.js application with responsive design",
  };
}

export default async function RootLayout({
  children,
  params
}: LayoutProps) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
  return (
    <html lang={locale}>
      <body
        className={`${ringsideCompressed.variable} ${ringsideNarrow.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <div className="min-h-screen flex flex-col">
            {/* Navbar Section */}
            <Navbar />

            {/* Main Section - Takes maximum height */}
            <main className="flex-1 bg-gray-50">
              {children}
            </main>

            {/* Footer Section */}
            <footer className="bg-gray-900 text-white p-6">
              <div className="container mx-auto">
                <div className="text-center">
                  <p>&copy; 2024 Dummy Footer. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
        </body>
    </html>
  );
}
