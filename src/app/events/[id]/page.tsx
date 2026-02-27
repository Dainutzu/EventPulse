"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Clock, MapPin, Button } from "@/components/ui";
import { MOCK_EVENTS, formatDate } from "@/lib/mockData";
import { playSound } from "@/lib/sounds";
import { useState } from "react";

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    // Find event or 404 (mock)
    const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];

    const handleRegister = () => {
        if (isRegistered || isRegistering) return;
        setIsRegistering(true);
        // Simulate API call delay
        setTimeout(() => {
            setIsRegistering(false);
            setIsRegistered(true);
            playSound("success");
        }, 800);
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
                <span className="font-bold text-[15px]">Event Details</span>
                <div className="w-10" /> {/* Spacer */}
            </header>

            {/* Hero Banner (Mocked with gradient if no image) */}
            <div className="h-[280px] w-full relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center overflow-hidden">
                {/* Abstract glowing lines background effect */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-[20%] left-[-10%] w-[120%] h-[2px] bg-cyan-400 rotate-12 blur-[1px]" />
                    <div className="absolute top-[40%] left-[-10%] w-[120%] h-[2px] bg-blue-500 rotate-12 blur-[1px]" />
                    <div className="absolute top-[60%] left-[-10%] w-[120%] h-[2px] bg-purple-500 rotate-12 blur-[1px]" />
                </div>

                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 z-10 tracking-widest text-center px-6 mix-blend-plus-lighter">
                    {event.title.split(":")[0].toUpperCase()}
                </h2>
            </div>

            <div className="px-6 pt-6 animate-in slide-in-from-bottom-8 duration-500">
                <h1 className="text-2xl font-black leading-tight mb-5">
                    {event.title}
                </h1>

                {/* Organizer */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center text-lg shadow-inner border border-[var(--color-border)]">
                        🏛️
                    </div>
                    <div>
                        <p className="text-[15px] font-bold">{event.club}</p>
                        <p className="text-[12px] text-[var(--color-text-muted)] font-medium">Organizer</p>
                    </div>
                </div>

                {/* Info Rows */}
                <div className="flex flex-col gap-3 mb-8">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-[15px]">{formatDate(event.date)}</p>
                            <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">Save the date</p>
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-[15px]">{event.timeStart} - {event.timeEnd}</p>
                            <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">Local Timezone</p>
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-[15px]">{event.venue.split(",")[0]}</p>
                            {event.venue.includes(",") && (
                                <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">{event.venue.split(",")[1].trim()}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* About */}
                <div>
                    <h3 className="text-lg font-extrabold mb-3">About Event</h3>
                    <div className="text-[15px] text-[var(--color-text-muted)] leading-relaxed space-y-4">
                        {event.description.split("\n\n").map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 pb-8 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/95 to-transparent z-50">
                <Button
                    fullWidth
                    size="lg"
                    onClick={handleRegister}
                    disabled={isRegistering || isRegistered}
                    className={isRegistered ? "bg-emerald-600 hover:bg-emerald-600" : ""}
                >
                    {isRegistering ? "Registering..." : isRegistered ? "Registered ✓" : "Register Now"}
                </Button>
            </div>
        </div>
    );
}
