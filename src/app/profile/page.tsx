"use client";

import { useState, useEffect } from "react";
import { BottomNav, Button } from "@/components/ui";
import { Settings, LogOut, Trash2, Download, AlertCircle, CheckCircle, Award, Calendar, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { isSoundEnabled, toggleSoundSettings } from "@/lib/sounds";

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("registered");
    const [isLoading, setIsLoading] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        setSoundEnabled(isSoundEnabled());
        let isMounted = true;

        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                const [profileRes, statsRes] = await Promise.all([
                    fetch("/api/user/profile"),
                    fetch("/api/user/stats"),
                ]);

                const profileData = await profileRes.json();
                const statsData = await statsRes.json();

                if (isMounted) {
                    setProfile(profileData.profile);
                    setStats(statsData.stats);
                }
            } catch (err) {
                console.error("Error fetching profile data", err);
            }
        };

        fetchProfileData();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchEvents = async () => {
            try {
                const res = await fetch(`/api/user/events?type=${activeTab}`);
                const data = await res.json();
                if (isMounted) setEvents(data.events || []);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching events", err);
            }
        };

        fetchEvents();
        return () => { isMounted = false; }
    }, [activeTab]);

    return (
        <div className="pb-32 min-h-screen bg-[#0A0F1E] text-white">
            {/* Header Area */}
            <header className="px-6 pt-14 pb-8 flex flex-col items-center">
                {isLoading && !profile ? (
                    <div className="w-24 h-24 rounded-full bg-[var(--color-surface-elevated)] animate-pulse shadow-lg mb-4" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-500 shadow-2xl flex items-center justify-center text-3xl font-black mb-4 border-4 border-[var(--color-bg)] text-white">
                        {profile?.avatar || profile?.initials}
                    </div>
                )}

                <h1 className="text-2xl font-black leading-tight tracking-tight mt-1">
                    {isLoading ? "Loading..." : profile?.name}
                </h1>
                <p className="text-[14px] text-[var(--color-text-muted)] font-medium mb-3 mt-1">
                    {isLoading ? "student@university.edu" : profile?.email}
                </p>

                <div className="bg-blue-500/15 text-blue-400 font-bold tracking-wider text-[10px] px-3 py-1.5 uppercase rounded-lg border border-blue-500/20">
                    {isLoading ? "ROLE" : profile?.role} Account
                </div>
            </header>

            {/* Stats Section */}
            <div className="px-6 mb-8">
                <h2 className="text-[16px] font-extrabold mb-4 flex items-center gap-2">
                    <Award size={18} className="text-[var(--color-accent)]" /> Your Impact
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-[40px] transition-colors group-hover:bg-blue-500/10" />
                        <span className="text-3xl font-black mb-1">{isLoading ? "--" : stats?.attended}</span>
                        <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-center">Events Attended</span>
                    </div>
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-[40px] transition-colors group-hover:bg-purple-500/10" />
                        <span className="text-3xl font-black mb-1">{isLoading ? "--" : stats?.points}</span>
                        <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-center">Total Points</span>
                    </div>
                    {profile?.role === "organizer" && (
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-4 flex flex-col items-center justify-center relative overflow-hidden group col-span-2">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[60px] transition-colors group-hover:bg-emerald-500/10" />
                            <span className="text-3xl font-black mb-1 text-emerald-400">{isLoading ? "--" : stats?.organized}</span>
                            <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-center">Events Organized</span>
                        </div>
                    )}
                </div>
            </div>

            {/* My Activity Section */}
            <div className="px-6 mb-10">
                <h2 className="text-[16px] font-extrabold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-[var(--color-accent)]" /> My Activity
                </h2>

                {/* Tab Controls */}
                <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 mb-4">
                    {["registered", "attended", "organized"].map((tab) => (
                        (tab !== "organized" || profile?.role === "organizer") && (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 text-[12px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab
                                    ? "bg-[var(--color-surface-elevated)] text-white shadow"
                                    : "text-[var(--color-text-muted)] hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        )
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex flex-col gap-3 min-h-[120px]">
                    {events.length === 0 && !isLoading ? (
                        <div className="py-8 text-center text-[var(--color-text-muted)] text-[13px] border border-dashed border-[var(--color-border)] rounded-xl">
                            No {activeTab} events found.
                        </div>
                    ) : (
                        events.map((event, i) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[var(--color-surface)] p-4 rounded-[16px] border border-[var(--color-border)] flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="font-bold text-[14px] leading-tight mb-1">{event.title}</h4>
                                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-surface-elevated)] text-lg border border-[var(--color-border)]`}>
                                    {activeTab === "attended" ? "✅" : activeTab === "registered" ? "🕒" : "🛠️"}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Participation Summary PDF */}
            <div className="px-6 mb-10">
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-[24px] p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />

                    <h3 className="font-extrabold text-[16px] mb-2 flex items-center gap-2">
                        <CheckCircle size={18} className="text-blue-400" />
                        Official Record
                    </h3>
                    <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed mb-5 pr-8">
                        Access your verified participation portfolio. Use this certified PDF for your academic records or resume.
                    </p>
                    <Button fullWidth className="py-3.5 bg-blue-600 hover:bg-blue-500 border border-blue-400/30">
                        <Download size={18} className="mr-1.5 text-white/90" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Settings Section */}
            <div className="px-6 mb-10">
                <h2 className="text-[16px] font-extrabold mb-4">Settings</h2>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] overflow-hidden divide-y divide-[var(--color-border)]">
                    <button className="w-full flex items-center justify-between p-4.5 hover:bg-[var(--color-surface-elevated)] transition-colors text-left group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                                <Settings size={16} className="text-gray-300" />
                            </div>
                            <span className="font-semibold text-[14px]">Change Password</span>
                        </div>
                    </button>

                    <div className="w-full flex items-center justify-between p-4.5 bg-[var(--color-surface)]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                                {soundEnabled ? <Volume2 size={16} className="text-gray-300" /> : <VolumeX size={16} className="text-gray-300" />}
                            </div>
                            <span className="font-semibold text-[14px]">Sound Effects</span>
                        </div>
                        <button
                            onClick={() => {
                                const newState = !soundEnabled;
                                setSoundEnabled(newState);
                                toggleSoundSettings(newState);
                            }}
                            className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${soundEnabled ? 'bg-[var(--color-accent)]' : 'bg-gray-600'}`}
                        >
                            <motion.div
                                className="w-4 h-4 bg-white rounded-full shadow-sm"
                                animate={{ x: soundEnabled ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>

                    <button className="w-full flex items-center justify-between p-4.5 hover:bg-[var(--color-surface-elevated)] transition-colors text-left group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                                <LogOut size={16} className="text-gray-300" />
                            </div>
                            <span className="font-semibold text-[14px]">Sign Out</span>
                        </div>
                    </button>
                </div>

                <button className="mt-6 flex items-center gap-2 text-red-400 font-bold text-[13px] hover:text-red-300 px-2 py-1 transition-colors">
                    <AlertCircle size={14} /> Delete Account
                </button>
            </div>

            <BottomNav />
        </div>
    );
}
