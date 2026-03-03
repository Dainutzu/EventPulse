"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, BottomNav, Badge, Users } from "@/components/ui";
import { MOCK_USER, CATEGORIES } from "@/lib/mockUser";
import { getGreeting, getCategoryColor } from "@/lib/utils/ui";
import { formatDateBlock, processEvents } from "@/utils/dateUtils";
import { useEventStore } from "@/state/useEventStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandingFooter } from "@/components/BrandingFooter";
import { getRecommendedEvents } from "@/utils/recommendations";
import Link from "next/link";

export default function HomeFeed() {
    const [activeTab, setActiveTab] = useState("All");
    const { events, registerEvent, unregisterEvent, isRegistered, interests, setInterests, attendedCategories } = useEventStore();
    const [showInterestPicker, setShowInterestPicker] = useState(false);

    // Initial check for interests
    useEffect(() => {
        if (interests.length === 0) {
            setShowInterestPicker(true);
        }
    }, [interests]);

    const recommendedEvents = useMemo(() => {
        return getRecommendedEvents(events, interests, attendedCategories);
    }, [events, interests, attendedCategories]);

    const filteredEvents = useMemo(() => {
        return activeTab === "All"
            ? events
            : events.filter((e) => e.category === activeTab);
    }, [events, activeTab]);

    const { upcoming, past } = useMemo(() => processEvents(filteredEvents), [filteredEvents]);

    return (
        <div className="pb-28 min-h-screen selection:bg-blue-500/30">
            {/* Header */}
            <header className="px-6 lg:px-0 pt-12 lg:pt-16 pb-8 flex items-center justify-between">
                <div className="flex items-center gap-4 lg:gap-6">
                    <div className="lg:hidden">
                        <BrandLogo size={44} rounded="rounded-xl" />
                    </div>
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-[0_4px_16px_rgba(37,99,235,0.4)] border-2 border-[var(--color-bg)] transition-transform hover:scale-105">
                        {MOCK_USER.avatar}
                    </div>
                    <div>
                        <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight">
                            {getGreeting()}, {MOCK_USER.name.split(" ")[0]} <span className="inline-block origin-[70%_70%] animate-[wave_2.5s_infinite]">👋</span>
                        </h1>
                        <p className="text-sm lg:text-base text-[var(--color-text-muted)] mt-1 lg:mt-2">
                            You have <span className="text-[var(--color-text-main)] font-bold">{upcoming.length} upcoming events</span> to attend.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="lg:hidden">
                        <ThemeToggle />
                    </div>
                    <button className="w-11 h-11 lg:w-12 lg:h-12 bg-[var(--color-surface)] rounded-full flex items-center justify-center border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-all hover:scale-105 active:scale-95 relative shadow-sm group">
                        <Bell size={20} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--color-surface)]" />
                    </button>
                    {/* Desktop Search Bar Hint */}
                    <div className="hidden lg:flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2.5 rounded-2xl ml-4 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-sm text-[var(--color-text-muted)]">Search events...</span>
                        <kbd className="bg-[var(--color-surface-elevated)] text-[10px] px-1.5 py-0.5 rounded border border-[var(--color-border)] font-bold">/</kbd>
                    </div>
                </div>
            </header>

            {/* Recommended Section */}
            {recommendedEvents.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-baseline justify-between px-6 mb-4">
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Recommended For You</h2>
                            <p className="text-[12px] text-[var(--color-text-muted)] font-bold">Based on your interests and activity</p>
                        </div>
                    </div>
                    <div className="flex gap-4 px-6 overflow-x-auto hide-scrollbar snap-x pb-4">
                        {recommendedEvents.map((event, index) => (
                            <div key={`rec-${event.id}`} className="snap-start shrink-0 w-[280px]">
                                <Link href={`/events/${event.id}`}>
                                    <div className="relative group">
                                        <EventCard
                                            event={event}
                                            index={index}
                                            isRegistered={isRegistered(event.id)}
                                            onToggle={() => isRegistered(event.id) ? unregisterEvent(event.id) : registerEvent(event.id)}
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                                                ✨ For You
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Category Tabs */}
            <div className="flex gap-3 px-6 lg:px-0 pb-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                {["All", ...CATEGORIES].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-5 py-2.5 lg:px-6 lg:py-3 rounded-2xl text-sm lg:text-[15px] font-bold whitespace-nowrap transition-all duration-300 snap-start border ${activeTab === cat
                            ? "bg-blue-600 text-white border-blue-500 shadow-[0_8px_20px_rgba(37,99,235,0.3)] scale-105"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-text-muted)]/30"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Upcoming Section */}
            <div className="flex items-center justify-between px-6 lg:px-0 pb-6">
                <h2 className="text-xl lg:text-2xl font-black tracking-tight">Upcoming Events</h2>
                <Badge variant="default" className="bg-blue-500/10 border-blue-500/20 text-blue-400">Live Campus Feed</Badge>
            </div>

            {/* Event Grid/List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-6 lg:px-0 mb-16">
                <AnimatePresence mode="popLayout" initial={false}>
                    {upcoming.map((event, index) => (
                        <Link key={event.id} href={`/events/${event.id}`}>
                            <EventCard
                                event={event}
                                index={index}
                                isRegistered={isRegistered(event.id)}
                                onToggle={() => isRegistered(event.id) ? unregisterEvent(event.id) : registerEvent(event.id)}
                            />
                        </Link>
                    ))}
                </AnimatePresence>

                {upcoming.length === 0 && (
                    <div className="col-span-full text-center py-20 text-[var(--color-text-muted)] bg-[var(--color-surface)]/40 rounded-[40px] border border-dashed border-[var(--color-border)] backdrop-blur-sm">
                        <div className="mb-4 text-4xl opacity-50">📅</div>
                        <p className="font-extrabold text-lg">No events found in this category.</p>
                        <p className="text-sm opacity-60 mt-1">Try switching tabs or check back later!</p>
                    </div>
                )}
            </div>

            {/* Past Section */}
            {past.length > 0 && (
                <>
                    <div className="flex items-center justify-between px-6 lg:px-0 pb-6">
                        <h2 className="text-xl lg:text-2xl font-black tracking-tight text-[var(--color-text-muted)]">Completed Recently</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-6 lg:px-0">
                        {past.map((event, index) => (
                            <Link key={event.id} href={`/events/${event.id}`}>
                                <EventCard
                                    event={event}
                                    index={index}
                                    isRegistered={isRegistered(event.id)}
                                    isPast
                                    onToggle={() => { }}
                                />
                            </Link>
                        ))}
                    </div>
                </>
            )}

            <BrandingFooter />

            {/* Interest Picker Modal */}
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
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-[400px] rounded-[32px] p-8 relative z-10 shadow-2xl"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                    <BrandLogo size={40} />
                                </div>
                                <h2 className="text-2xl font-black mb-2">Welcome to Pulse</h2>
                                <p className="text-[14px] text-[var(--color-text-muted)] font-medium">Pick at least 2 interests to personalize your campus experience.</p>
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
                                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all ${selected
                                                ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                                                : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-blue-500/50"
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
                                className="w-full py-4 bg-blue-600 disabled:opacity-50 disabled:grayscale text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
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
    event: any;
    index: number;
    isRegistered: boolean;
    isPast?: boolean;
    onToggle: () => void;
}

function EventCard({ event, index, isRegistered, isPast, onToggle }: EventCardProps) {
    const dateStr = formatDateBlock(event.date);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
        >
            <div className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[32px] p-6 lg:p-7 cursor-pointer transition-all duration-500 hover:bg-[var(--color-surface-elevated)] hover:-translate-y-2 lg:hover:-translate-y-3 hover:border-[var(--color-accent)]/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] group relative overflow-hidden ${isPast ? 'opacity-70 grayscale-[0.3]' : ''}`}>

                {/* Status Indicator */}
                {!isPast && isRegistered && (
                    <div className="absolute top-0 right-0">
                        <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-tighter shadow-lg">
                            Confirmed
                        </div>
                    </div>
                )}

                {/* Trending Badge (Desktop Only Approximation) */}
                {event.registered > 50 && (
                    <div className="absolute top-6 right-6 hidden lg:block">
                        <Badge variant="purple" className="animate-pulse">🔥 Trending</Badge>
                    </div>
                )}

                <div className="flex gap-6">
                    {/* Date Block */}
                    <div
                        className="w-[70px] h-[80px] lg:w-[80px] lg:h-[90px] rounded-[22px] flex flex-col items-center justify-center shrink-0 shadow-inner relative overflow-hidden transition-transform group-hover:scale-105"
                        style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(event.category)} 15%, transparent)` }}
                    >
                        <span className="text-[11px] lg:text-[12px] font-black tracking-widest uppercase opacity-80" style={{ color: getCategoryColor(event.category) }}>
                            {dateStr.month}
                        </span>
                        <span className="text-[32px] lg:text-[36px] font-black leading-none mt-1" style={{ color: getCategoryColor(event.category) }}>
                            {dateStr.day}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 py-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-[10px] py-1 px-3 rounded-lg opacity-80 font-black border-[var(--color-border)] group-hover:border-[var(--color-accent)]/30 transition-colors">
                                {event.category}
                            </Badge>
                        </div>
                        <h3 className="text-lg lg:text-xl font-black leading-tight mb-3 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                            {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] lg:text-[14px] font-bold text-[var(--color-text-muted)]">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="opacity-50 text-[var(--color-accent)]" />
                                <span>{event.timeStart}</span>
                            </div>
                            <div className="hidden lg:flex items-center gap-2">
                                <Users size={16} className="opacity-50 text-emerald-500" />
                                <span>{event.registered} attending</span>
                            </div>
                            <span className="text-[var(--color-accent)] font-black opacity-80 group-hover:opacity-100">{event.club}</span>
                        </div>
                    </div>
                </div>

                {/* Desktop-only details row */}
                <div className="hidden lg:block mt-6 pt-5 border-t border-[var(--color-border)]">
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-muted)]">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {100 - (event.registered || 0)} seats remaining
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--color-border)] lg:border-none lg:mt-4 lg:pt-0">
                    <div className="flex items-center">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-[var(--color-surface)] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden ring-1 ring-white/10 transition-transform group-hover:translate-x-1"
                                >
                                    <div className="w-full h-full bg-slate-800" />
                                </div>
                            ))}
                        </div>
                        <span className="ml-4 text-[13px] font-black text-[var(--color-text-muted)] lg:hidden">
                            +{event.registered} attending
                        </span>
                    </div>

                    {!isPast && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggle();
                            }}
                            className={`px-7 py-3 rounded-2xl text-[15px] font-black transition-all duration-300 active:scale-90 ${isRegistered
                                ? "bg-[var(--color-surface-elevated)] text-[var(--color-accent)] border border-[var(--color-accent)]/30 hover:bg-[var(--color-bg)]"
                                : "bg-blue-600 text-white shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_30px_-8px_rgba(37,99,235,0.6)] hover:-translate-y-1"
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

