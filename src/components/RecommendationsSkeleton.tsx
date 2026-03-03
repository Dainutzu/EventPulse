"use client";

import { motion } from "framer-motion";

export function RecommendationsSkeleton() {
    return (
        <div className="mb-10 -mx-6">
            <div className="flex items-baseline justify-between px-6 mb-4">
                <div>
                    <div className="h-7 w-48 bg-[var(--color-surface-elevated)] rounded-lg animate-pulse mb-2" />
                    <div className="h-3 w-32 bg-[var(--color-surface-elevated)] rounded-md animate-pulse opacity-60" />
                </div>
            </div>
            <div className="flex gap-4 px-6 overflow-x-auto hide-scrollbar pb-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="shrink-0 w-[280px]">
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[28px] p-5 h-[200px] flex flex-col justify-between">
                            <div className="flex gap-6">
                                <div className="w-[70px] h-[80px] rounded-[22px] bg-[var(--color-surface-elevated)] animate-pulse shrink-0" />
                                <div className="flex-1 py-1">
                                    <div className="h-4 w-16 bg-[var(--color-surface-elevated)] rounded-md animate-pulse mb-3" />
                                    <div className="h-5 w-full bg-[var(--color-surface-elevated)] rounded-md animate-pulse mb-2" />
                                    <div className="h-5 w-2/3 bg-[var(--color-surface-elevated)] rounded-md animate-pulse" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--color-border)]">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map((j) => (
                                            <div key={j} className="w-8 h-8 rounded-full bg-[var(--color-surface-elevated)] border-2 border-[var(--color-surface)] animate-pulse" />
                                        ))}
                                    </div>
                                    <div className="h-3 w-16 bg-[var(--color-surface-elevated)] rounded animate-pulse" />
                                </div>
                                <div className="h-10 w-24 bg-[var(--color-surface-elevated)] rounded-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
