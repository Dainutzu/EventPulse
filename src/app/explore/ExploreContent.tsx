"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge } from "@/components/ui";
import { Clock, Search, ArrowRight, User, CheckCircle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandingFooter } from "@/components/BrandingFooter";
import { formatMonthDay } from "@/lib/utils/date";
import { useEventStore } from "@/state/useEventStore";
import Link from "next/link";
import { CATEGORIES } from "@/lib/mockUser";

const SORT_OPTIONS = ["Upcoming", "Most Popular", "Ending Soon"];

export default function ExploreContent() {
    const { events: allEvents, isRegistered } = useEventStore();
    const categories = ["All", ...CATEGORIES];

    const [activeCategory, setActiveCategory] = useState("All");
    const [activeSort, setActiveSort] = useState("Upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const filteredEvents = useMemo(() => {
        let filtered = [...allEvents];

        if (activeCategory !== "All") {
            filtered = filtered.filter(e => e.category === activeCategory);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.title.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q) ||
                e.club.toLowerCase().includes(q)
            );
        }

        if (activeSort === "Upcoming") {
            filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (activeSort === "Most Popular") {
            filtered.sort((a, b) => b.registered - a.registered);
        }

        return filtered;
    }, [allEvents, activeCategory, activeSort, searchQuery]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300); // Faster loading for SPA feel
        return () => clearTimeout(timer);
    }, [activeCategory, activeSort, searchQuery]);

    return (
        <div className="pb-32 px-4">
            <header className="pt-14 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black mb-1">Explore Hub</h1>
                    <p className="text-sm text-[var(--color-text-muted)] font-medium">Find your next big experience on campus</p>
                </div>
                <BrandLogo size={44} rounded="rounded-xl" />
            </header>

            <div className="mb-10 px-0">
                <div className="mb-5">
                    <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-3.5 focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20 transition-all duration-300 shadow-sm shadow-black/20">
                        <Search size={20} className="text-[var(--color-text-muted)] mr-3 opacity-70" />
                        <input
                            type="text"
                            placeholder="Search events, clubs, or keywords..."
                            className="flex-1 bg-transparent border-none text-[15px] font-medium outline-none placeholder:text-[var(--color-text-muted)]/60"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="text-[10px] font-black uppercase text-[var(--color-text-muted)] hover:text-white px-2">Clear</button>
                        )}
                    </div>
                </div>

                <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 shadow-inner">
                    {SORT_OPTIONS.map((sortOption) => (
                        <button
                            key={sortOption}
                            onClick={() => setActiveSort(sortOption)}
                            className={`px-4 py-2 text-[11px] font-black uppercase tracking-tighter rounded-lg transition-all ${activeSort === sortOption
                                ? "bg-[var(--color-surface-elevated)] text-white shadow-md scale-105"
                                : "text-[var(--color-text-muted)]"
                                }`}
                        >
                            {sortOption}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 -mx-4 px-4 pb-8 overflow-x-auto hide-scrollbar snap-x">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-2xl text-[13px] font-black whitespace-nowrap transition-all duration-300 border snap-start ${activeCategory === cat
                            ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30 scale-105"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)]"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="px-0 grid grid-cols-1 gap-6 mb-16">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <motion.div
                                key={`skel-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 w-full"
                            >
                                <div className="w-full h-40 bg-[var(--color-surface-elevated)] rounded-2xl animate-pulse mb-6" />
                                <div className="h-7 bg-[var(--color-surface-elevated)] rounded-full w-3/4 animate-pulse mb-5" />
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="h-12 w-28 bg-[var(--color-surface-elevated)] rounded-xl animate-pulse" />
                                    <div className="h-5 bg-[var(--color-surface-elevated)] rounded-full w-1/4 animate-pulse" />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        filteredEvents.map((event, i) => {
                            const dateStr = formatMonthDay(event.date);
                            const registered = isRegistered(event.id);

                            return (
                                <motion.div
                                    key={event.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: i * 0.03 }}
                                >
                                    <Link href={`/events/${event.id}`}>
                                        <Card className="overflow-hidden group rounded-2xl">
                                            <div
                                                className="h-44 w-full relative overflow-hidden"
                                                style={{ backgroundColor: `color-mix(in srgb, ${event.categoryColor || '#3b82f6'} 20%, #000)` }}
                                            >
                                                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                                                <div className="absolute top-5 left-5 bg-black/50 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 flex flex-col items-center shadow-2xl">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 leading-none mb-1">
                                                        {dateStr.month}
                                                    </span>
                                                    <span className="text-[24px] font-black text-white leading-none">
                                                        {dateStr.day}
                                                    </span>
                                                </div>
                                                <div className="absolute top-5 right-5 h-10 flex items-center bg-black/30 backdrop-blur-xl px-5 rounded-xl border border-white/10">
                                                    <span className="text-[11px] font-black text-white uppercase tracking-wider">{event.category}</span>
                                                </div>
                                                {registered && (
                                                    <div className="absolute bottom-0 left-0 w-full bg-emerald-500/90 py-2 text-center backdrop-blur-md">
                                                        <span className="text-[11px] font-black text-white uppercase tracking-[0.1em] flex items-center justify-center gap-2">
                                                            <CheckCircle size={14} /> Spot Secured
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6">
                                                <h3 className="font-black text-[20px] leading-tight mb-4 transition-colors line-clamp-2">{event.title}</h3>
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10 text-[11px] font-black shadow-xl">
                                                            {event.club.charAt(0)}
                                                        </div>
                                                        <span className="text-[14px] font-black text-[var(--color-text-muted)]">
                                                            {event.club}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[12px] font-black text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">
                                                        <User size={14} />
                                                        <span>{event.registered} attending</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-6">
                                                    <div className="flex items-center gap-2.5 text-[14px] text-[var(--color-text-muted)] font-black">
                                                        <Clock size={18} className="text-blue-500" />
                                                        <span>{event.timeStart}</span>
                                                    </div>
                                                    <div className="text-[14px] font-black text-blue-500 flex items-center gap-2 hover:translate-x-1.5 transition-transform">
                                                        View Details <ArrowRight size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>

                {!isLoading && filteredEvents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-[var(--color-surface)]/30 rounded-[40px] border border-dashed border-[var(--color-border)] backdrop-blur-sm"
                    >
                        <div className="w-24 h-24 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-muted)] mb-8 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                            <Search size={40} strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black mb-3">No matching events</h3>
                        <p className="text-[16px] text-[var(--color-text-muted)] max-w-[320px] font-bold leading-relaxed mb-10">
                            We couldn&apos;t find any events. Try resetting your search or broadening categories.
                        </p>
                        <Button
                            variant="primary"
                            className="rounded-2xl px-10 py-4 shadow-2xl"
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("All");
                            }}
                        >
                            Reset Discovery
                        </Button>
                    </motion.div>
                )}
            </div>
            <BrandingFooter />
        </div >
    );
}
