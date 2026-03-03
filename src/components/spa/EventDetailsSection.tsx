"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    MapPin,
    Clock,
    Users,
    Calendar,
    Share2,
    CheckCircle,
    Info,
    ShieldCheck
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useEventStore } from "@/state/useEventStore";
import { getCategoryColor } from "@/lib/utils/ui";
import { formatDateBlock } from "@/utils/dateUtils";
import { playSound } from "@/lib/sounds";

export default function EventDetailsSection() {
    const {
        selectedEventId,
        setSelectedEventId,
        events,
        isRegistered,
        registerEvent,
        unregisterEvent
    } = useEventStore();

    const event = useMemo(() =>
        events.find(e => e.id === selectedEventId),
        [events, selectedEventId]);

    if (!event) return null;

    const registered = isRegistered(event.id);
    const dateStr = formatDateBlock(event.date);
    const seatsLeft = event.maxParticipants - event.registered;
    const progress = (event.registered / event.maxParticipants) * 100;

    const handleToggleRegistration = () => {
        if (registered) {
            unregisterEvent(event.id);
            playSound("notification");
        } else {
            registerEvent(event.id);
            playSound("success");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-[150] bg-[var(--color-bg)] flex flex-col overflow-y-auto hide-scrollbar"
        >
            {/* Header / Banner Area */}
            <div className="relative h-[320px] w-full shrink-0 overflow-hidden">
                {/* Visual Background */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10"
                />
                <div
                    className="absolute inset-0 opacity-40 mix-blend-overlay"
                    style={{ backgroundColor: event.categoryColor }}
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSelectedEventId(null)}
                            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all">
                            <Share2 size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white font-black px-3 py-1 rounded-lg">
                                {event.category}
                            </Badge>
                            {event.trending && (
                                <Badge className="bg-amber-500/80 backdrop-blur-md border-amber-400/30 text-white font-black px-3 py-1 rounded-lg">
                                    ✨ Trending
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-black text-white leading-tight drop-shadow-lg">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-[var(--color-bg)] rounded-t-[32px] -mt-8 relative z-30 p-6 flex flex-col gap-8">
                {/* Stats Row */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm transition-all hover:bg-[var(--color-surface-elevated)]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Seats Left</span>
                        <span className="text-xl font-black text-blue-500">{seatsLeft}</span>
                    </div>
                    <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm transition-all hover:bg-[var(--color-surface-elevated)]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Attending</span>
                        <span className="text-xl font-black text-emerald-500">{event.registered}</span>
                    </div>
                </div>

                {/* Info List */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Calendar size={22} />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-[var(--color-text-main)]">{dateStr.month} {dateStr.day}, {dateStr.weekday}</p>
                            <p className="text-[12px] text-[var(--color-text-muted)] font-bold">Mark your calendar</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Clock size={22} />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-[var(--color-text-main)]">{event.timeStart} - {event.timeEnd}</p>
                            <p className="text-[12px] text-[var(--color-text-muted)] font-bold">Standard Time</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <MapPin size={22} />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-[var(--color-text-main)]">{event.venue}</p>
                            <p className="text-[12px] text-[var(--color-text-muted)] font-bold">University Campus</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-[var(--color-text-main)]">{event.club}</p>
                            <p className="text-[12px] text-[var(--color-text-muted)] font-bold">Verified Club</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <Info size={18} className="text-blue-500" /> Details
                    </h2>
                    <p className="text-[15px] text-[var(--color-text-muted)] leading-relaxed font-medium">
                        {event.description}
                    </p>
                </div>

                {/* Attendance List Simulation */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-60">Registration Goal</h3>
                        <span className="text-xs font-black text-blue-500">{Math.round(progress)}% Full</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--color-bg)] rounded-full overflow-hidden mb-4 border border-[var(--color-border)]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                        />
                    </div>
                    <div className="flex -space-x-3 overflow-hidden justify-center p-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-surface-elevated)] flex items-center justify-center text-[10px] font-bold">
                                {String.fromCodePoint(0x1F642 + i)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Action Button */}
            <div className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/95 to-transparent pt-12 pb-10 z-[40]">
                <button
                    onClick={handleToggleRegistration}
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${registered
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                            : "bg-blue-600 text-white hover:bg-blue-500"
                        }`}
                >
                    {registered ? (
                        <>
                            <CheckCircle size={24} />
                            Already Registered
                        </>
                    ) : (
                        "Confirm Registration"
                    )}
                </button>
                <p className="text-[11px] text-[var(--color-text-muted)] text-center mt-4 font-black uppercase tracking-[0.2em] opacity-40">
                    Secure checkout with Pulse ID
                </p>
            </div>
        </motion.div>
    );
}
