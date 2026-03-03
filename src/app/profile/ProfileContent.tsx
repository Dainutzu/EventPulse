"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav, Button, Badge } from "@/components/ui";
import {
    LogOut,
    Trash2,
    Download,
    CheckCircle,
    Award,
    Calendar,
    Volume2,
    VolumeX,
    Clock,
    Sun,
    LayoutGrid,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isSoundEnabled, toggleSoundSettings, playSound } from "@/lib/sounds";
import { useEventStore } from "@/state/useEventStore";
import { formatDateBlock } from "@/utils/dateUtils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandingFooter } from "@/components/BrandingFooter";
import { MOCK_USER, CATEGORIES } from "@/lib/mockUser";
import { Event } from "@/types";
import Link from "next/link";

export default function ProfileContent() {
    const router = useRouter();
    const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
    const { events, registrations, unregisterEvent, engagementScore, getAttendanceStatus, interests, setInterests } = useEventStore();
    const [activeTab, setActiveTab] = useState("registered");
    const [isEditingInterests, setIsEditingInterests] = useState(false);

    const registeredEvents = useMemo(() =>
        events.filter(e => !!registrations[e.id]),
        [events, registrations]);

    const impactStats = useMemo(() => {
        const attendedCount = Object.values(registrations).filter(r => r.status === "attended").length;
        return {
            attended: attendedCount,
            points: MOCK_USER.points + (Object.keys(registrations).length * 50) + (attendedCount * 100),
            registrations: Object.keys(registrations).length
        };
    }, [registrations]);

    return (
        <div className="pb-32 min-h-screen selection:bg-purple-500/30 px-4">
            {/* Header Area */}
            <header className="px-0 pt-14 pb-8 flex flex-col items-center relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

                <div className="mb-6 z-10 flex flex-col items-center">
                    <BrandLogo size={44} className="mb-2" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-30">University Ecosystem</span>
                </div>

                <div className="flex flex-col items-center gap-10 mb-8 z-10">
                    <div className="relative flex items-center justify-center scale-110">
                        <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="42"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                className="text-[var(--color-surface-elevated)]"
                            />
                            <motion.circle
                                cx="48"
                                cy="48"
                                r="42"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={264}
                                initial={{ strokeDashoffset: 264 }}
                                animate={{ strokeDashoffset: 264 - (264 * engagementScore) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-blue-500"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-xl font-black">{engagementScore}</span>
                            <span className="text-[8px] font-black uppercase tracking-tighter opacity-50">Score</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-24 h-24 rounded-[40px] bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-2xl flex items-center justify-center text-4xl font-black border-4 border-[var(--color-surface)] text-white relative mb-4"
                        >
                            {MOCK_USER.avatar}
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[var(--color-surface)] flex items-center justify-center">
                                <CheckCircle size={14} className="text-white" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black leading-tight tracking-tight mt-1 z-10"
                >
                    {MOCK_USER.name}
                </motion.h1>
                <p className="text-[14px] text-[var(--color-text-muted)] font-bold mb-4 mt-1 z-10">
                    {MOCK_USER.email}
                </p>

                <Badge variant="default" className="bg-blue-500/10 border-blue-500/20 text-blue-400 font-bold px-4 py-1.5 z-10">
                    {MOCK_USER.role.toUpperCase()} ACCOUNT
                </Badge>
            </header>

            <div className="flex flex-col mb-12">
                <div>
                    <div className="mb-10">
                        <h2 className="text-[16px] font-black mb-5 flex items-center gap-2.5">
                            <Award size={18} className="text-indigo-400" /> Your Engagement
                        </h2>
                        <div className="flex flex-col gap-4">
                            <StatCard label="Events Joined" value={impactStats.registrations} color="blue" />
                            <StatCard label="Attended" value={impactStats.attended} color="purple" />
                        </div>
                    </div>

                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[16px] font-black flex items-center gap-2.5">
                                <Award size={18} className="text-emerald-400" /> Your Interests
                            </h2>
                            <button
                                onClick={() => setIsEditingInterests(!isEditingInterests)}
                                className="text-[11px] font-black uppercase tracking-widest text-[var(--color-accent)] bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 active:scale-95 transition-all outline-none"
                            >
                                {isEditingInterests ? "Save Profile" : "Edit Preferences"}
                            </button>
                        </div>

                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-wrap gap-2.5">
                                {isEditingInterests ? (
                                    CATEGORIES.map(cat => {
                                        const selected = interests.includes(cat);
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    if (selected) {
                                                        setInterests(interests.filter(i => i !== cat));
                                                    } else {
                                                        setInterests([...interests, cat]);
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${selected
                                                    ? "bg-blue-600 border-blue-500 text-white shadow-md"
                                                    : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)]"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })
                                ) : (
                                    interests.map(interest => (
                                        <Badge key={interest} variant="outline" className="px-4 py-1.5 rounded-xl border-blue-500/30 text-blue-400 bg-blue-500/5 normal-case font-bold">
                                            {interest}
                                        </Badge>
                                    ))
                                )}
                                {!isEditingInterests && interests.length === 0 && (
                                    <p className="text-[13px] text-[var(--color-text-muted)] font-medium">No interests selected yet. Add some to get better recommendations!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="mb-12">
                        <h2 className="text-[16px] font-black mb-5 flex items-center gap-2.5">
                            <Calendar size={18} className="text-blue-400" /> Event Activity
                        </h2>

                        <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-1.5 mb-6 shadow-inner">
                            <button
                                onClick={() => setActiveTab("registered")}
                                className={`flex-1 py-2.5 text-[12px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${activeTab === "registered"
                                    ? "bg-[var(--color-surface-elevated)] text-white shadow-lg scale-[1.02]"
                                    : "text-[var(--color-text-muted)] hover:text-white"
                                    }`}
                            >
                                Joined ({registeredEvents.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("attended")}
                                className={`flex-1 py-2.5 text-[12px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${activeTab === "attended"
                                    ? "bg-[var(--color-surface-elevated)] text-white shadow-lg scale-[1.02]"
                                    : "text-[var(--color-text-muted)] hover:text-white"
                                    }`}
                            >
                                History
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 min-h-[160px]">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {activeTab === "registered" ? (
                                    registeredEvents.length === 0 ? (
                                        <motion.div
                                            key="empty-reg"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="py-12 text-center text-[var(--color-text-muted)] bg-[var(--color-surface)]/30 border border-dashed border-[var(--color-border)] rounded-3xl"
                                        >
                                            <p className="font-bold text-sm px-10 leading-relaxed">No active registrations. Discover events to grow your engagement!</p>
                                        </motion.div>
                                    ) : (
                                        registeredEvents.map((event) => (
                                            <RegisteredEventCard
                                                key={event.id}
                                                event={event}
                                                status={getAttendanceStatus(event.id)}
                                                onCancel={() => {
                                                    unregisterEvent(event.id);
                                                    playSound("notification");
                                                }}
                                            />
                                        ))
                                    )
                                ) : (
                                    <motion.div
                                        key="history"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-12 text-center text-[var(--color-text-muted)] bg-[var(--color-surface)]/30 border border-dashed border-[var(--color-border)] rounded-3xl"
                                    >
                                        <p className="font-bold text-sm px-10 leading-relaxed font-black uppercase tracking-widest opacity-30">No Past Records</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-0 mb-12">
                <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/20 border border-indigo-500/20 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-60 h-60 bg-blue-500/10 blur-[100px] rounded-full" />

                    <div className="max-w-xl">
                        <h3 className="font-black text-[22px] mb-3 flex items-center gap-3">
                            <Award size={28} className="text-indigo-400" />
                            Campus Passport
                        </h3>
                        <p className="text-[14px] text-[var(--color-text-muted)] leading-relaxed mb-8 pr-6 font-medium">
                            Your engagement at university determines your career readiness. Track every verified attendance and skill badge here. Build an investor-grade digital identity.
                        </p>
                        <Button className="py-4 px-10 rounded-2xl bg-indigo-600 shadow-[0_15px_35px_rgba(79,70,229,0.4)] text-[15px] font-black">
                            <Download size={20} className="mr-3 opacity-90" /> Export Digital Profile
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mb-20 w-full">
                <h2 className="text-[18px] font-black mb-6 text-center">Interface & Preferences</h2>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden divide-y divide-[var(--color-border)] shadow-xl">
                    <div className="flex items-center justify-between p-6 px-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-elevated)] flex items-center justify-center border border-[var(--color-border)]">
                                <Sun size={20} className="text-[var(--color-accent)]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[16px]">Visual Theme</span>
                                <span className="text-[12px] text-[var(--color-text-muted)] font-medium">Switch between Light/Dark</span>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>

                    {(MOCK_USER.role === "admin" || MOCK_USER.role === "organizer") && (
                        <button onClick={() => router.push("/admin")} className="w-full flex items-center justify-between p-6 px-8 hover:bg-indigo-500/10 transition-colors text-left group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <LayoutGrid size={20} className="text-indigo-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[16px] group-hover:text-indigo-400 transition-colors">Admin Dashboard</span>
                                    <span className="text-[12px] text-[var(--color-text-muted)] font-medium">Manage events & campus analytics</span>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-[var(--color-text-muted)]" />
                        </button>
                    )}

                    <div className="flex items-center justify-between p-6 px-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-elevated)] flex items-center justify-center border border-[var(--color-border)]">
                                {soundEnabled ? <Volume2 size={20} className="text-emerald-400" /> : <VolumeX size={20} className="text-[var(--color-text-muted)]" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[16px]">Sound Effects</span>
                                <span className="text-[12px] text-[var(--color-text-muted)] font-medium">Auditory feedback on actions</span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                const newState = !soundEnabled;
                                setSoundEnabled(newState);
                                toggleSoundSettings(newState);
                                if (newState) playSound("notification");
                            }}
                            className={`w-14 h-8 rounded-full transition-all duration-300 flex items-center px-1.5 shadow-inner ${soundEnabled ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-gray-400 dark:bg-gray-700'}`}
                        >
                            <motion.div
                                className="w-5 h-5 bg-white rounded-full shadow-md"
                                animate={{ x: soundEnabled ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>

                    <button className="w-full flex items-center justify-between p-6 px-8 hover:bg-red-500/10 transition-colors text-left group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <LogOut size={20} className="text-red-400" />
                            </div>
                            <span className="font-bold text-[16px] group-hover:text-red-400 transition-colors">Logout Session</span>
                        </div>
                    </button>
                </div>
            </div>

            <BrandingFooter />
        </div>
    );
}

function StatCard({ label, value, color }: { label: string, value: number, color: 'blue' | 'purple' }) {
    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-5 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] transition-colors ${color === 'blue' ? 'bg-blue-500/5 group-hover:bg-blue-500/10' : 'bg-purple-500/5 group-hover:bg-purple-500/10'}`} />
            <span className={`text-3xl font-black mb-1.5 ${color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>{value}</span>
            <span className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest text-center opacity-80">{label}</span>
        </div>
    );
}

function RegisteredEventCard({ event, status, onCancel }: { event: Event, status: string, onCancel: () => void }) {
    const dateStr = formatDateBlock(event.date);
    const isAttended = status === "attended";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-[var(--color-surface)]/80 backdrop-blur-sm p-4.5 rounded-[22px] border border-[var(--color-border)] shadow-md group border-l-4 transition-all ${isAttended ? 'border-emerald-500/30' : ''}`}
            style={{ borderLeftColor: isAttended ? '#10b981' : event.categoryColor }}
        >
            <div className="flex gap-4">
                <Link href={`/events/${event.id}`} className="flex-1 flex gap-4 pr-2 overflow-hidden">
                    <div className="w-13 h-13 bg-[var(--color-bg)] rounded-xl flex flex-col items-center justify-center border border-[var(--color-border)] shrink-0 shadow-inner">
                        <span className="text-[10px] font-black text-blue-400 uppercase leading-none">{dateStr.month}</span>
                        <span className="text-[18px] font-black mt-0.5 leading-none">{dateStr.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            {isAttended ? (
                                <Badge variant="success" className="text-[8px] py-0 px-2 font-black leading-tight border-emerald-500/30">Verified & Attended</Badge>
                            ) : (
                                <Badge variant="default" className="text-[8px] py-0 px-2 font-black leading-tight border-blue-500/30">Spot Secured</Badge>
                            )}
                        </div>
                        <h4 className="font-black text-[15px] leading-snug mb-2 group-hover:text-blue-400 transition-colors truncate">{event.title}</h4>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--color-text-muted)]">
                            <div className="flex items-center gap-1">
                                <Clock size={12} className="opacity-50" />
                                <span>{event.timeStart}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-blue-400/80 truncate">{event.venue}</span>
                        </div>
                    </div>
                </Link>
                {!isAttended && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onCancel();
                        }}
                        className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center self-center hover:bg-red-500/20 transition-all border border-red-500/20 active:scale-90 shadow-sm"
                    >
                        <Trash2 size={16} className="text-red-400" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
