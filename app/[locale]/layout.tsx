import { ringsideCompressed, ringsideNarrow } from "../fonts";
import "../globals.css";
import {Locale, hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '../../i18n/routing';
import { notFound } from "next/navigation";
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
          {children}
        </NextIntlClientProvider>
        </body>
    </html>
  );
}
