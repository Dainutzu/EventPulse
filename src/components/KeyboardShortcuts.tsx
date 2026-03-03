"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function KeyboardShortcuts() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for G prefix
            if (e.key.toLowerCase() === 'g') {
                const nextKeyHandler = (nextE: KeyboardEvent) => {
                    const key = nextE.key.toLowerCase();
                    if (key === 'h') router.push('/home');
                    if (key === 'e') router.push('/explore');
                    if (key === 'p') router.push('/profile');
                    window.removeEventListener('keydown', nextKeyHandler);
                };
                window.addEventListener('keydown', nextKeyHandler, { once: true });
                // Timeout to clear the listener if no second key is pressed
                setTimeout(() => window.removeEventListener('keydown', nextKeyHandler), 1000);
            }

            // Search shortcut
            if (e.key === '/') {
                e.preventDefault();
                // This would focus a search input if we had its ref or ID
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) searchInput.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return null;
}
