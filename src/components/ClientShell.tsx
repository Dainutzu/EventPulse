"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { BottomNav } from "@/components/ui";

export function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            <KeyboardShortcuts />
            {/* Main Application Container */}
            <div className="min-h-screen flex relative w-full overflow-x-hidden">
                {/* Desktop Sidebar */}
                <div id="desktop-sidebar-container" className="hidden lg:block">
                    <DesktopSidebar />
                </div>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0">
                    <div className="mx-auto w-full max-w-screen-2xl min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] relative shadow-2xl lg:shadow-none shadow-black/50 overflow-x-hidden transition-all duration-300 px-6 lg:px-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.15 }}
                                className="w-full h-full pb-24 lg:pb-12"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>

                        <div className="lg:hidden">
                            <BottomNav />
                        </div>
                    </div>
                </main>

                {/* Analytics Panel */}
                <div id="analytics-panel-container" className="hidden xl:block w-[360px] shrink-0 border-l border-[var(--color-border)] p-10">
                    <AnalyticsPanel />
                </div>
            </div>
        </>
    );
}
