import {redirect} from 'next/navigation';
import {routing} from '../i18n/routing';

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
  // Use the default locale from routing configuration (which reads from env)
  redirect(`/${routing.defaultLocale}`);
}