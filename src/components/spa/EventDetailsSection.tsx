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
                <p className="text-[15px] font-black leading-snug text-[var(--color-text-main)]">{label}</p>
                <p className="text-[12px] text-[var(--color-text-muted)] font-semibold mt-0.5">{sublabel}</p>
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
                className="fixed inset-0 z-[150] bg-[var(--color-bg)] flex flex-col overflow-hidden"
            >
                {/* ── Fixed Back Button ─────────────────────────────────────────── */}
                <div className="absolute top-0 left-0 right-0 z-[200] flex items-center justify-between px-4 pt-12 pb-2 pointer-events-none">
                    <button
                        onClick={() => setSelectedEventId(null)}
                        className="pointer-events-auto w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white active:scale-90 transition-all shadow-lg"
                        aria-label="Go back"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>
                    <button
                        className="pointer-events-auto w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white active:scale-90 transition-all shadow-lg"
                        aria-label="Share event"
                    >
                        <Share2 size={18} />
                    </button>
                </div>

                {/* ── Scrollable Content ────────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto overscroll-contain pb-36 hide-scrollbar scroll-smooth">
                    {/* Banner */}
                    <div className="relative h-[280px] w-full shrink-0 overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(135deg, ${event.categoryColor}33 0%, ${event.categoryColor}18 50%, ${event.categoryColor}08 100%)`
                            }}
                        />
                        {/* Decorative circles */}
                        <div
                            className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20 blur-3xl"
                            style={{ backgroundColor: event.categoryColor }}
                        />
                        <div
                            className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10 blur-2xl"
                            style={{ backgroundColor: event.categoryColor }}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[var(--color-bg)]" />

                        {/* Category Icon */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div
                                className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/10"
                                style={{ backgroundColor: `${event.categoryColor}25` }}
                            >
                                <span className="text-5xl select-none">
                                    {event.category === "Tech" ? "💻" :
                                        event.category === "Sports" ? "🏆" :
                                            event.category === "Cultural" ? "🎭" :
                                                event.category === "Academic" ? "📚" : "💼"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="px-5 -mt-4 flex flex-col gap-6">
                        {/* Badges Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                className="px-3 py-1.5 rounded-xl text-[11px] font-black border"
                                style={{
                                    backgroundColor: `${event.categoryColor}18`,
                                    borderColor: `${event.categoryColor}35`,
                                    color: event.categoryColor
                                }}
                            >
                                {event.category}
                            </Badge>
                            {event.trending && (
                                <Badge className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-amber-500/15 border-amber-500/30 text-amber-400 flex items-center gap-1.5 border">
                                    <Flame size={11} />
                                    Trending
                                </Badge>
                            )}
                            {registered && (
                                <Badge className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-emerald-500/15 border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 border">
                                    <Sparkles size={11} />
                                    Registered
                                </Badge>
                            )}
                        </div>

                        {/* Title & Club */}
                        <div>
                            <h1 className="text-[22px] font-black leading-tight tracking-tight text-[var(--color-text-main)] mb-2">
                                {event.title}
                            </h1>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                                <span className="text-[13px] font-bold text-[var(--color-text-muted)]">
                                    {event.club}
                                </span>
                            </div>
                        </div>

                        {/* Seats Progress */}
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2.5">
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-[var(--color-text-muted)]" />
                                    <span className="text-[12px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                                        Seats
                                    </span>
                                </div>
                                <span className={`text-[12px] font-black ${isFull ? "text-red-400" :
                                        isAlmostFull ? "text-amber-400" : "text-emerald-400"
                                    }`}>
                                    {isFull ? "FULL" : isAlmostFull ? `Only ${seatsLeft} left!` : `${seatsLeft} available`}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-[var(--color-bg)] rounded-full overflow-hidden border border-[var(--color-border)]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                    className={`h-full rounded-full ${isFull ? "bg-red-500" :
                                            isAlmostFull ? "bg-amber-500" : "bg-emerald-500"
                                        }`}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2.5">
                                <span className="text-[11px] font-bold text-[var(--color-text-muted)]">
                                    {event.registered} attending
                                </span>
                                <span className="text-[11px] font-bold text-[var(--color-text-muted)]">
                                    {event.maxParticipants} max
                                </span>
                            </div>
                        </div>

                        {/* Info Rows */}
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col divide-y divide-[var(--color-border)]">
                            <div className="pb-4">
                                <InfoRow
                                    icon={<Calendar size={18} className="text-blue-500" />}
                                    iconBg="bg-blue-500/10 border border-blue-500/20"
                                    label={`${dateStr.weekday}, ${dateStr.month} ${dateStr.day}`}
                                    sublabel="Upcoming"
                                />
                            </div>
                            <div className="py-4">
                                <InfoRow
                                    icon={<Clock size={18} className="text-indigo-500" />}
                                    iconBg="bg-indigo-500/10 border border-indigo-500/20"
                                    label={`${event.timeStart} – ${event.timeEnd}`}
                                    sublabel="Standard Time"
                                />
                            </div>
                            <div className="pt-4">
                                <InfoRow
                                    icon={<MapPin size={18} className="text-emerald-500" />}
                                    iconBg="bg-emerald-500/10 border border-emerald-500/20"
                                    label={event.venue}
                                    sublabel="University Campus"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[15px] font-black flex items-center gap-2 text-[var(--color-text-main)]">
                                <Info size={16} className="text-blue-500 shrink-0" />
                                About this Event
                            </h2>
                            <p className="text-[15px] text-[var(--color-text-muted)] leading-[1.7] font-medium">
                                {event.description}
                            </p>
                        </div>

                        {/* Avatar Crowd */}
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex items-center gap-4">
                            <div className="flex -space-x-2.5 shrink-0">
                                {[0x1F642, 0x1F600, 0x1F601, 0x1F604, 0x1F609].map((cp, i) => (
                                    <div
                                        key={i}
                                        className="w-9 h-9 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-surface-elevated)] flex items-center justify-center text-[14px]"
                                    >
                                        {String.fromCodePoint(cp)}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-[14px] font-black text-[var(--color-text-main)]">
                                    +{event.registered} students going
                                </p>
                                <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mt-0.5">
                                    Secure your spot before it fills up
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Fixed Bottom CTA ──────────────────────────────────────────── */}
                <div className="absolute bottom-0 left-0 right-0 z-[160] bg-gradient-to-t from-[var(--color-bg)] from-60% via-[var(--color-bg)]/90 to-transparent pt-8 px-5 pb-8">
                    <motion.button
                        onClick={handleToggleRegistration}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        disabled={isFull && !registered}
                        className={`w-full py-[18px] rounded-2xl font-black text-[17px] transition-all duration-200 shadow-2xl flex items-center justify-center gap-3 active:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed ${registered
                                ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/30"
                                : isFull
                                    ? "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                                    : "bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)]"
                            }`}
                    >
                        {registered ? (
                            <>
                                <CheckCircle size={22} />
                                Registered ✓
                            </>
                        ) : isFull ? (
                            "Event Full"
                        ) : (
                            "Confirm Registration"
                        )}
                    </motion.button>
                    <p className="text-[11px] text-[var(--color-text-muted)] text-center mt-3 font-semibold uppercase tracking-[0.15em] opacity-40">
                        {registered ? "Tap to cancel registration" : "Free • Verified with Pulse ID"}
                    </p>
                </div>
            </motion.div>
        </>
    );
}
