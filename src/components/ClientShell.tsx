"use client";

import { useEventStore } from "@/state/useEventStore";

export function ClientShell({ children }: { children: React.ReactNode }) {
    const { isHydrated } = useEventStore();

    if (!isHydrated) return null; // Avoid hydration mismatch

    return (
        <div className="min-h-screen relative w-full overflow-x-hidden">
            {children}
        </div>
    );
}
