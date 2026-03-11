"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, CheckCircle, Calendar } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/lib/sounds";
import { useEventStore } from "@/state/useEventStore";

export default function ScannerSection({ onBack }: { onBack: () => void }) {
    const { events, updateAttendance } = useEventStore();
    const [scanState, setScanState] = useState<"scanning" | "success">("scanning");

    // For demo, we'll scan the first upcoming tech event
    const eventToScan = events.find(e => e.faculty === "Faculty of Computing") || events[0];

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
        <div className="min-h-screen pb-28 relative flex flex-col px-4">
            <header className="pt-12 pb-6 flex items-center justify-between">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center transition-colors active:bg-neutral-100 dark:active:bg-neutral-800 group"
                >
                    <ChevronLeft size={24} className="text-neutral-900 dark:text-white" />
                </button>
                <span className="font-bold text-lg text-neutral-900 dark:text-white">Check-in</span>
                <div className="w-10" />
            </header>

            <div className="flex-1 flex flex-col pt-4">
                <AnimatePresence mode="wait">
                    {scanState === "scanning" ? (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex-1 flex flex-col items-center"
                        >
                            <p className="mt-8 text-center text-neutral-500 dark:text-neutral-400 text-sm max-w-[280px] font-medium leading-relaxed">
                                Position the QR code within the frame to record your attendance.
                            </p>

                            <div className="mt-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative shadow-xl overflow-hidden w-full max-w-[320px]">
                                <div className="aspect-square bg-neutral-950 rounded-2xl relative overflow-hidden flex items-center justify-center">
                                    <motion.div
                                        className="absolute left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 rounded-full"
                                        animate={{ top: ["10%", "90%", "10%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                    <div className="absolute inset-6">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 rounded-tl-xl" />
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500 rounded-tr-xl" />
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500 rounded-bl-xl" />
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 rounded-br-xl" />
                                    </div>
                                    <span className="text-white font-bold text-xl tracking-widest opacity-20 select-none">SCANNING</span>
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
                            <motion.div
                                className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg mb-8"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <CheckCircle size={36} />
                            </motion.div>

                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white text-center px-4 mb-2">
                                Success!
                            </h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center font-medium mb-10">
                                Attendance recorded for <span className="text-neutral-900 dark:text-white font-bold">{eventToScan.title}</span>
                            </p>

                            <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-100 dark:border-neutral-800">
                                    <Calendar size={22} className="text-neutral-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">
                                        Session Time
                                    </p>
                                    <p className="font-bold text-sm text-neutral-900 dark:text-white">
                                        {eventToScan.timeStart}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onBack}
                                className="mt-12 w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-bold text-sm active:scale-95 transition-all shadow-lg"
                            >
                                Return Home
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
