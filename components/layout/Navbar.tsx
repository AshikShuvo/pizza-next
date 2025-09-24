import { Link } from '../../i18n/navigation';
import { Image, UserIcon, CartIcon, SearchIcon, HamburgerIcon, Button } from '../ui';
import { getTranslations } from 'next-intl/server';

// Navigation links configuration with translation keys
const navigationLinks = [
  { titleKey: 'home', href: '/' },
  { titleKey: 'about', href: '/about' },
  { titleKey: 'contact', href: '/contact' },
  { titleKey: 'services', href: '/services' },
  { titleKey: 'portfolio', href: '/portfolio' },
];

export default async function Navbar() {
  const t = await getTranslations('Navigation');
  return (
    <header className="p-4">
      <nav className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href={`/`} className="flex items-center hover:opacity-80 transition-opacity">
              <Image 
                src="https://storageaccoutndelydev.blob.core.windows.net/otpwebpage/peppes_brand_logo.CERSH8-x.svg" 
                alt="Peppes App Logo" 
                width={67} 
                height={67}
                priority={true}
                quality={90}
              />
            </Link>
            
            {/* Navigation Links - Hidden on tablet and mobile */}
            <div className="hidden lg:flex">
              {navigationLinks.map((link) => (
                <Button
                  key={link.titleKey}
                  href={link.href}
                  variant="ghost"
                  size="md"
                >
                  {t(link.titleKey)}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Section: Action Icons */}
          <div className="flex items-center space-x-2">
            {/* Action Icons - Always visible */}
            <div className="flex items-center space-x-2">
              <SearchIcon />
              <UserIcon />
              <CartIcon itemCount={3} />
            </div>
            <HamburgerIcon />
          </div>
        </div>
      </nav>
    </header>
  );
}
