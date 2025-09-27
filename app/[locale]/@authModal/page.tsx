'use client';

import HybridDialog from "@/components/ui/hybrid-dialog";
import { useAuth } from "@/components/features/auth/AuthContext";
import { AuthOptions } from "@/components/features/auth";

export default function AuthModalPage() {
    const { isAuthModalOpen, closeAuthModal } = useAuth();
    
    return (
        <HybridDialog 
            open={isAuthModalOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeAuthModal();
                }
            }}
        >
         <AuthOptions />
        </HybridDialog>
    );
}   