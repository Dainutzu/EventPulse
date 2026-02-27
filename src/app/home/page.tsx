"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock } from "@/components/ui";
import { BottomNav } from "@/components/ui";
import { MOCK_USER, MOCK_EVENTS, CATEGORIES, getGreeting, formatMonthDay, getCategoryColor } from "@/lib/mockData";
import Link from "next/link";

export default function HomeFeed() {
    const [activeTab, setActiveTab] = useState("All");

    const filteredEvents =
        activeTab === "All"
            ? MOCK_EVENTS
            : MOCK_EVENTS.filter((e) => e.category === activeTab);

    return (
        <div className="pb-28 min-h-screen">
            {/* Header */}
            <header className="px-6 pt-12 pb-5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-[var(--color-bg)]">
                        {MOCK_USER.avatar}
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight">
                            {getGreeting()}, {MOCK_USER.name.split(" ")[0]} <span className="inline-block origin-[70%_70%] animate-[wave_2.5s_infinite]">👋</span>
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                            {MOCK_EVENTS.length} events this week
                        </p>
                    </div>
                </div>
                <button className="w-11 h-11 bg-[var(--color-surface)] rounded-full flex items-center justify-center border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors relative">
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
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 snap-start border ${activeTab === cat
                                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
                                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)]"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between px-6 pb-4">
                <h2 className="text-xl font-extrabold">Upcoming Events</h2>
                <button className="text-sm font-bold text-[var(--color-accent)]">See all</button>
            </div>

            {/* Event List */}
            <div className="flex flex-col gap-4 px-6">
                <AnimatePresence mode="popLayout">
                    {filteredEvents.map((event, index) => {
                        const dateStr = formatMonthDay(event.date);

                        return (
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link href={`/events/${event.id}`}>
                                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-4.5 cursor-pointer transition-all duration-300 hover:bg-[var(--color-surface-elevated)] hover:-translate-y-1 hover:border-white/10 hover:shadow-xl group relative overflow-hidden">

                                        {/* Left Accent Bar */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-1 opacity-70"
                                            style={{ backgroundColor: getCategoryColor(event.category) }}
                                        />

                                        <div className="flex gap-4">
                                            {/* Date Block */}
                                            <div
                                                className="w-[60px] h-[70px] rounded-[14px] flex flex-col items-center justify-center shrink-0 shadow-inner"
                                                style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(event.category)} 15%, transparent)` }}
                                            >
                                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-80" style={{ color: getCategoryColor(event.category) }}>
                                                    {dateStr.month}
                                                </span>
                                                <span className="text-[26px] font-black leading-none" style={{ color: getCategoryColor(event.category) }}>
                                                    {dateStr.day}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 py-1">
                                                <h3 className="text-base font-bold leading-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-[13px] text-[var(--color-text-muted)] mb-1">
                                                    <Clock size={14} />
                                                    <span>{event.timeStart} - {event.timeEnd}</span>
                                                </div>
                                                <p className="text-[13px] font-semibold text-[var(--color-accent)]">
                                                    {event.club}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bottom Row */}
                                        <div className="flex items-center justify-between mt-4">
                                            {/* Attendee Avatars */}
                                            <div className="flex items-center">
                                                {[1, 2].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-8 h-8 rounded-full border-2 border-[var(--color-surface)] bg-gradient-to-br from-gray-700 to-gray-600 ${i > 1 ? '-ml-2.5' : ''}`}
                                                    />
                                                ))}
                                                <div className="w-8 h-8 rounded-full border-2 border-[var(--color-surface)] bg-[#252B3B] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-muted)] -ml-2.5 z-10">
                                                    +{event.registered - 2}
                                                </div>
                                            </div>

                                            <button className="px-5 py-2.5 bg-[var(--color-accent)] text-white text-sm font-bold rounded-xl transition-all hover:bg-blue-600 active:scale-95 shadow-[0_4px_14px_rgba(59,130,246,0.3)]">
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12 text-[var(--color-text-muted)] bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)]">
                        <p>No events found in this category.</p>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
