"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Calendar, Clock, MapPin, Button } from "@/components/ui";
import { formatDate } from "@/lib/utils/date";
import { playSound } from "@/lib/sounds";
import { useEventStore } from "@/state/useEventStore";
import { User, Info, CheckCircle, AlertCircle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandingFooter } from "@/components/BrandingFooter";

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { events, registerEvent, unregisterEvent, isRegistered } = useEventStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const event = events.find((e) => e.id === id);
    const registered = isRegistered(id);

    // Fallback/Not Found
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
        // Simulate minor delay for premium feel
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

    return (
        <div className="pb-32 min-h-screen relative">
            {/* Header */}
            <header className="absolute top-0 w-full z-10 px-6 pt-12 pb-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] flex items-center justify-center transition-colors hover:bg-[var(--color-surface-elevated)]"
                >
                    <ChevronLeft size={20} className="text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <BrandLogo size={28} rounded="rounded-lg" className="mb-0.5" />
                    <span className="font-bold text-[12px] text-white/90">Details</span>
                </div>
                <div className="w-10" />
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
            </div>

            <div className="px-6 relative -mt-8">
                {/* Category Chip */}
                <div className="mb-4">
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
                                    <p className="text-[11px] font-black text-emerald-500">{Math.round((event.registered / event.maxParticipants) * 100)}% FULL</p>
                                </div>
                                <div className="w-full bg-[var(--color-surface-elevated)] h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${(event.registered / event.maxParticipants) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Organizer */}
                <div className="mb-8 p-4 bg-gradient-to-r from-[var(--color-surface)] to-transparent rounded-2xl border border-[var(--color-border)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xl shadow-lg border border-white/5">
                        {event.club.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-[16px]">{event.club}</h4>
                        <p className="text-[11px] text-[var(--color-text-muted)] font-black uppercase tracking-wider">Host Organization</p>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
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
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 pb-10 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/98 to-transparent z-50">
                <AnimatePresence mode="wait">
                    {registered ? (
                        <motion.div
                            key="unreg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-center gap-2 text-emerald-500 font-black text-[13px] uppercase tracking-wider mb-1">
                                <CheckCircle size={16} />
                                You are attending this event
                            </div>
                            <Button
                                fullWidth
                                variant="outline"
                                size="lg"
                                onClick={handleToggleRegistration}
                                disabled={isProcessing}
                                className="border-red-500/30 text-red-500 hover:bg-red-500/10 h-14 rounded-2xl"
                            >
                                {isProcessing ? "Processing..." : "Leave Event"}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="reg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onClick={handleToggleRegistration}
                            disabled={isProcessing}
                            className="w-full h-14 bg-[var(--color-accent)] text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-[0_12px_24px_-8px_rgba(59,130,246,0.5)] active:scale-[0.98] transition-all disabled:opacity-70 hover:shadow-[0_12px_30px_-5px_rgba(59,130,246,0.6)]"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">Securing Spot...</span>
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
