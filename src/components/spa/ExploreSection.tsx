"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Calendar, Clock, Badge, Star } from "@/components/ui";
import { MOCK_EVENTS } from "@/lib/mockData";
import { CATEGORIES } from "@/lib/mockUser";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryColor } from "@/lib/utils/ui";
import { formatDateBlock } from "@/utils/dateUtils";
import { useEventStore } from "@/state/useEventStore";
import { Event } from "@/types";

export default function ExploreSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { setSelectedEventId } = useEventStore();

    const filteredEvents = useMemo(() => {
        return MOCK_EVENTS.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.club.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="pb-28 min-h-screen selection:bg-purple-500/30 px-4">
            <header className="pt-12 pb-8">
                <h1 className="text-3xl font-black tracking-tight mb-2">Explore</h1>
                <p className="text-[15px] text-[var(--color-text-muted)] font-medium">Discover what&apos;s happening on campus today.</p>
            </header>

            <div className="relative mb-8">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-blue-500 transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search events, clubs, or venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-4 pl-12 pr-4 text-[15px] font-bold outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-[var(--color-text-dim)]"
                />
            </div>

            <div className="flex gap-3 -mx-4 px-4 pb-8 overflow-x-auto hide-scrollbar">
                {["All", ...CATEGORIES].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all border ${selectedCategory === cat
                            ? "bg-purple-600 text-white border-purple-500 shadow-lg scale-105"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-text-muted)]/30"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredEvents.map((event, index) => (
                        <ExploreCard
                            key={event.id}
                            event={event}
                            index={index}
                            onSelect={() => setSelectedEventId(event.id)}
                        />
                    ))}
                </AnimatePresence>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-20 bg-[var(--color-surface)]/30 rounded-2xl border border-dashed border-[var(--color-border)]">
                        <p className="font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-xs">No Results Found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface ExploreCardProps {
    event: Event;
    index: number;
    onSelect: () => void;
}

function ExploreCard({ event, index, onSelect }: ExploreCardProps) {
    const dateStr = formatDateBlock(event.date);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
            onClick={onSelect}
        >
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                <div className="relative h-48 bg-[var(--color-surface-elevated)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    <div
                        className="absolute inset-0 opacity-40 mix-blend-overlay"
                        style={{ backgroundColor: getCategoryColor(event.category) }}
                    />
                    <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white font-black py-1.5 px-4 rounded-xl">
                            {event.category}
                        </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                        <h3 className="text-xl font-black text-white leading-tight mb-2 drop-shadow-lg">
                            {event.title}
                        </h3>
                        <div className="flex items-center gap-4 text-white/90 text-[12px] font-black">
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                <span>{event.timeStart}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                <span className="truncate max-w-[150px]">{event.venue}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 flex items-center justify-between">
                    <div className="flex -space-x-3 overflow-hidden">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-surface-elevated)] flex items-center justify-center text-[10px] font-bold">
                                {String.fromCodePoint(0x1F642 + i)}
                            </div>
                        ))}
                        <div className="inline-block h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-surface-elevated)] flex items-center justify-center text-[10px] font-black">
                            +{event.registered}
                        </div>
                    </div>

                    <button className="text-blue-500 font-black text-sm px-4 py-2 bg-blue-500/10 rounded-xl active:scale-90 transition-all">
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
