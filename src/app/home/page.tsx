"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, BottomNav, Badge } from "@/components/ui";
import { MOCK_USER, CATEGORIES } from "@/lib/mockUser";
import { getGreeting, getCategoryColor } from "@/lib/utils/ui";
import { formatDateBlock, processEvents } from "@/utils/dateUtils";
import { useEventState } from "@/state/useEventState";
import Link from "next/link";

export default function HomeFeed() {
    const [activeTab, setActiveTab] = useState("All");
    const { events, registerEvent, unregisterEvent, isRegistered } = useEventState();

    const filteredEvents = useMemo(() => {
        return activeTab === "All"
            ? events
            : events.filter((e) => e.category === activeTab);
    }, [events, activeTab]);

    const { upcoming, past } = useMemo(() => processEvents(filteredEvents), [filteredEvents]);

    return (
        <div className="pb-28 min-h-screen selection:bg-blue-500/30">
            {/* Header */}
            <header className="px-6 pt-12 pb-5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_16px_rgba(37,99,235,0.4)] border-2 border-[var(--color-bg)]">
                        {MOCK_USER.avatar}
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight">
                            {getGreeting()}, {MOCK_USER.name.split(" ")[0]} <span className="inline-block origin-[70%_70%] animate-[wave_2.5s_infinite]">👋</span>
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                            {upcoming.length} upcoming events this week
                        </p>
                    </div>
                </div>
                <button className="w-11 h-11 bg-[var(--color-surface)] rounded-full flex items-center justify-center border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-all hover:scale-105 active:scale-95 relative">
                    <Bell size={20} className="text-[var(--color-text-muted)]" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--color-surface)]" />
                </button>
            </header>

            {/* Category Tabs */}
            <div className="flex gap-2.5 px-6 pb-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 snap-start border ${activeTab === cat
                            ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-[0_8px_20px_rgba(59,130,246,0.3)] scale-105"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] hover:border-white/10"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Upcoming Section */}
            <div className="flex items-center justify-between px-6 pb-4">
                <h2 className="text-xl font-extrabold tracking-tight">Upcoming Events</h2>
                <Badge variant="default" className="bg-blue-500/10 border-blue-500/20 text-blue-400">Next 30 Days</Badge>
            </div>

            {/* Event List */}
            <div className="flex flex-col gap-4 px-6 mb-12">
                <AnimatePresence mode="popLayout" initial={false}>
                    {upcoming.map((event, index) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            index={index}
                            isRegistered={isRegistered(event.id)}
                            onToggle={() => isRegistered(event.id) ? unregisterEvent(event.id) : registerEvent(event.id)}
                        />
                    ))}
                </AnimatePresence>

                {upcoming.length === 0 && (
                    <div className="text-center py-14 text-[var(--color-text-muted)] bg-[var(--color-surface)]/50 rounded-3xl border border-dashed border-[var(--color-border)] backdrop-blur-sm">
                        <div className="mb-3 text-3xl opacity-50">📅</div>
                        <p className="font-semibold px-12 text-sm leading-relaxed">No upcoming events found. Check back soon for new opportunities!</p>
                    </div>
                )}
            </div>

            {/* Past Section */}
            {past.length > 0 && (
                <>
                    <div className="flex items-center justify-between px-6 pb-4">
                        <h2 className="text-xl font-extrabold tracking-tight text-[var(--color-text-muted)]">Completed Recently</h2>
                    </div>
                    <div className="flex flex-col gap-4 px-6">
                        {past.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                index={index}
                                isRegistered={isRegistered(event.id)}
                                isPast
                                onToggle={() => { }}
                            />
                        ))}
                    </div>
                </>
            )}

            <BottomNav />
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
            <div className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-5 cursor-pointer transition-all duration-500 hover:bg-[var(--color-surface-elevated)] hover:-translate-y-1.5 hover:border-white/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group relative overflow-hidden ${isPast ? 'opacity-70 grayscale-[0.3]' : ''}`}>

                {/* Status Indicator */}
                {!isPast && isRegistered && (
                    <div className="absolute top-0 right-0">
                        <div className="bg-emerald-500 text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-tighter">
                            Confirmed
                        </div>
                    </div>
                )}

                <div className="flex gap-5">
                    {/* Date Block */}
                    <div
                        className="w-[64px] h-[74px] rounded-[18px] flex flex-col items-center justify-center shrink-0 shadow-inner relative overflow-hidden"
                        style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(event.category)} 12%, transparent)` }}
                    >
                        <span className="text-[11px] font-black tracking-widest uppercase opacity-80" style={{ color: getCategoryColor(event.category) }}>
                            {dateStr.month}
                        </span>
                        <span className="text-[28px] font-black leading-none mt-1" style={{ color: getCategoryColor(event.category) }}>
                            {dateStr.day}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 py-0.5">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-[9px] py-0.5 px-2 rounded-md opacity-80 font-black">
                                {event.category}
                            </Badge>
                        </div>
                        <h3 className="text-[17px] font-extrabold leading-tight mb-2.5 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                            {event.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--color-text-muted)]">
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} className="opacity-50" />
                                <span>{event.timeStart}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                            <span className="text-[var(--color-accent)] font-bold">{event.club}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                    <div className="flex items-center">
                        <div className="flex -space-x-2.5">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-[var(--color-surface)] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden ring-1 ring-white/5"
                                >
                                    <div className="w-full h-full bg-slate-800" />
                                </div>
                            ))}
                        </div>
                        <span className="ml-3 text-[12px] font-bold text-[var(--color-text-muted)]">
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
                            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 active:scale-90 ${isRegistered
                                ? "bg-white/5 text-[var(--color-accent)] border border-[var(--color-accent)]/30 hover:bg-white/10"
                                : "bg-[var(--color-accent)] text-white shadow-[0_8px_20px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.6)] hover:-translate-y-0.5"
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

