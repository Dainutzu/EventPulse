"use client";

import { ChevronLeft, Share2, Download } from "@/components/ui";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandingFooter } from "@/components/BrandingFooter";
import { motion } from "framer-motion";
import { MOCK_PORTFOLIO } from "@/lib/mockUser";
import { formatMonthDay } from "@/lib/utils/date";

export default function PortfolioContent() {
    return (
        <div className="pb-32">
            {/* Header Area */}
            <header className="px-6 pt-12 pb-6 flex items-center justify-between">
                <div className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center transition-colors active:bg-[var(--color-surface)] group opacity-0 pointer-events-none">
                    <ChevronLeft size={24} className="text-white" />
                </div>
                <div className="flex flex-col items-center">
                    <BrandLogo size={32} rounded="rounded-lg" className="mb-1" />
                    <span className="font-extrabold text-[15px]">Portfolio</span>
                </div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center active:bg-[var(--color-surface)]">
                    <Share2 size={20} className="text-white" />
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 px-5 pb-12">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-[32px] py-8 flex flex-col items-center shadow-lg">
                    <span className="text-4xl font-black text-blue-500 mb-2">24</span>
                    <span className="text-[10px] font-black tracking-[0.2em] text-[var(--color-text-muted)] uppercase">Attended</span>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] py-8 flex flex-col items-center shadow-md">
                    <span className="text-4xl font-black mb-2">05</span>
                    <span className="text-[10px] font-black tracking-[0.2em] text-[var(--color-text-muted)] uppercase">Organized</span>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] py-8 flex flex-col items-center shadow-md">
                    <span className="text-4xl font-black mb-2">1.2k</span>
                    <span className="text-[10px] font-black tracking-[0.2em] text-[var(--color-text-muted)] uppercase">Points</span>
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
                                {!isLast && (
                                    <div className="absolute left-[22px] top-11 bottom-0 w-[2px] bg-[var(--color-surface-elevated)]" />
                                )}

                                <div className="relative z-10 w-11 h-11 rounded-full bg-[var(--color-surface)] border-[2px] border-[var(--color-border)] flex items-center justify-center text-[18px] shrink-0 shadow-lg mt-1">
                                    {item.icon}
                                </div>

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

            <div className="mb-20 px-6">
                <div className="p-8 bg-gradient-to-br from-blue-900/40 to-indigo-900/30 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-black mb-4">Export Official Record</h2>
                        <p className="text-[15px] text-white/70 leading-relaxed font-medium mb-10">
                            Generate a certified PDF summary of your university engagements, skills acquired, and impact points. Perfect for internships and job applications.
                        </p>
                        <div className="flex flex-col gap-4">
                            <button className="py-5 bg-blue-600 text-white font-black rounded-[24px] flex items-center justify-center gap-3 active:scale-95 shadow-[0_20px_40px_rgba(37,99,235,0.4)]">
                                <Download size={22} />
                                Download PDF Portrait
                            </button>
                            <button className="py-5 bg-white/10 text-white font-black rounded-[24px] flex items-center justify-center gap-3 active:scale-95">
                                <Share2 size={22} />
                                Share Public Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <BrandingFooter />
        </div>
    );
}
