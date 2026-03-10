"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEventStore } from "@/state/useEventStore";
import { getRecommendedEvents } from "@/utils/recommendations";
import { Badge, Clock } from "@/components/ui";
import { formatDateBlock } from "@/utils/dateUtils";
import { getCategoryColor } from "@/lib/utils/ui";
import { Event } from "@/types";

interface RecommendationsProps {
    initialEvents: Event[];
}

export function Recommendations({ initialEvents }: RecommendationsProps) {
    const { events, interests, attendedCategories, isRegistered, registerEvent, unregisterEvent, isHydrated, setSelectedEventId } = useEventStore();
    const [isLoaded, setIsLoaded] = useState(false);

    // Use current events from store if available, otherwise fallback to server-passed events
    const currentEvents = events.length > 0 ? events : initialEvents;

    const recommendedEvents = useMemo(() => {
        // If we have interests (client-side), get personalized ones
        if (isHydrated && interests.length > 0) {
            return getRecommendedEvents(currentEvents, interests, attendedCategories);
        }
        // Fallback: Show trending events if no interests set yet (Server-safe)
        return currentEvents.filter(e => e.trending).slice(0, 5);
    }, [currentEvents, interests, attendedCategories, isHydrated]);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (recommendedEvents.length === 0) return null;

    return (
        <div className="mb-10 px-4">
            <div className="flex items-baseline justify-between mb-4">
                <div>
                    <h2 className="text-xl font-black tracking-tight">Recommended For You</h2>
                    <p className="text-[12px] text-[var(--color-text-muted)] font-bold">
                        {interests.length > 0 ? "Based on your interests and activity" : "Trending campus activities"}
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {recommendedEvents.map((event, index) => (
                        <motion.div
                            key={`rec-${event.id}`}
                            initial={isLoaded ? { opacity: 0, y: 10 } : false}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="w-full"
                            onClick={() => setSelectedEventId(event.id)}
                        >
                            <div className="relative group">
                                <EventCardSmall
                                    event={event}
                                    isRegistered={isRegistered(event.id)}
                                    onToggle={() => isRegistered(event.id) ? unregisterEvent(event.id) : registerEvent(event.id)}
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                                        ✨ {interests.includes(event.faculty) ? "Match" : "Trending"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function EventCardSmall({ event, isRegistered, onToggle }: { event: Event; isRegistered: boolean; onToggle: () => void }) {
    const dateStr = formatDateBlock(event.date);

    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 cursor-pointer transition-all duration-300 group relative overflow-hidden w-full">
            <div className="flex gap-4">
                <div
                    className="w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center shrink-0 shadow-inner relative overflow-hidden"
                    style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(event.faculty)} 15%, transparent)` }}
                >
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-80" style={{ color: getCategoryColor(event.faculty) }}>
                        {dateStr.month}
                    </span>
                    <span className="text-[28px] font-black leading-none mt-1" style={{ color: getCategoryColor(event.faculty) }}>
                        {dateStr.day}
                    </span>
                </div>

                <div className="flex-1 py-1">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Badge variant="outline" className="text-[9px] py-0.5 px-2 rounded-md opacity-80 font-black border-[var(--color-border)] whitespace-nowrap">
                            {event.faculty === "Miscellaneous" ? "Misc" : event.faculty.replace("Faculty of ", "").replace("School of ", "")}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] py-0.5 px-2 rounded-md opacity-80 font-black border-[var(--color-border)]">
                            {event.subcategory === "Clubs & Societies" ? "Clubs" : event.subcategory}
                        </Badge>
                    </div>
                    <h3 className="text-md font-black leading-tight mb-2 line-clamp-1">
                        {event.title}
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium line-clamp-1">{event.organizer || "Join us!"}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-text-muted)]">
                    <Clock size={14} className="opacity-50 text-[var(--color-accent)]" />
                    <span>{event.timeStart}</span>
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggle();
                    }}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-black transition-all duration-300 active:scale-90 ${isRegistered
                        ? "bg-[var(--color-surface-elevated)] text-[var(--color-accent)] border border-[var(--color-accent)]/30"
                        : "bg-blue-600 text-white shadow-lg"
                        }`}
                >
                    {isRegistered ? "Added" : "Join"}
                </button>
            </div>
        </div>
    );
}
