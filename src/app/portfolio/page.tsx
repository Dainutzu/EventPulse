"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Share2, Download } from "@/components/ui";
import { BottomNav } from "@/components/ui";
import { motion } from "framer-motion";
import { MOCK_PORTFOLIO } from "@/lib/mockData";
import { formatMonthDay } from "@/lib/mockData";

export default function Portfolio() {
    const router = useRouter();

    return (
        <div className="min-h-screen pb-32">
            {/* Header */}
            <header className="px-6 pt-12 pb-6 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--color-surface)]"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <span className="font-extrabold text-[18px]">Participation Portfolio</span>
                <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--color-surface)]">
                    <Share2 size={20} className="text-white" />
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 px-5 pb-8">
                <div className="bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 rounded-2xl py-4 flex flex-col items-center">
                    <span className="text-3xl font-black text-[var(--color-accent)]">24</span>
                    <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] mt-1 uppercase">Attended</span>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-4 flex flex-col items-center">
                    <span className="text-3xl font-black">05</span>
                    <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] mt-1 uppercase">Organized</span>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-4 flex flex-col items-center">
                    <span className="text-3xl font-black">1.2k</span>
                    <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] mt-1 uppercase">Points</span>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="px-6 relative">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[18px] font-extrabold">Activity Timeline</h2>
                    <div className="bg-[var(--color-accent)]/15 text-[var(--color-accent)] px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider">
                        ACADEMIC YEAR 2023-24
                    </div>
                </div>

                <div className="relative pl-1">
                    {MOCK_PORTFOLIO.map((item, index) => {
                        const dateStr = formatMonthDay(item.date);
                        const isLast = index === MOCK_PORTFOLIO.length - 1;

                        return (
                            <motion.div
                                key={item.id}
                                className="flex gap-4 relative pb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                {/* Timeline connector visual line */}
                                {!isLast && (
                                    <div className="absolute left-[22px] top-11 bottom-0 w-[2px] bg-[var(--color-surface-elevated)]" />
                                )}

                                {/* Timeline Icon Node */}
                                <div className="relative z-10 w-11 h-11 rounded-full bg-[var(--color-surface)] border-[2px] border-[var(--color-border)] flex items-center justify-center text-[18px] shrink-0 shadow-lg mt-1">
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1.5 pb-2">
                                    <h3 className="text-[16px] font-bold leading-tight mb-1">{item.title}</h3>
                                    <p className="text-[13px] text-[var(--color-text-muted)] mb-3">
                                        {item.venue} • {dateStr.month} {dateStr.day}, {new Date(item.date).getFullYear()}
                                    </p>

                                    <div className="flex gap-2 flex-wrap">
                                        <span
                                            className="px-2.5 py-1 rounded-[6px] text-[10px] font-black tracking-wider uppercase border bg-black/20"
                                            style={{ color: item.roleColor, borderColor: `${item.roleColor}40` }}
                                        >
                                            {item.role}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-[6px] text-[10px] font-black tracking-wider uppercase bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                                            +{item.points} PTS
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 pb-8 bg-[#0D0F14]/95 backdrop-blur-xl border-t border-[var(--color-border)] z-50">
                <button className="w-full py-4.5 bg-[var(--color-accent)] text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-transform hover:-translate-y-0.5 active:scale-95 shadow-[0_8px_24px_rgba(59,130,246,0.3)] mb-3 text-[16px]">
                    <Download size={20} />
                    Download Participation Summary
                </button>
                <p className="text-[12px] text-center text-[var(--color-text-muted)] leading-relaxed px-4">
                    A certified PDF of your accomplishments will be generated for your academic records.
                </p>
            </div>
        </div>
    );
}
