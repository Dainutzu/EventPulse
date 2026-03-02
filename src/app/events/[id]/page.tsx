"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Calendar, Clock, MapPin, Button } from "@/components/ui";
import { formatDate } from "@/lib/utils/date";
import { playSound } from "@/lib/sounds";
import { useEventStore } from "@/state/useEventStore";
import { User, Info, CheckCircle, AlertCircle, Bell, QrCode } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandingFooter } from "@/components/BrandingFooter";
import { MOCK_USER } from "@/lib/mockUser";

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const {
        events,
        registerEvent,
        unregisterEvent,
        isRegistered,
        getAttendanceStatus,
        updateAttendance,
        toggleReminder,
        hasReminder
    } = useEventStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const [showQr, setShowQr] = useState(false);

    const event = events.find((e) => e.id === id);
    const registered = isRegistered(id);
    const attendanceStatus = getAttendanceStatus(id);
    const reminderSet = hasReminder(id);
    const isAdmin = MOCK_USER.role === "admin" || MOCK_USER.role === "organizer";

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                    <AlertCircle size={40} />
                </div>
                <h1 className="text-2xl font-black mb-2">Event Not Found</h1>
                <p className="text-[var(--color-text-muted)] mb-8 max-w-[280px]">
                    The event you are looking for might have been moved or deleted.
                </p>
                <Link href="/home" className="w-full max-w-[200px]">
                    <Button fullWidth size="lg">Go to Home</Button>
                </Link>
            </div>
        );
    }

    const handleToggleRegistration = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setTimeout(() => {
            if (registered) {
                unregisterEvent(id);
                playSound("notification");
            } else {
                registerEvent(id);
                playSound("success");
            }
            setIsProcessing(false);
        }, 600);
    };

    const handleSimulateAttendance = () => {
        setIsProcessing(true);
        setTimeout(() => {
            updateAttendance(id, "attended");
            playSound("scan");
            setTimeout(() => playSound("achievement"), 800);
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div className="pb-40 min-h-screen relative overflow-x-hidden">
            {/* Header */}
            <header className="absolute top-0 w-full z-10 px-6 pt-12 pb-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] flex items-center justify-center transition-all hover:bg-[var(--color-surface-elevated)] active:scale-95"
                >
                    <ChevronLeft size={20} className="text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <BrandLogo size={28} rounded="rounded-lg" className="mb-0.5" />
                    <span className="font-bold text-[12px] text-white/90">Details</span>
                </div>
                <button
                    onClick={() => {
                        toggleReminder(id);
                        playSound("notification");
                    }}
                    className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all active:scale-95 ${reminderSet ? 'bg-amber-500 border-amber-400' : 'bg-[var(--color-surface)]/80 border-[var(--color-border)]'}`}
                >
                    <Bell size={20} className={reminderSet ? "text-white" : "text-white/60"} fill={reminderSet ? "currentColor" : "none"} />
                </button>
            </header>

            {/* Hero Banner */}
            <div className="h-[300px] w-full relative bg-[#0F172A] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-[20%] left-[-10%] w-[120%] h-[2px] bg-cyan-400 rotate-12 blur-[1px]" />
                    <div className="absolute top-[40%] left-[-10%] w-[120%] h-[2px] bg-blue-500 rotate-12 blur-[1px]" />
                    <div className="absolute top-[60%] left-[-10%] w-[120%] h-[2px] bg-purple-500 rotate-12 blur-[1px]" />
                </div>
                {event.banner ? (
                    <img src={event.banner} alt={event.title} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-indigo-500 z-10 tracking-widest text-center px-6 drop-shadow-2xl">
                        {event.title.toUpperCase()}
                    </h2>
                )}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />

                {attendanceStatus === "attended" && (
                    <div className="absolute bottom-12 right-6 rotate-12 z-20">
                        <div className="border-4 border-emerald-500/50 text-emerald-500/80 px-4 py-1 rounded-xl font-black text-2xl uppercase tracking-tighter backdrop-blur-sm">
                            Verified
                        </div>
                    </div>
                )}
            </div>

            <div className="px-6 relative -mt-8">
                {/* Status Chips */}
                <div className="flex gap-2 mb-4">
                    <span
                        className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg border"
                        style={{
                            backgroundColor: `color-mix(in srgb, ${event.categoryColor} 20%, #000)`,
                            color: event.categoryColor,
                            borderColor: `${event.categoryColor}40`
                        }}
                    >
                        {event.category}
                    </span>
                    {event.trending && (
                        <span className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5 animate-pulse">
                            🔥 Trending
                        </span>
                    )}
                </div>

                <h1 className="text-2xl font-black leading-tight mb-6">
                    {event.title}
                </h1>

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-3 mb-8">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-[15px]">{formatDate(event.date)}</p>
                            <p className="text-[12px] text-[var(--color-text-muted)] font-medium">Session Date</p>
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                        <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-[15px]">{event.timeStart} – {event.timeEnd}</p>
                            <p className="text-[12px] text-[var(--color-text-muted)] font-medium">Local Duration</p>
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 border border-purple-500/20">
                            <MapPin size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-[15px]">{event.venue}</p>
                            <p className="text-[12px] text-[var(--color-text-muted)] font-medium">Location</p>
                        </div>
                    </div>

                    {event.maxParticipants && (
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                <User size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-bold text-[15px]">{event.registered} / {event.maxParticipants}</p>
                                    <p className="text-[11px] font-black text-emerald-500 tracking-tighter">
                                        {event.registered >= event.maxParticipants ? "FULL CAPACITY" : `${event.maxParticipants - event.registered} SEATS LEFT`}
                                    </p>
                                </div>
                                <div className="w-full bg-[var(--color-surface-elevated)] h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(event.registered / event.maxParticipants) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Organizer & QR Action */}
                <div className="flex flex-col gap-3 mb-8">
                    <div className="p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xl shadow-lg border border-white/5">
                                {event.club.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-[16px]">{event.club}</h4>
                                <p className="text-[11px] text-[var(--color-text-muted)] font-black uppercase tracking-wider">Host Organization</p>
                            </div>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={() => setShowQr(!showQr)}
                                className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 flex items-center justify-center hover:bg-[var(--color-accent)]/20 transition-all"
                            >
                                <QrCode size={24} />
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {showQr && isAdmin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl flex flex-col items-center text-center shadow-inner mb-4">
                                    <div className="w-48 h-48 bg-white p-4 rounded-xl mb-4 shadow-2xl">
                                        {/* Mock Minimalist QR */}
                                        <div className="w-full h-full border-4 border-black grid grid-cols-4 grid-rows-4 gap-1 p-1">
                                            {[...Array(16)].map((_, i) => (
                                                <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[13px] font-bold mb-1">Check-in Terminal</p>
                                    <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-widest font-black">Scan to mark attendance</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Description */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <Info size={18} className="text-[var(--color-accent)]" />
                        <h3 className="text-lg font-black tracking-tight">Overview</h3>
                    </div>
                    <div className="text-[15px] text-[var(--color-text-muted)] leading-relaxed space-y-4 font-medium">
                        {event.description.split("\n\n").map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>

                <BrandingFooter />
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 pb-12 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/98 to-transparent z-50">
                <AnimatePresence mode="wait">
                    {attendanceStatus === "attended" ? (
                        <motion.div
                            key="attended"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                <CheckCircle size={18} />
                            </div>
                            <span className="font-black text-[13px] uppercase tracking-[0.1em] text-emerald-500">Attendance Confirmed</span>
                        </motion.div>
                    ) : registered ? (
                        <motion.div
                            key="unreg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col gap-3"
                        >
                            <Button
                                fullWidth
                                variant="default"
                                size="lg"
                                onClick={handleSimulateAttendance}
                                disabled={isProcessing}
                                className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_12px_24px_-8px_rgba(79,70,229,0.4)]"
                            >
                                {isProcessing ? (
                                    <span className="animate-pulse">Validating Presence...</span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <QrCode size={20} />
                                        <span>Verify Presence</span>
                                    </div>
                                )}
                            </Button>
                            <button
                                onClick={handleToggleRegistration}
                                disabled={isProcessing}
                                className="text-[12px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors py-2"
                            >
                                {isProcessing ? "Processing..." : "Cancel Registration"}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="reg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onClick={handleToggleRegistration}
                            disabled={isProcessing || event.registered >= event.maxParticipants}
                            className={`w-full h-14 font-black rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 ${event.registered >= event.maxParticipants
                                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                : "bg-[var(--color-accent)] text-white shadow-[0_12px_24px_-8px_rgba(59,130,246,0.5)] active:scale-[0.98] hover:shadow-[0_12px_30px_-5px_rgba(59,130,246,0.6)]"
                                }`}
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">Securing Spot...</span>
                            ) : event.registered >= event.maxParticipants ? (
                                "Waitlist Full"
                            ) : (
                                <>Register Now</>
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
