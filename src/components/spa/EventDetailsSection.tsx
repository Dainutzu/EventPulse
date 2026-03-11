"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    MapPin,
    Clock,
    Calendar,
    Share2,
    CheckCircle,
    Info,
    ShieldCheck,
    Users,
    Flame,
    Sparkles,
    XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { useEventStore } from "@/state/useEventStore";
import { formatDateBlock } from "@/utils/dateUtils";
import { playSound } from "@/lib/sounds";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getEventEmoji(faculty: string, subcategory: string): string {
    if (subcategory === "Sports") return "🏆";
    if (subcategory === "Music") return "🎵";
    if (subcategory === "Cultural") return "🎭";
    if (subcategory === "Workshop" || subcategory === "Workshops") return "🛠️";
    if (subcategory === "Clubs & Societies") return "🤝";
    if (subcategory === "Competition") return "🏅";
    if (subcategory === "Seminar") return "📡";
    if (subcategory === "Lecture" || subcategory === "Guest Lecture") return "📚";
    if (faculty === "Faculty of Computing") return "💻";
    if (faculty === "School of Business") return "💼";
    if (faculty === "School of Architecture") return "🏛️";
    if (faculty === "Faculty of Humanities and Sciences") return "🔬";
    if (faculty === "School of Law") return "⚖️";
    if (faculty === "School of Hospitality Management") return "🍽️";
    return "🎓";
}

function getShortFaculty(faculty: string): string {
    if (faculty === "Miscellaneous") return "Misc";
    return faculty.replace("Faculty of ", "").replace("School of ", "");
}

// ─── Toast Notification Component ─────────────────────────────────────────────
interface ToastProps {
    message: string;
    type: "success" | "info";
    visible: boolean;
}

function Toast({ message, type, visible }: ToastProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`fixed top-5 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-black whitespace-nowrap ${type === "success"
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                        : "bg-blue-500/20 border-blue-500/30 text-blue-400"
                        }`}
                >
                    {type === "success" ? (
                        <CheckCircle size={16} className="shrink-0" />
                    ) : (
                        <XCircle size={16} className="shrink-0" />
                    )}
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Info Row Component ────────────────────────────────────────────────────────
interface InfoRowProps {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    sublabel: string;
}

function InfoRow({ icon, iconBg, label, sublabel }: InfoRowProps) {
    return (
        <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
                {icon}
            </div>
            <div>
                <p className="text-[15px] font-black leading-snug text-gray-900 dark:text-white">{label}</p>
                <p className="text-[12px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">{sublabel}</p>
            </div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function EventDetailsSection() {
    const {
        selectedEventId,
        setSelectedEventId,
        events,
        isRegistered,
        registerEvent,
        unregisterEvent,
    } = useEventStore();

    const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
    const [toastVisible, setToastVisible] = useState(false);

    const event = useMemo(() =>
        events.find(e => e.id === selectedEventId),
        [events, selectedEventId]);

    const showToast = useCallback((message: string, type: "success" | "info") => {
        setToast({ message, type });
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2200);
    }, []);

    if (!event) return null;

    const registered = isRegistered(event.id);
    const dateStr = formatDateBlock(event.date);
    const seatsLeft = event.maxParticipants - event.registered;
    const progress = Math.min((event.registered / event.maxParticipants) * 100, 100);
    const isAlmostFull = seatsLeft <= 5 && seatsLeft > 0;
    const isFull = seatsLeft <= 0;
    const shortFaculty = getShortFaculty(event.faculty);
    const isClubEvent = event.subcategory === "Clubs & Societies" && !!event.organizer;

    const handleToggleRegistration = () => {
        if (isFull && !registered) {
            showToast("This event is full.", "info");
            return;
        }
        if (registered) {
            unregisterEvent(event.id);
            playSound("notification");
            showToast("Registration cancelled.", "info");
        } else {
            registerEvent(event.id);
            playSound("success");
            showToast("You're registered! 🎉", "success");
        }
    };

    return (
        <>
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} visible={toastVisible} />}

            <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                className="fixed inset-0 z-[150] bg-neutral-50 dark:bg-neutral-950 flex justify-center"
            >
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 min-h-screen relative flex flex-col overflow-x-hidden shadow-2xl">
                    {/* ── Absolute Back Button ─────────────────────────────────────────── */}
                    <div className="absolute top-0 left-0 right-0 z-[200] flex items-center justify-between px-4 pt-12 pb-2 pointer-events-none">
                        <button
                            onClick={() => setSelectedEventId(null)}
                            className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white active:scale-90 transition-all shadow-lg"
                            aria-label="Go back"
                        >
                            <ChevronLeft size={22} strokeWidth={2.5} />
                        </button>
                        <button
                            className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white active:scale-90 transition-all shadow-lg"
                            aria-label="Share event"
                        >
                            <Share2 size={18} />
                        </button>
                    </div>

                    {/* ── Scrollable Content ────────────────────────────────────────── */}
                    <div className="flex-1 overflow-y-auto overscroll-contain pb-36 hide-scrollbar scroll-smooth">
                        {/* Banner */}
                        <div className="relative w-full shrink-0 overflow-hidden px-4 pt-20">
                            <img 
                                src={event.banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"} 
                                alt={event.title}
                                className="w-full h-48 object-cover rounded-xl shadow-sm"
                            />
                        </div>

                        {/* Content */}
                        <div className="px-4 py-6 flex flex-col space-y-4">
                            {/* Title & Details */}
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {event.title}
                                </h1>

                                <div className="flex flex-col gap-1.5">
                                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                                        {event.faculty === "Miscellaneous" && event.subcategory === "Clubs & Societies" ? "Misc • Clubs" : `${shortFaculty} • ${event.subcategory}`}
                                    </span>

                                    {isClubEvent && (
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                Organised by <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{event.organizer}</span>
                                            </span>
                                        </div>
                                    )}
                                    {event.organizer && !isClubEvent && (
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                {event.organizer}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Badges Row */}
                            {(event.trending || registered) && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    {event.trending && (
                                        <Badge className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center gap-1 border border-amber-200 dark:border-amber-900/50">
                                            <Flame size={10} />
                                            Trending
                                        </Badge>
                                    )}
                                    {registered && (
                                        <Badge className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 border border-emerald-200 dark:border-emerald-900/50">
                                            <Sparkles size={10} />
                                            Registered
                                        </Badge>
                                    )}
                                </div>
                            )}

                             {/* Info Rows */}
                            <div className="bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-700/50 rounded-xl p-4 flex flex-col divide-y divide-gray-100 dark:divide-neutral-700/50">
                                <div className="pb-3">
                                    <InfoRow
                                        icon={<Calendar size={18} className="text-blue-500" />}
                                        iconBg="bg-blue-100/50 dark:bg-blue-900/20"
                                        label={`${dateStr.weekday}, ${dateStr.month} ${dateStr.day}`}
                                        sublabel="Upcoming"
                                    />
                                </div>
                                <div className="py-3">
                                    <InfoRow
                                        icon={<Clock size={18} className="text-indigo-500" />}
                                        iconBg="bg-indigo-100/50 dark:bg-indigo-900/20"
                                        label={`${event.timeStart} – ${event.timeEnd}`}
                                        sublabel="Standard Time"
                                    />
                                </div>
                                <div className="pt-3">
                                    <InfoRow
                                        icon={<MapPin size={18} className="text-emerald-500" />}
                                        iconBg="bg-emerald-100/50 dark:bg-emerald-900/20"
                                        label={event.location}
                                        sublabel="University Campus"
                                    />
                                </div>
                            </div>

                             {/* Seats Progress */}
                            <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Users size={14} className="text-gray-500 dark:text-gray-400" />
                                        <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Seats
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold ${isFull ? "text-red-500" :
                                        isAlmostFull ? "text-amber-500" : "text-emerald-500"
                                        }`}>
                                        {isFull ? "FULL" : isAlmostFull ? `Only ${seatsLeft} left!` : `${seatsLeft} available`}
                                    </span>
                                </div>
                                 <div className="h-1.5 w-full bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                        className={`h-full rounded-full ${isFull ? "bg-red-500" :
                                            isAlmostFull ? "bg-amber-500" : "bg-emerald-500"
                                            }`}
                                    />
                                </div>
                                 <div className="flex items-center justify-between mt-2">
                                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                        {event.registered} attending
                                    </span>
                                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                        {event.maxParticipants} max
                                    </span>
                                </div>
                            </div>

                             {/* Description */}
                            <div className="flex flex-col gap-2 pt-2">
                                <h2 className="text-sm font-semibold flex items-center gap-1.5 text-gray-900 dark:text-white">
                                    <Info size={15} className="text-blue-500 shrink-0" />
                                    About this Event
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    </div>

                     {/* ── Absolute Bottom CTA ──────────────────────────────────────────── */}
                    <div className="absolute bottom-0 left-0 right-0 z-[160] bg-gradient-to-t from-white dark:from-neutral-900 via-white/95 dark:via-neutral-900/95 to-transparent pt-10 px-4 pb-6 border-t border-gray-100/50 dark:border-neutral-800">
                        <button
                            onClick={handleToggleRegistration}
                            disabled={isFull && !registered}
                            className={`w-full py-3 rounded-xl font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${registered
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                                : isFull
                                    ? "bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500"
                                    : "bg-black text-white dark:bg-white dark:text-black"
                                }`}
                        >
                            {registered ? (
                                <>
                                    <CheckCircle size={18} />
                                    Registered ✓
                                </>
                            ) : isFull ? (
                                "Event Full"
                            ) : (
                                "Register Event"
                            )}
                         </button>
                        <p className="text-[10px] text-gray-400 dark:text-neutral-500 text-center mt-2 font-medium uppercase tracking-widest">
                            {registered ? "Tap to cancel registration" : "Free • Verified with Pulse ID"}
                        </p>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
