'use client';

interface HamburgerIconProps {
  className?: string;
  onClick?: () => void;
  isOpen?: boolean;
}

export default function HamburgerIcon({ className = '', onClick, isOpen = false }: HamburgerIconProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors lg:hidden ${className}`}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}
