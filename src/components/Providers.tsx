"use client";

import React from "react";
import { ThemeProvider } from "@/state/useThemeStore";
import { EventProvider } from "@/state/useEventStore";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <EventProvider>
                {children}
            </EventProvider>
        </ThemeProvider>
    );
}
