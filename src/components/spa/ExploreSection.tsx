"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Clock, Calendar } from "@/components/ui";
import { MOCK_EVENTS } from "@/lib/mockData";
import { CATEGORIES } from "@/lib/mockUser";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateBlock } from "@/utils/dateUtils";
import { useEventStore } from "@/state/useEventStore";
import { Event } from "@/types";
import Link from "next/link";

export default function ExploreSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("All");

    const filteredEvents = useMemo(() => {
        return MOCK_EVENTS.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (event.organizer && event.organizer.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesFaculty = selectedFaculty === "All" || event.faculty === selectedFaculty;
            return matchesSearch && matchesFaculty;
        });
    }, [searchQuery, selectedFaculty]);

    const formatFacultyName = (name: string) => {
        if (name === "All") return "All";
        if (name === "Faculty of Humanities and Sciences") return "Humanities";
        if (name === "Miscellaneous") return "Misc";
        return name.replace("Faculty of ", "").replace("School of ", "").replace(" Management", "");
    };

    return (
        <div className="pb-28 min-h-screen px-4">
            <header className="pt-12 pb-8">
                <h1 className="text-2xl font-bold tracking-tight mb-1">Explore</h1>
                <p className="text-sm text-neutral-500 font-medium">Find happenings on campus.</p>
            </header>

            <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all"
                />
            </div>

            <div className="flex gap-2.5 -mx-4 px-4 mb-8 overflow-x-auto hide-scrollbar">
                {["All", ...CATEGORIES].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedFaculty(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${selectedFaculty === cat
                            ? "bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm"
                            : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
                            }`}
                    >
                        {formatFacultyName(cat)}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredEvents.map((event) => (
                        <ExploreCard key={event.id} event={event} />
                    ))}
                </AnimatePresence>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700">
                        <p className="font-medium text-neutral-500 text-sm">No Results Found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ExploreCard({ event }: { event: any }) {
    const { setSelectedEventId } = useEventStore();

    return (
        <Link
            href={`/events/${event.id}`}
            onClick={() => setSelectedEventId(event.id)}
            className="block w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 transition-all active:scale-[0.98] group"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {event.title}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1">
                        {event.faculty === "Miscellaneous" ? "Miscellaneous" : event.faculty} • {event.subcategory}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-500" />
                    <span className="text-xs font-bold">{event.timeStart}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-neutral-400">
                    <MapPin size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none pt-0.5">
                        {event.location}
                    </span>
                </div>
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">
                    View Details
                </span>
            </div>
        </Link>
    );
}
