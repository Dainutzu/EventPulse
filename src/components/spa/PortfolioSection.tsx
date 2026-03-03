"use client";

import { useMemo } from "react";
import { Download, Share2, Award, Calendar, ChevronLeft, MapPin, Clock } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useEventStore } from "@/state/useEventStore";
import { formatDateBlock } from "@/utils/dateUtils";

export default function PortfolioSection() {
    const { events, registrations, getAttendanceStatus } = useEventStore();

    const registeredEvents = useMemo(() =>
        events.filter(e => !!registrations[e.id]),
        [events, registrations]);

    return (
        <div className="pb-32 min-h-screen selection:bg-blue-500/30 px-4">
            <header className="pt-12 pb-8 flex items-center justify-between">
                <div className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center transition-colors opacity-0 pointer-events-none">
                    <ChevronLeft size={24} className="text-white" />
                </div>
                <h1 className="text-xl font-extrabold tracking-tight">Portfolio</h1>
                <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors active:bg-[var(--color-surface)] group">
                    <Share2 size={22} className="text-[var(--color-text-muted)] group-hover:text-blue-500" />
                </button>
            </header>

            <div className="flex flex-col gap-4 pb-12">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl py-6 flex items-center justify-between px-8 shadow-sm">
                    <span className="text-[14px] font-black tracking-widest text-[var(--color-text-muted)] uppercase text-left">Attended Events</span>
                    <span className="text-4xl font-black text-blue-500">24</span>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-6 flex items-center justify-between px-8 shadow-sm">
                    <span className="text-[14px] font-black tracking-widest text-[var(--color-text-muted)] uppercase text-left">Organized</span>
                    <span className="text-4xl font-black">05</span>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-6 flex items-center justify-between px-8 shadow-sm">
                    <span className="text-[14px] font-black tracking-widest text-[var(--color-text-muted)] uppercase text-left">Impact Points</span>
                    <span className="text-4xl font-black text-indigo-500">1.2k</span>
                </div>
            </div>

            <div className="relative">
                <div className="flex items-center justify-between mb-8 px-0">
                    <h2 className="text-[18px] font-black tracking-tight">Activity Timeline</h2>
                    <div className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider border border-blue-500/20 uppercase">
                        Verified
                    </div>
                </div>

                <div className="absolute left-[27px] top-14 bottom-10 w-[2px] bg-gradient-to-b from-blue-500/50 via-[var(--color-border)] to-transparent" />

                <div className="flex flex-col gap-8">
                    {registeredEvents.map((event, index) => (
                        <TimelineItem
                            key={event.id}
                            event={event}
                            status={getAttendanceStatus(event.id)}
                            index={index}
                        />
                    ))}

                    {registeredEvents.length === 0 && (
                        <div className="pl-16 py-10 opacity-40">
                            <p className="font-black uppercase tracking-widest text-xs">No activity yet</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-20 px-0">
                <div className="p-8 bg-gradient-to-br from-indigo-900/40 to-blue-900/30 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white mb-4">Export Campus Passport</h3>
                        <p className="text-[14px] text-white/70 font-medium leading-relaxed mb-8">
                            Generate a certified PDF summary of your university engagements, skills acquired, and impact points. Perfect for internships.
                        </p>
                        <div className="flex flex-col gap-4">
                            <button className="py-5 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 active:scale-95 shadow-xl transition-all">
                                <Download size={22} />
                                Download PDF Portrait
                            </button>
                            <button className="py-5 bg-white/5 text-white/80 font-black rounded-2xl flex items-center justify-center gap-3 active:scale-95 border border-white/10 hover:bg-white/10 transition-all">
                                <Share2 size={22} />
                                Share Public Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TimelineItemProps {
    event: any;
    status: string | null;
    index: number;
}

function TimelineItem({ event, status, index }: TimelineItemProps) {
    const isAttended = status === "attended";
    const dateStr = formatDateBlock(event.date);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-6 relative"
        >
            <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center z-10 border-4 border-[var(--color-bg)] shadow-md transition-all duration-500 ${isAttended ? 'bg-blue-600 border-blue-500/20' : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] grayscale-[0.8]'
                }`}>
                <Award size={24} className={isAttended ? "text-white" : "text-[var(--color-text-dim)]"} />
            </div>

            <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[13px] font-black text-blue-400/80 uppercase tracking-widest">
                        {dateStr.month} {dateStr.day}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                    <span className="text-[12px] font-bold text-[var(--color-text-muted)]">
                        {isAttended ? 'Verified Attendance' : 'Registered'}
                    </span>
                </div>
                <h4 className={`text-lg font-black leading-tight mb-2 ${isAttended ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] line-through opacity-50'}`}>
                    {event.title}
                </h4>
                <div className="flex items-center gap-3 text-[12px] font-bold text-[var(--color-text-dim)]">
                    <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span className="truncate">{event.venue}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
