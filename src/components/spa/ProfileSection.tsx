"use client";

import { useMemo, useState } from "react";
import {
    LogOut,
    Trash2,
    Calendar,
    Volume2,
    VolumeX,
    Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import { isSoundEnabled, toggleSoundSettings, playSound } from "@/lib/sounds";
import { useEventStore } from "@/state/useEventStore";
import { formatDateBlock } from "@/utils/dateUtils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MOCK_USER } from "@/lib/mockUser";
import { Event } from "@/types";

// - [x] Simplify ProfileSection.tsx
//     - [x] Remove engagement scores and impact points
//     - [x] Remove Digital Profile export
//     - [x] Simplify header (Name + Avatar only)
//     - [x] Simplify registered events cards
// - [/] Final UI verification and cleanup
export default function ProfileSection() {
    const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
    const { events, registrations, unregisterEvent, getAttendanceStatus, setSelectedEventId } = useEventStore();
    
    const registeredEvents = useMemo(() =>
        events.filter(e => !!registrations[e.id]),
        [events, registrations]);

    return (
        <div className="pb-32 min-h-screen selection:bg-blue-500/30 px-4">
            <header className="pt-14 pb-8 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-4xl mb-4 border border-neutral-200 dark:border-neutral-800">
                    {MOCK_USER.avatar}
                </div>
                
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                    {MOCK_USER.name}
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    {MOCK_USER.email}
                </p>
            </header>

            <div className="mb-10">
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={16} /> Registered Events
                </h2>

                <div className="flex flex-col gap-3">
                    {registeredEvents.length > 0 ? (
                        registeredEvents.map((event) => (
                            <RegisteredEventCard
                                key={event.id}
                                event={event}
                                onCancel={() => {
                                    unregisterEvent(event.id);
                                    playSound("notification");
                                }}
                                onSelect={() => setSelectedEventId(event.id)}
                            />
                        ))
                    ) : (
                        <div className="py-12 text-center bg-neutral-50 dark:bg-neutral-900/50 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 font-medium">No registered events</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">
                    Preferences
                </h2>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <Sun size={18} className="text-neutral-500" />
                            <span className="font-semibold text-sm">Theme</span>
                        </div>
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            {soundEnabled ? <Volume2 size={18} className="text-neutral-500" /> : <VolumeX size={18} className="text-neutral-500" />}
                            <span className="font-semibold text-sm">Sounds</span>
                        </div>
                        <button
                            onClick={() => {
                                const newState = !soundEnabled;
                                setSoundEnabled(newState);
                                toggleSoundSettings(newState);
                                if (newState) playSound("notification");
                            }}
                            className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${soundEnabled ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-800'}`}
                        >
                            <motion.div
                                className={`w-4 h-4 rounded-full ${soundEnabled ? 'bg-white dark:bg-neutral-900' : 'bg-white'}`}
                                animate={{ x: soundEnabled ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>

                    <button className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <LogOut size={18} />
                            <span className="font-semibold text-sm">Logout</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

interface RegisteredEventCardProps {
    event: Event;
    onCancel: () => void;
    onSelect: () => void;
}

function RegisteredEventCard({ event, onCancel, onSelect }: RegisteredEventCardProps) {
    const dateStr = formatDateBlock(event.date);

    return (
        <div
            className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 cursor-pointer active:scale-[0.98] transition-all"
            onClick={onSelect}
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex flex-col items-center justify-center border border-neutral-100 dark:border-neutral-800 shrink-0">
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase">{dateStr.month}</span>
                    <span className="text-lg font-bold text-neutral-900 dark:text-white leading-none">{dateStr.day}</span>
                </div>
                <div className="min-w-0">
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate">{event.title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 font-medium truncate">{event.faculty}</p>
                </div>
            </div>
            
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCancel();
                }}
                className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 group transition-colors"
            >
                <Trash2 size={16} className="text-neutral-400 group-hover:text-red-500 transition-colors" />
            </button>
        </div>
    );
}
