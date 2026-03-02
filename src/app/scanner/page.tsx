"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle, Calendar } from "@/components/ui";
import { BottomNav } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/lib/sounds";
import { useEventStore } from "@/state/useEventStore";

export default function QRScanner() {
    const router = useRouter();
    const { events, updateAttendance } = useEventStore();
    const [scanState, setScanState] = useState<"scanning" | "success">("scanning");

    // For demo, we'll scan the first upcoming tech event
    const eventToScan = events.find(e => e.category === "Tech") || events[0];

    useEffect(() => {
        if (scanState === "scanning") {
            const timer = setTimeout(() => {
                setScanState("success");
                updateAttendance(eventToScan.id, "attended");
                playSound("scan");

                setTimeout(() => playSound("achievement"), 800);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [scanState, eventToScan.id, updateAttendance]);

    return (
        <div className="min-h-screen pb-28 relative flex flex-col">
            {/* Header */}
            <header className="px-6 pt-12 pb-6 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--color-surface)]"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <span className="font-extrabold text-[18px]">QR Attendance</span>
                <div className="w-10" />
            </header>

            <div className="flex-1 px-5 flex flex-col pt-4">
                <AnimatePresence mode="wait">
                    {scanState === "scanning" ? (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex-1 flex flex-col mt-10"
                        >
                            <div className="mt-8 text-center text-[var(--color-text-muted)] text-[15px] max-w-[280px] mx-auto leading-relaxed">
                                Position the QR code within the frame to record your attendance.
                            </div>

                            {/* Viewfinder Frame */}
                            <div className="mt-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-6 relative shadow-2xl overflow-hidden mx-auto w-full max-w-[320px]">
                                <div className="aspect-square bg-[#0c1018] rounded-2xl relative overflow-hidden flex items-center justify-center">

                                    {/* Grid overlay to simulate camera */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

                                    {/* Animated Grid line */}
                                    <motion.div
                                        className="absolute left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 rounded-full"
                                        animate={{ top: ["10%", "90%", "10%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />

                                    {/* Corner brackets */}
                                    <div className="absolute inset-6">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    </div>

                                    <span className="text-[var(--color-text-dim)] font-black text-2xl tracking-widest opacity-30 select-none">SCAN</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col items-center pt-8"
                        >
                            {/* Success Checkmark */}
                            <motion.div
                                className="w-20 h-20 rounded-full bg-blue-500/10 border-[3px] border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-10"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <CheckCircle size={36} className="text-blue-500" />
                            </motion.div>

                            <h2 className="text-[26px] font-black leading-tight text-center px-4 mb-4">
                                Attendance Recorded<br />Successfully
                            </h2>

                            <p className="text-[15px] text-[var(--color-text-muted)] text-center w-full max-w-[300px] leading-relaxed mx-auto mb-10">
                                Your presence at the <span className="text-[var(--color-accent)] font-bold">{eventToScan.title}</span> has been securely logged.
                            </p>

                            {/* Session Details Card */}
                            <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-5 flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-elevated)] flex items-center justify-center shrink-0">
                                    <Calendar size={22} className="text-[var(--color-accent)]" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
                                        Today&apos;s Session
                                    </p>
                                    <p className="font-bold text-[16px]">
                                        {eventToScan.timeStart}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <BottomNav />
        </div>
    );
}
