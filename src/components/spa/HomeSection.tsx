"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, Badge, Users } from "@/components/ui";
import { MOCK_USER, CATEGORIES } from "@/lib/mockUser";
import { getGreeting, getCategoryColor } from "@/lib/utils/ui";
import { formatDateBlock, processEvents } from "@/utils/dateUtils";
import { useEventStore } from "@/state/useEventStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandingFooter } from "@/components/BrandingFooter";
import { Recommendations } from "@/components/Recommendations";
import { RecommendationsSkeleton } from "@/components/RecommendationsSkeleton";
import { Event } from "@/types";

interface HomeSectionProps {
    initialEvents: Event[];
}

export default function HomeSection({ initialEvents }: HomeSectionProps) {
    const [activeCategory, setActiveCategory] = useState("All");
    const { events, registerEvent, unregisterEvent, isRegistered, interests, setInterests, isHydrated, setSelectedEventId } = useEventStore();
    const [showInterestPicker, setShowInterestPicker] = useState(false);

    useEffect(() => {
        if (isHydrated && interests.length === 0) {
            setShowInterestPicker(true);
        }
    }, [interests, isHydrated]);

    const filteredEvents = useMemo(() => {
        const currentEvents = isHydrated && events.length > 0 ? events : initialEvents;
        return activeCategory === "All"
            ? currentEvents
            : currentEvents.filter((e) => e.category === activeCategory);
    }, [events, initialEvents, activeCategory, isHydrated]);

    const { upcoming, past } = useMemo(() => processEvents(filteredEvents), [filteredEvents]);

    return (
        <div className="pb-28 min-h-screen selection:bg-blue-500/30 px-4">
            <header className="pt-12 pb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_16px_rgba(37,99,235,0.4)] border-2 border-[var(--color-bg)]">
                        {MOCK_USER.avatar}
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight">
                            {getGreeting()}, {MOCK_USER.name.split(" ")[0]} <span className="inline-block origin-[70%_70%] animate-[wave_2.5s_infinite]">👋</span>
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            You have <span className="text-[var(--color-text-main)] font-bold">{upcoming.length} upcoming events</span> to attend.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                </div>
            </header>

            <Suspense fallback={<RecommendationsSkeleton />}>
                <Recommendations initialEvents={initialEvents} />
            </Suspense>

            <div className="flex gap-3 -mx-4 px-4 pb-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                {["All", ...CATEGORIES].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 snap-start border ${activeCategory === cat
                            ? "bg-blue-600 text-white border-blue-500 shadow-[0_8px_20px_rgba(37,99,235,0.3)] scale-105"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)]"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between pb-6">
                <h2 className="text-xl font-black tracking-tight">Upcoming Events</h2>
                <Badge variant="default" className="bg-blue-500/10 border-blue-500/20 text-blue-400">Live Campus Feed</Badge>
            </div>

            <div className="flex flex-col gap-6 mb-16">
                <AnimatePresence mode="popLayout" initial={false}>
                    {upcoming.map((event, index) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            index={index}
                            isRegistered={isRegistered(event.id)}
                            onToggle={() => isRegistered(event.id) ? unregisterEvent(event.id) : registerEvent(event.id)}
                            onSelect={() => setSelectedEventId(event.id)}
                        />
                    ))}
                </AnimatePresence>

                {upcoming.length === 0 && (
                    <div className="text-center py-20 text-[var(--color-text-muted)] bg-[var(--color-surface)]/40 rounded-2xl border border-dashed border-[var(--color-border)] backdrop-blur-sm">
                        <div className="mb-4 text-4xl opacity-50">📅</div>
                        <p className="font-extrabold text-lg">No events found.</p>
                        <p className="text-sm opacity-60 mt-1">Try switching categories!</p>
                    </div>
                )}
            </div>

            {past.length > 0 && (
                <>
                    <div className="flex items-center justify-between pb-6">
                        <h2 className="text-xl font-black tracking-tight text-[var(--color-text-muted)]">Completed Recently</h2>
                    </div>
                    <div className="flex flex-col gap-6">
                        {past.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                index={index}
                                isRegistered={isRegistered(event.id)}
                                isPast
                                onToggle={() => { }}
                                onSelect={() => setSelectedEventId(event.id)}
                            />
                        ))}
                    </div>
                </>
            )}

            <BrandingFooter />

            <AnimatePresence>
                {showInterestPicker && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => { if (interests.length > 0) setShowInterestPicker(false) }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-[400px] rounded-2xl p-8 relative z-10 shadow-2xl"
                        >
                            <div className="text-center mb-8">
                                <BrandLogo size={60} className="mx-auto mb-4" />
                                <h2 className="text-2xl font-black mb-2">Welcome to Pulse</h2>
                                <p className="text-[14px] text-[var(--color-text-muted)] font-medium">Pick at least 2 interests to personalize your experience.</p>
                            </div>

                            <div className="flex flex-wrap gap-2.5 mb-10 justify-center">
                                {CATEGORIES.map(cat => {
                                    const selected = interests.includes(cat);
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                if (selected) {
                                                    setInterests(interests.filter(i => i !== cat));
                                                } else {
                                                    setInterests([...interests, cat]);
                                                }
                                            }}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${selected
                                                ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                                                : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)]"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                disabled={interests.length < 2}
                                onClick={() => setShowInterestPicker(false)}
                                className="w-full py-4 bg-blue-600 disabled:opacity-50 text-white font-black rounded-xl shadow-xl active:scale-95 transition-all"
                            >
                                Start Exploring
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface EventCardProps {
    event: Event;
    index: number;
    isRegistered: boolean;
    isPast?: boolean;
    onToggle: () => void;
    onSelect: () => void;
}

function EventCard({ event, index, isRegistered, isPast, onToggle, onSelect }: EventCardProps) {
    const dateStr = formatDateBlock(event.date);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className="w-full"
            onClick={onSelect}
        >
            <div className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 cursor-pointer transition-all duration-300 group relative overflow-hidden ${isPast ? 'opacity-70 grayscale-[0.3]' : ''}`}>
                <div className="flex gap-6">
                    <div
                        className="w-[70px] h-[80px] rounded-xl flex flex-col items-center justify-center shrink-0 shadow-inner relative overflow-hidden"
                        style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(event.category)} 15%, transparent)` }}
                    >
                        <span className="text-[11px] font-black tracking-widest uppercase opacity-80" style={{ color: getCategoryColor(event.category) }}>
                            {dateStr.month}
                        </span>
                        <span className="text-[32px] font-black leading-none mt-1" style={{ color: getCategoryColor(event.category) }}>
                            {dateStr.day}
                        </span>
                    </div>

                    <div className="flex-1 py-1">
                        <Badge variant="outline" className="text-[10px] py-1 px-3 rounded-lg font-black border-[var(--color-border)] mb-3">
                            {event.category}
                        </Badge>
                        <h3 className="text-lg font-black leading-tight mb-3 line-clamp-2">
                            {event.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-text-muted)]">
                            <Clock size={16} className="opacity-50 text-[var(--color-accent)]" />
                            <span>{event.timeStart}</span>
                            <span className="ml-2 text-[var(--color-accent)]">{event.club}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--color-border)]">
                    <span className="text-[13px] font-black text-[var(--color-text-muted)]">
                        +{event.registered} attending
                    </span>

                    {!isPast && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggle();
                            }}
                            className={`px-7 py-3 rounded-xl text-[15px] font-black transition-all duration-300 active:scale-90 ${isRegistered
                                ? "bg-[var(--color-surface-elevated)] text-[var(--color-accent)] border border-[var(--color-accent)]/30"
                                : "bg-blue-600 text-white shadow-lg"
                                }`}
                        >
                            {isRegistered ? "Unregister" : "Join Now"}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
