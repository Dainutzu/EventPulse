"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Card, Button, Badge } from "@/components/ui";
import { Clock, Search, SlidersHorizontal, ArrowRight, User, CheckCircle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandingFooter } from "@/components/BrandingFooter";
import { getCategoryColor } from "@/lib/utils/ui";
import { formatMonthDay } from "@/lib/utils/date";
import { useEventStore } from "@/state/useEventStore";
import Link from "next/link";

const SORT_OPTIONS = ["Upcoming", "Most Popular", "Ending Soon"];

import { CATEGORIES } from "@/lib/mockUser";

export default function Explore() {
    const { events: allEvents, isRegistered } = useEventStore();
    const categories = ["All", ...CATEGORIES];

    const [activeCategory, setActiveCategory] = useState("All");
    const [activeSort, setActiveSort] = useState("Upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Filter and Sort Logic (Local for instant feedback, can be synced with API if needed)
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

        // Sorting
        if (activeSort === "Upcoming") {
            filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (activeSort === "Most Popular") {
            filtered.sort((a, b) => b.registered - a.registered);
        }

        return filtered;
    }, [allEvents, activeCategory, activeSort, searchQuery]);

    useEffect(() => {
        // Realistic simulation of loading state for SaaS feel
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [activeCategory, activeSort, searchQuery]);

    return (
        <div className="pb-32 min-h-screen">
            {/* Header Area */}
            <header className="px-6 pt-14 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black mb-1">Explore Hub</h1>
                    <p className="text-sm text-[var(--color-text-muted)] font-medium">Find your next big experience on campus</p>
                </div>
                <BrandLogo size={44} rounded="rounded-xl" />
            </header>

            {/* Search Bar - Premium Glassmorphism */}
            <div className="px-6 mb-5">
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

            {/* Categories pills */}
            <div className="flex gap-2.5 px-6 pb-6 overflow-x-auto hide-scrollbar snap-x">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-full text-[13px] font-black whitespace-nowrap transition-all duration-300 border snap-start ${activeCategory === cat
                            ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-lg shadow-blue-500/30 scale-105"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] hover:text-white"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Sort/Filter Bar */}
            <div className="px-6 flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <SlidersHorizontal size={16} className="opacity-60" />
                    <span className="text-[12px] font-black uppercase tracking-widest text-[var(--color-text-muted)]/80">Sort Preference</span>
                </div>
                <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 shadow-inner">
                    {SORT_OPTIONS.map((sortOption) => (
                        <button
                            key={sortOption}
                            onClick={() => setActiveSort(sortOption)}
                            className={`px-4 py-2 text-[11px] font-black uppercase tracking-tighter rounded-lg transition-all ${activeSort === sortOption
                                ? "bg-[var(--color-surface-elevated)] text-white shadow-md scale-105"
                                : "text-[var(--color-text-muted)] hover:text-white"
                                }`}
                        >
                            {sortOption}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 flex flex-col gap-5">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <motion.div
                                key={`skel-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-5 w-full"
                            >
                                <div className="w-full h-36 bg-[var(--color-surface-elevated)] rounded-2xl animate-pulse mb-5" />
                                <div className="h-6 bg-[var(--color-surface-elevated)] rounded-full w-3/4 animate-pulse mb-4" />
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-24 bg-[var(--color-surface-elevated)] rounded-xl animate-pulse" />
                                    <div className="h-4 bg-[var(--color-surface-elevated)] rounded-full w-1/3 animate-pulse" />
                                </div>
                            </motion.div>
                        ))
                    ) : filteredEvents.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-20 flex flex-col items-center justify-center text-center bg-[var(--color-surface)]/30 rounded-[32px] border border-dashed border-[var(--color-border)] backdrop-blur-sm"
                        >
                            <div className="w-20 h-20 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-muted)] mb-6 shadow-xl">
                                <Search size={32} strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-black mb-2">No results matching filters</h3>
                            <p className="text-[14px] text-[var(--color-text-muted)] max-w-[260px] font-medium leading-relaxed">
                                We couldn&apos;t find any events. Try resetting your search or broadening categories.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-8 rounded-xl px-8"
                                onClick={() => {
                                    setSearchQuery("");
                                    setActiveCategory("All");
                                }}
                            >
                                Reset Discovery
                            </Button>
                        </motion.div>
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
                                        <Card className="hover:border-[var(--color-accent)]/30 transition-all hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden group">
                                            {/* Preview Header */}
                                            <div
                                                className="h-36 w-full relative overflow-hidden"
                                                style={{ backgroundColor: `color-mix(in srgb, ${event.categoryColor || '#3b82f6'} 20%, #000)` }}
                                            >
                                                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                                                {/* Date Floating Badge */}
                                                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex flex-col items-center shadow-lg">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 leading-none mb-1">
                                                        {dateStr.month}
                                                    </span>
                                                    <span className="text-[20px] font-black text-white leading-none">
                                                        {dateStr.day}
                                                    </span>
                                                </div>

                                                {/* Category Floating Badge */}
                                                <div className="absolute top-4 right-4 h-9 flex items-center bg-white/5 backdrop-blur-xl px-4 rounded-xl border border-white/10">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{event.category}</span>
                                                </div>

                                                {registered && (
                                                    <div className="absolute bottom-0 left-0 w-full bg-emerald-500/90 py-1.5 text-center backdrop-blur-md">
                                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.1em] flex items-center justify-center gap-1.5">
                                                            <CheckCircle size={12} /> Spot Secured
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5">
                                                <h3 className="font-black text-[18px] leading-tight mb-3 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">{event.title}</h3>

                                                <div className="flex items-center justify-between mb-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/5 text-[10px] shadow-lg">
                                                            {event.club.charAt(0)}
                                                        </div>
                                                        <span className="text-[13px] font-bold text-[var(--color-text-muted)]">
                                                            {event.club}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-[11px] font-black text-blue-400 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10">
                                                        <User size={12} />
                                                        <span>{event.registered} attending</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-white/5 pt-5">
                                                    <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] font-bold">
                                                        <Clock size={16} className="text-[var(--color-accent)] opacity-70" />
                                                        <span>{event.timeStart}</span>
                                                    </div>
                                                    <div className="text-[13px] font-black text-[var(--color-accent)] flex items-center gap-1.5 hover:translate-x-1 transition-transform">
                                                        Get Ticket <ArrowRight size={16} />
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
            </div>

            <BrandingFooter />

            <BottomNav />
        </div>
    );
}
