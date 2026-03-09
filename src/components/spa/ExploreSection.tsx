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
        <div className="pb-28 min-h-screen selection:bg-blue-500/30 px-4">
            <header className="pt-12 pb-8">
                <h1 className="text-3xl font-black tracking-tight mb-2">Explore</h1>
                <p className="text-[15px] text-[var(--color-text-muted)] font-medium">Discover what&apos;s happening on campus today.</p>
            </header>

            <div className="relative mb-6">
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

            <div className="flex flex-col gap-3 mb-8">
                {/* Tier 1: Faculties */}
                <div className="flex gap-2.5 -mx-4 px-4 overflow-x-auto hide-scrollbar">
                    {["All", ...CATEGORIES].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedFaculty(cat);
                                setSelectedSub("All");
                                setSelectedClub("All");
                            }}
                            className={`px-5 py-2 rounded-xl text-[13px] font-black whitespace-nowrap transition-all border ${selectedFaculty === cat
                                ? "bg-blue-600 text-white border-blue-500 shadow-lg scale-105"
                                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-text-muted)]/30"
                                }`}
                        >
                            {formatFacultyName(cat)}
                        </button>
                    ))}
                </div>

                {/* Tier 2: Misc Subcategories */}
                <AnimatePresence>
                    {selectedFaculty === "Miscellaneous" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: -12 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                            exit={{ opacity: 0, height: 0, marginTop: -12 }}
                            className="flex gap-2.5 -mx-4 px-4 overflow-x-auto hide-scrollbar"
                        >
                            {["All", ...MISC_SUBCATEGORIES].map((sub) => (
                                <button
                                    key={sub}
                                    onClick={() => {
                                        setSelectedSub(sub);
                                        setSelectedClub("All");
                                    }}
                                    className={`px-4 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all border ${selectedSub === sub
                                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md scale-105"
                                        : "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)]"
                                        }`}
                                >
                                    {sub === "Clubs & Societies" ? "Clubs" : sub}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tier 3: Clubs */}
                <AnimatePresence>
                    {selectedFaculty === "Miscellaneous" && selectedSub === "Clubs & Societies" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: -12 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                            exit={{ opacity: 0, height: 0, marginTop: -12 }}
                            className="flex gap-2.5 -mx-4 px-4 overflow-x-auto hide-scrollbar"
                        >
                            {["All", ...CLUBS].map((club) => (
                                <button
                                    key={club}
                                    onClick={() => setSelectedClub(club)}
                                    className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${selectedClub === club
                                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md scale-105"
                                        : "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)]"
                                        }`}
                                >
                                    {club}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
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
    const isMisc = event.faculty === "Miscellaneous";
    const shortFaculty = isMisc ? "Misc" : event.faculty.replace("Faculty of ", "").replace("School of ", "");

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
                <div className="p-5 flex flex-col gap-3">
                    <h3 className="text-lg font-black leading-tight text-[var(--color-text-main)] mb-2.5">
                        {event.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                        {event.faculty === "Miscellaneous" && event.subcategory === "Clubs & Societies" ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                Misc • Clubs
                            </span>
                        ) : (
                            <>
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                    {event.faculty === "Miscellaneous" ? "Misc" : event.faculty}
                                </span>
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    {event.subcategory}
                                </span>
                            </>
                        )}

                        {event.organizer && event.subcategory === "Clubs & Societies" && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {event.organizer}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-bold text-[var(--color-text-muted)] mt-1">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="opacity-60 text-blue-400" />
                            <span>{event.date} • {event.timeStart}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="opacity-60 text-emerald-400" />
                            <span className="truncate max-w-[150px]">{event.location}</span>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-4 bg-[var(--color-surface-elevated)] border-t border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex -space-x-2.5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-7 h-7 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-[10px]">
                                {String.fromCodePoint(0x1F642 + i)}
                            </div>
                        ))}
                        <div className="w-7 h-7 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-[9px] font-black">
                            +{event.registered}
                        </div>
                    </div>

                    <button className="text-blue-500 font-black text-[12px] uppercase tracking-wider px-4 py-2 bg-blue-500/10 rounded-xl active:scale-95 transition-all">
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
