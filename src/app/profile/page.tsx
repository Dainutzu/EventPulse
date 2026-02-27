"use client";

import { useState } from "react";
import { BottomNav, Button, Badge } from "@/components/ui";
import { Settings, LogOut, Trash2, Download, AlertCircle, CheckCircle, Award, Calendar, Volume2, VolumeX, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isSoundEnabled, toggleSoundSettings } from "@/lib/sounds";
import { MOCK_USER } from "@/lib/mockUser";
import { useEventState } from "@/state/useEventState";
import { formatDateBlock } from "@/utils/dateUtils";

export default function Profile() {
    const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
    const { registeredEvents, unregisterEvent } = useEventState();
    const [activeTab, setActiveTab] = useState("registered");

    // Impact Stats calculation
    const impactStats = {
        attended: 12, // Mocked base + registered
        points: MOCK_USER.points + (registeredEvents.length * 50),
        registrations: registeredEvents.length
    };

    return (
        <div className="pb-32 min-h-screen bg-[#0A0F1E] text-white selection:bg-purple-500/30">
            {/* Header Area */}
            <header className="px-6 pt-14 pb-8 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-26 h-26 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_10px_40px_rgba(37,99,235,0.4)] flex items-center justify-center text-4xl font-black mb-5 border-4 border-[var(--color-bg)] text-white relative z-10"
                >
                    {MOCK_USER.avatar}
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black leading-tight tracking-tight mt-1 z-10"
                >
                    {MOCK_USER.name}
                </motion.h1>
                <p className="text-[14px] text-[var(--color-text-muted)] font-medium mb-4 mt-1 z-10 opacity-80">
                    {MOCK_USER.email}
                </p>

                <Badge variant="default" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-black px-4 py-1.5 z-10">
                    {MOCK_USER.role.toUpperCase()} ACCOUNT
                </Badge>
            </header>

            {/* Stats Section */}
            <div className="px-6 mb-10">
                <h2 className="text-[16px] font-black mb-5 flex items-center gap-2.5">
                    <Award size={18} className="text-indigo-400" /> Your Impact
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Events Joined" value={impactStats.registrations} color="blue" />
                    <StatCard label="Total Points" value={impactStats.points} color="purple" />
                </div>
            </div>

            {/* My Activity Section */}
            <div className="px-6 mb-12">
                <h2 className="text-[16px] font-black mb-5 flex items-center gap-2.5">
                    <Calendar size={18} className="text-blue-400" /> My Activity
                </h2>

                <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-1.5 mb-6 shadow-inner">
                    <button
                        onClick={() => setActiveTab("registered")}
                        className={`flex-1 py-2.5 text-[12px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${activeTab === "registered"
                            ? "bg-[var(--color-surface-elevated)] text-white shadow-lg scale-[1.02]"
                            : "text-[var(--color-text-muted)] hover:text-white"
                            }`}
                    >
                        Registered ({registeredEvents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("bookmarks")}
                        className={`flex-1 py-2.5 text-[12px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${activeTab === "bookmarks"
                            ? "bg-[var(--color-surface-elevated)] text-white shadow-lg scale-[1.02]"
                            : "text-[var(--color-text-muted)] hover:text-white"
                            }`}
                    >
                        Saved
                    </button>
                </div>

                <div className="flex flex-col gap-4 min-h-[160px]">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {registeredEvents.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 text-center text-[var(--color-text-muted)] bg-[var(--color-surface)]/30 border border-dashed border-[var(--color-border)] rounded-3xl"
                            >
                                <p className="font-bold text-sm px-10 leading-relaxed">You haven't registered for any events yet. Explore and join the community!</p>
                            </motion.div>
                        ) : (
                            registeredEvents.map((event) => (
                                <RegisteredEventCard
                                    key={event.id}
                                    event={event}
                                    onCancel={() => unregisterEvent(event.id)}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Official Portfolio Area */}
            <div className="px-6 mb-12">
                <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/20 border border-indigo-500/20 rounded-[28px] p-7 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />

                    <h3 className="font-black text-[18px] mb-2 flex items-center gap-2.5">
                        <CheckCircle size={20} className="text-indigo-400" />
                        Verified Record
                    </h3>
                    <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed mb-6 pr-6 font-medium">
                        Access your official campus participation portfolio. This certified digital record validates your achievements.
                    </p>
                    <Button fullWidth className="py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_8px_25px_rgba(79,70,229,0.3)]">
                        <Download size={20} className="mr-2 opacity-90" /> Download Certified PDF
                    </Button>
                </div>
            </div>

            {/* Settings Area */}
            <div className="px-6 mb-12">
                <h2 className="text-[16px] font-black mb-5">Account Settings</h2>
                <div className="bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-border)] rounded-[24px] overflow-hidden divide-y divide-[var(--color-border)] shadow-xl">
                    <SettingsItem icon={<Settings size={18} />} label="Security & Privacy" />

                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center border border-white/5">
                                {soundEnabled ? <Volume2 size={18} className="text-blue-400" /> : <VolumeX size={18} className="text-gray-400" />}
                            </div>
                            <span className="font-bold text-[15px]">In-App Sounds</span>
                        </div>
                        <button
                            onClick={() => {
                                const newState = !soundEnabled;
                                setSoundEnabled(newState);
                                toggleSoundSettings(newState);
                            }}
                            className={`w-14 h-7.5 rounded-full transition-all duration-300 flex items-center px-1.5 shadow-inner ${soundEnabled ? 'bg-blue-600' : 'bg-gray-700'}`}
                        >
                            <motion.div
                                className="w-5 h-5 bg-white rounded-full shadow-lg"
                                animate={{ x: soundEnabled ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>

                    <button className="w-full flex items-center justify-between p-5 hover:bg-red-500/5 transition-colors text-left group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <LogOut size={18} className="text-red-400" />
                            </div>
                            <span className="font-bold text-[15px] text-red-100 group-hover:text-red-400 transition-colors">Logout Session</span>
                        </div>
                    </button>
                </div>
            </div>

            <BottomNav />
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

function RegisteredEventCard({ event, onCancel }: { event: any, onCancel: () => void }) {
    const dateStr = formatDateBlock(event.date);
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[var(--color-surface)]/80 backdrop-blur-sm p-4.5 rounded-[22px] border border-[var(--color-border)] shadow-md group border-l-4"
            style={{ borderLeftColor: event.categoryColor }}
        >
            <div className="flex gap-4">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/5 shrink-0">
                    <span className="text-[10px] font-black text-blue-400 uppercase leading-none">{dateStr.month}</span>
                    <span className="text-[20px] font-black mt-0.5 leading-none">{dateStr.day}</span>
                </div>
                <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="success" className="text-[8px] py-0 px-2 font-black leading-tight border-emerald-500/30">Confirmed</Badge>
                    </div>
                    <h4 className="font-black text-[15px] leading-snug mb-2 group-hover:text-blue-400 transition-colors">{event.title}</h4>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--color-text-muted)]">
                        <div className="flex items-center gap-1">
                            <Clock size={12} className="opacity-50" />
                            <span>{event.timeStart}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-blue-400/80">{event.venue}</span>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center self-center hover:bg-red-500/20 transition-all border border-red-500/20 active:scale-90"
                >
                    <Trash2 size={16} className="text-red-400" />
                </button>
            </div>
        </motion.div>
    );
}

function SettingsItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center border border-white/5 group-hover:bg-gray-700 transition-colors">
                    <div className="text-gray-300 group-hover:text-blue-400 transition-colors">
                        {icon}
                    </div>
                </div>
                <span className="font-bold text-[15px] group-hover:text-blue-400 transition-colors">{label}</span>
            </div>
        </button>
    );
}
