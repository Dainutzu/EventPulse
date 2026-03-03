"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav } from "@/components/ui";

export function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            {/* Main Application Container */}
            <div className="min-h-screen relative w-full overflow-x-hidden">
                {/* Main Content Area */}
                <main className="w-full flex flex-col min-w-0">
                    <div className="mx-auto w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] relative shadow-2xl overflow-x-hidden transition-all duration-300 px-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.15 }}
                                className="w-full h-full pb-24"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>

                        <BottomNav />
                    </div>
                </main>
            </div>
        </>
    );
}
