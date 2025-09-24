'use client';

import { useAuthContext } from '@/components/features/auth';
import UserDropdown from '@/components/features/auth/UserDropdown';

interface UserIconProps {
  className?: string;
}

export default function UserIcon({ className = '' }: UserIconProps) {
  const { isAuthenticated } = useAuthContext();

  const handleClick = () => {
    if (isAuthenticated) {
      // For authenticated users, the dropdown will handle the click
      return;
    } else {
      // For non-authenticated users, just log for now
      console.log('User icon clicked - not authenticated');
    }
  };

  if (isAuthenticated) {
    return <UserDropdown className={className} />;
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label="User account"
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
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </button>
  );
}
