"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import { MOCK_USER, CATEGORIES } from "@/lib/mockUser";
import { getGreeting, getCategoryColor } from "@/lib/utils/ui";
import { formatDateBlock, processEvents } from "@/utils/dateUtils";
import { useEventStore } from "@/state/useEventStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Event } from "@/types";

interface HomeSectionProps {
    initialEvents: Event[];
}

export default function HomeSection({ initialEvents }: HomeSectionProps) {
    const [activeCategory, setActiveCategory] = useState("All");
    const { events, unregisterEvent, registerEvent, isRegistered, isHydrated, setSelectedEventId } = useEventStore();

    const filteredEvents = useMemo(() => {
        const currentEvents = isHydrated && events.length > 0 ? events : initialEvents;
        return activeCategory === "All"
            ? currentEvents
            : currentEvents.filter((e) => e.faculty === activeCategory);
    }, [events, initialEvents, activeCategory, isHydrated]);

    const { upcoming, past } = useMemo(() => processEvents(filteredEvents), [filteredEvents]);

    return (
        <div className="pb-28 min-h-screen px-4">
            <header className="pt-12 pb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {getGreeting()}, {MOCK_USER.name.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                    You have <span className="text-neutral-900 dark:text-white font-bold">{upcoming.length} upcoming events</span>.
                </p>
            </header>

            <div className="flex gap-2.5 -mx-4 px-4 pb-8 overflow-x-auto hide-scrollbar">
                {["All", ...CATEGORIES].map((cat) => {
                    const label = cat === "All" ? "All" : cat === "Miscellaneous" ? "Misc" : cat.replace("Faculty of ", "").replace("School of ", "");
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${activeCategory === cat
                                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent shadow-md"
                                : "bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <div className="mb-10">
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">Upcoming Events</h2>
                <div className="flex flex-col gap-4">
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
                        <div className="text-center py-12 text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                            <p className="text-sm font-medium">No events found.</p>
                        </div>
                    )}
                </div>
            </div>

            {past.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-sm font-bold text-neutral-400 dark:text-neutral-600 mb-4 uppercase tracking-wider">Completed Recently</h2>
                    <div className="flex flex-col gap-4">
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
                </div>
            )}
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

function EventCard({ event, index, isRegistered, isPast, onSelect }: EventCardProps) {
    const dateStr = formatDateBlock(event.date);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            className="w-full"
            onClick={onSelect}
        >
            <div className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] ${isPast ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white truncate">
                            {event.title}
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5 truncate">
                            {event.faculty}
                        </p>
                    </div>
                    {isRegistered && (
                        <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 shrink-0">
                            REGISTERED
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-xs font-bold text-neutral-400 dark:text-neutral-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{dateStr.month} {dateStr.day}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{event.timeStart}</span>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelect();
                        }}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
