"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Clock } from "@/components/ui";
import { MOCK_EVENTS } from "@/lib/mockData";
import { CATEGORIES } from "@/lib/mockUser";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryColor } from "@/lib/utils/ui";
import { formatDateBlock } from "@/utils/dateUtils";
import { useEventStore } from "@/state/useEventStore";
import { Event } from "@/types";

const MISC_SUBCATEGORIES = ["Sports", "Music", "Social", "Cultural", "Community", "Clubs & Societies"];
const CLUBS = ["Leo Club", "Rotaract Club", "Gavel Club", "Debating Society", "Entrepreneurship Club"];

export default function ExploreSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("All");
    const [selectedSub, setSelectedSub] = useState("All");
    const [selectedClub, setSelectedClub] = useState("All");

    const { setSelectedEventId } = useEventStore();

    const filteredEvents = useMemo(() => {
        return MOCK_EVENTS.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (event.organizer && event.organizer.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesFaculty = selectedFaculty === "All" || event.faculty === selectedFaculty;

            let matchesSub = true;
            if (selectedFaculty === "Miscellaneous" && selectedSub !== "All") {
                matchesSub = event.subcategory === selectedSub;
            }

            let matchesClub = true;
            if (selectedFaculty === "Miscellaneous" && selectedSub === "Clubs & Societies" && selectedClub !== "All") {
                matchesClub = event.organizer === selectedClub;
            }

            return matchesSearch && matchesFaculty && matchesSub && matchesClub;
        });
    }, [searchQuery, selectedFaculty, selectedSub, selectedClub]);

    // Format faculty names for the filter pills
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
                    <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700">
                        <p className="font-medium text-neutral-500 text-sm">No Results Found</p>
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
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="w-full"
            onClick={onSelect}
        >
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white line-clamp-1">
                            {event.title}
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">
                            {event.date} • {event.faculty === "Miscellaneous" ? "Miscellaneous" : event.faculty}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                        <Clock size={14} className="opacity-50" />
                        <span>{event.timeStart}</span>
                    </div>

                    <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline px-3 py-1.5 bg-blue-500/10 rounded-lg transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
