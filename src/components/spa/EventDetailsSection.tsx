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
                <p className="text-[15px] font-black leading-snug text-neutral-900 dark:text-white">{label}</p>
                <p className="text-[12px] text-neutral-600 dark:text-neutral-400 font-semibold mt-0.5">{sublabel}</p>
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
        <AnimatePresence>
            {event && (
                <>
                    {/* Toast */}
                    {toast && <Toast message={toast.message} type={toast.type} visible={toastVisible} />}

                    <motion.div
                        layout
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed inset-0 z-[150] bg-white dark:bg-neutral-950 flex justify-center"
                    >
                        <div className="w-full max-w-md bg-white dark:bg-neutral-900 min-h-screen relative flex flex-col overflow-x-hidden shadow-2xl">
                            {/* Back Button */}
                            <div className="absolute top-0 left-0 right-0 z-[200] px-4 pt-12 pb-2">
                                <button
                                    onClick={() => setSelectedEventId(null)}
                                    className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white transition-all shadow-sm"
                                    aria-label="Go back"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pt-28 pb-32 px-6">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                                        {event.title}
                                    </h1>
                                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                                        {event.faculty === "Miscellaneous" ? "Miscellaneous" : event.faculty} • {event.subcategory}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{dateStr.weekday}, {dateStr.month} {dateStr.day}</p>
                                            <p className="text-xs text-neutral-500">{event.timeStart} – {event.timeEnd}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{event.location}</p>
                                            <p className="text-xs text-neutral-500">University Campus</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                        <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
                                            <Info size={16} />
                                            About Event
                                        </h2>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom CTA */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                                <button
                                    onClick={handleToggleRegistration}
                                    disabled={isFull && !registered}
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-30 ${registered
                                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                        : "bg-black dark:bg-white text-white dark:text-black"
                                        }`}
                                >
                                    {registered ? (
                                        <>
                                            <CheckCircle size={18} />
                                            Registered
                                        </>
                                    ) : isFull ? (
                                        "Event Full"
                                    ) : (
                                        "Register Event"
                                    )}
                                </button>
                                <p className="text-[10px] text-neutral-400 text-center mt-3 font-medium">
                                    {registered ? "Tap to cancel registration" : "Free • Verified with Pulse ID"}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
