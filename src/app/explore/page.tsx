"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Card, Button } from "@/components/ui";
import { Clock, Search, SlidersHorizontal, ArrowRight, User } from "lucide-react";
import { getCategoryColor, formatMonthDay } from "@/lib/mockData";
import Link from "next/link";

const CATEGORIES = ["All", "Academic", "Sports", "Cultural", "Workshops", "Competitions"];
const SORT_OPTIONS = ["Upcoming", "Most Popular", "Ending Soon"];

export default function Explore() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeSort, setActiveSort] = useState("Upcoming");
    const [searchQuery, setSearchQuery] = useState("");
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (activeCategory !== "All") queryParams.append("category", activeCategory);
                if (activeSort) queryParams.append("sort", activeSort);
                if (searchQuery) queryParams.append("query", searchQuery);

                const res = await fetch(`/api/events?${queryParams.toString()}`);
                const data = await res.json();

                // Simulating network delay for realistic skeletons
                setTimeout(() => {
                    if (isMounted) {
                        setEvents(data.events || []);
                        setIsLoading(false);
                    }
                }, 600);
            } catch (err) {
                console.error("Error fetching events", err);
                if (isMounted) setIsLoading(false);
            }
        };

        // Debounce the fetch if there's a search query
        const timer = setTimeout(() => {
            fetchEvents();
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        }
    }, [activeCategory, activeSort, searchQuery]);

    return (
        <div className="pb-32 min-h-screen">
            {/* Header */}
            <header className="px-6 pt-14 pb-4">
                <h1 className="text-2xl font-black mb-1">Explore Events</h1>
                <p className="text-sm text-[var(--color-text-muted)]">Discover what&apos;s happening on campus</p>
            </header>

            {/* Search Bar */}
            <div className="px-6 mb-5">
                <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-3.5 focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)] transition-all transition-colors duration-200">
                    <Search size={20} className="text-[var(--color-text-muted)] mr-3" />
                    <input
                        type="text"
                        placeholder="Search events, clubs, or keywords..."
                        className="flex-1 bg-transparent border-none text-[15px] outline-none placeholder:text-[var(--color-text-muted)]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories Horizontal Scroll */}
            <div className="flex gap-2.5 px-6 pb-5 overflow-x-auto hide-scrollbar">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 border ${activeCategory === cat
                                ? "bg-white text-black border-white shadow-md shadow-white/10"
                                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] hover:text-white"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Sort Options */}
            <div className="px-6 flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <SlidersHorizontal size={16} />
                    <span className="text-[13px] font-semibold uppercase tracking-wider">Sort By:</span>
                </div>
                <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1">
                    {SORT_OPTIONS.map((sortOption) => (
                        <button
                            key={sortOption}
                            onClick={() => setActiveSort(sortOption)}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeSort === sortOption
                                    ? "bg-[var(--color-surface-elevated)] text-white shadow-sm"
                                    : "text-[var(--color-text-muted)] hover:text-white"
                                }`}
                        >
                            {sortOption}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Results Container */}
            <div className="px-6 flex flex-col gap-5">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        // Skeleton Loader
                        [1, 2, 3].map((i) => (
                            <motion.div
                                key={`skel-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 w-full"
                            >
                                <div className="w-full h-32 bg-[var(--color-surface-elevated)] rounded-xl animate-pulse mb-4" />
                                <div className="h-5 bg-[var(--color-surface-elevated)] rounded-full w-3/4 animate-pulse mb-3" />
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-[var(--color-surface-elevated)] rounded-full animate-pulse" />
                                    <div className="h-4 bg-[var(--color-surface-elevated)] rounded-full w-1/2 animate-pulse" />
                                </div>
                            </motion.div>
                        ))
                    ) : events.length === 0 ? (
                        // Empty State
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-16 flex flex-col items-center justify-center text-center bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)]"
                        >
                            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-muted)] mb-4 shadow-inner">
                                <Search size={28} />
                            </div>
                            <h3 className="text-lg font-bold mb-1">No events found</h3>
                            <p className="text-[14px] text-[var(--color-text-muted)] max-w-[240px]">
                                Try adjusting your search or filters to find what you&apos;re looking for.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-6"
                                onClick={() => {
                                    setSearchQuery("");
                                    setActiveCategory("All");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </motion.div>
                    ) : (
                        // Event List
                        events.map((event, i) => {
                            const dateStr = formatMonthDay(event.date);
                            const color = getCategoryColor(event.category);

                            return (
                                <motion.div
                                    key={event.id}
                                    layoutId={`explore-card-${event.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                >
                                    <Card className="hover:border-white/20 transition-all hover:shadow-xl hover:-translate-y-1">
                                        {/* Banner Image Placeholder */}
                                        <div
                                            className="h-32 w-full relative overflow-hidden"
                                            style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, #161a22)` }}
                                        >
                                            <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                                            <div className="absolute top-3 left-3 bg-[#0D0F14]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                                                <span className="text-[11px] font-black uppercase tracking-wider text-white">
                                                    {dateStr.month} {dateStr.day}
                                                </span>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5">
                                                <span className="text-[10px] font-bold text-white uppercase">{event.category}</span>
                                            </div>
                                        </div>

                                        <div className="p-4.5">
                                            <h3 className="font-extrabold text-[17px] leading-snug mb-2 pr-4">{event.title}</h3>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-[var(--color-border)]">
                                                        <span className="text-[9px]">🏛️</span>
                                                    </div>
                                                    <span className="text-[13px] font-semibold text-[var(--color-text-muted)]">
                                                        {event.club}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-accent)] bg-blue-500/10 px-2 py-1 rounded-md">
                                                    <User size={12} />
                                                    <span>{event.registered} attending</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-[13px] text-[var(--color-text-muted)] font-medium">
                                                    <Clock size={16} />
                                                    <span>{event.timeStart}</span>
                                                </div>
                                                <Link href={`/events/${event.id}`}>
                                                    <Button variant="ghost" size="sm" className="px-4 bg-[var(--color-surface)] shadow-none">
                                                        View Details <ArrowRight size={14} className="ml-0.5" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            <BottomNav />
        </div>
    );
}
