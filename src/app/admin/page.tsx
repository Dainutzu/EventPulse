"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    LayoutGrid,
    BarChart3,
    Calendar
} from "lucide-react";
import { useEventStore } from "@/state/useEventStore";
import { MOCK_USER } from "@/lib/mockUser";
import { Button, Badge } from "@/components/ui";
import { BrandLogo } from "@/components/BrandLogo";
import { AnalyticsWidgets } from "@/components/admin/AnalyticsWidgets";
import { playSound } from "@/lib/sounds";
import Link from "next/link";

export default function AdminDashboard() {
    const router = useRouter();
    const { events, deleteEvent, registrations } = useEventStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"events" | "analytics">("analytics");

    // Filter events for the admin's club (for demo, just all events if admin)
    const isAdmin = MOCK_USER.role === "admin" || MOCK_USER.role === "organizer";

    // Protection
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-black mb-4">Access Denied</h1>
                <p className="text-[var(--color-text-muted)] mb-8">This portal is reserved for event organizers and campus administrators.</p>
                <Button onClick={() => router.push("/home")}>Return Home</Button>
            </div>
        );
    }

    const filteredEvents = useMemo(() => {
        return events.filter(e =>
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.organizer && e.organizer.toLowerCase().includes(searchQuery.toLowerCase())) ||
            e.faculty.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [events, searchQuery]);

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteEvent(id);
            playSound("notification");
        }
    };

    return (
        <div className="pb-32 min-h-screen">
            {/* Admin Header */}
            <header className="px-6 pt-14 pb-6 sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-xl z-30 border-b border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                        <BrandLogo size={32} />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50 mt-1">Admin Portal</span>
                    </div>
                    <div className="w-10" />
                </div>

                <div className="flex items-center gap-2 bg-[var(--color-surface)] p-1.5 rounded-2xl border border-[var(--color-border)] shadow-inner">
                    <button
                        onClick={() => setViewMode("analytics")}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${viewMode === "analytics" ? "bg-[var(--color-accent)] text-white shadow-lg" : "text-[var(--color-text-muted)]"}`}
                    >
                        <BarChart3 size={14} /> Insights
                    </button>
                    <button
                        onClick={() => setViewMode("events")}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${viewMode === "events" ? "bg-[var(--color-accent)] text-white shadow-lg" : "text-[var(--color-text-muted)]"}`}
                    >
                        <Calendar size={14} /> My Events
                    </button>
                </div>
            </header>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {viewMode === "analytics" ? (
                        <motion.div
                            key="anal"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col gap-1">
                                <h2 className="text-xl font-black">Campus Health</h2>
                                <p className="text-[13px] text-[var(--color-text-muted)] font-medium">Real-time engagement metrics across all categories.</p>
                            </div>

                            <AnalyticsWidgets events={events} registrations={registrations} />

                            {/* Section for Top Categories */}
                            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
                                <h3 className="text-[13px] font-black uppercase tracking-widest mb-4 opacity-50">High Interest Areas</h3>
                                <div className="space-y-4">
                                    {[
                                        { cat: "Tech", val: 88, color: "blue" },
                                        { cat: "Career", val: 65, color: "purple" },
                                        { cat: "Sports", val: 42, color: "emerald" },
                                    ].map((item) => (
                                        <div key={item.cat} className="space-y-2">
                                            <div className="flex justify-between text-[12px] font-black">
                                                <span>{item.cat}</span>
                                                <span className="opacity-50">{item.val}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-${item.color}-500`}
                                                    style={{ width: `${item.val}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="events"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search your events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 transition-all shadow-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                {filteredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-[var(--color-accent)]/30 transition-all"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-12 h-12 rounded-xl bg-[var(--color-bg)] flex flex-col items-center justify-center shrink-0 border border-[var(--color-border)]">
                                                <span className="text-[10px] font-black text-blue-500 uppercase leading-none">MAR</span>
                                                <span className="text-lg font-black leading-none mt-0.5">14</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-black text-[15px] truncate">{event.title}</h4>
                                                <p className="text-[11px] text-[var(--color-text-muted)] font-black uppercase tracking-wider">
                                                    {event.registered} Responded
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => router.push(`/events/${event.id}`)}
                                                className="w-9 h-9 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-blue-500 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="w-9 h-9 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-amber-500 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id, event.title)}
                                                className="w-9 h-9 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Create FAB */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-28 right-6 w-14 h-14 bg-[var(--color-accent)] text-white rounded-2xl flex items-center justify-center shadow-2xl z-40 border border-white/10"
            >
                <Plus size={28} />
            </motion.button>
        </div>
    );
}
