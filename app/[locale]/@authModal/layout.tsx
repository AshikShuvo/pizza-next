
'use client';

import { useAuth } from '@/components/features/auth/AuthContext';

export default function AuthModalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthModalOpen } = useAuth();
  
  if (!isAuthModalOpen) {
    return null;
  }
  
  return <>{children}</>;
}