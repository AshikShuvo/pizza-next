import { Link } from '../../i18n/navigation';
import { ReactNode } from 'react';

interface ButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Button({
  href,
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  onClick,
}: ButtonProps) {
  const baseClasses = 'flex py-[10px] px-3 justify-center items-center gap-2 flex-1 self-stretch transition-colors focus:outline-none whitespace-nowrap';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'text-[#CD1719]',
    link: 'text-blue-600 hover:text-blue-800 hover:underline focus:ring-blue-500',
  };
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-[17px]',
    lg: 'text-lg',
  };
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <Link href={href} className={combinedClasses} onClick={onClick}>
      <span 
        className="text-center font-[var(--font-ringside-narrow)] text-[17px] leading-[20px] tracking-[0.1px]"
        style={{ fontWeight: 350 }}
      >
        {children}
      </span>
    </Link>
  );
}
