"use client";

import { motion } from "framer-motion";
import { Users, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    sub: string;
    icon: React.ReactNode;
    trend?: string;
}

function AnalyticsCard({ title, value, sub, icon, trend }: AnalyticsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-elevated)] flex items-center justify-center border border-[var(--color-border)]">
                    {icon}
                </div>
                {trend && (
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-[var(--color-text-muted)] text-[12px] font-black uppercase tracking-widest mb-1.5">{title}</h3>
            <p className="text-2xl font-black mb-1">{value}</p>
            <p className="text-[11px] text-[var(--color-text-muted)] font-bold">{sub}</p>
        </motion.div>
    );
}

export function AnalyticsWidgets({ events, registrations }: { events: any[], registrations: any }) {
    // Simulated analytics logic
    const totalRegs = Object.keys(registrations).length; // In a real app this would be for ALL users
    const attendedCount = Object.values(registrations).filter((r: any) => r.status === "attended").length;
    const checkInRate = totalRegs > 0 ? Math.round((attendedCount / totalRegs) * 100) : 0;

    return (
        <div className="flex flex-col gap-4">
            <AnalyticsCard
                title="Participation"
                value="2,480"
                sub="Active Monthly"
                icon={<Users size={18} className="text-blue-400" />}
                trend="+12%"
            />
            <AnalyticsCard
                title="Check-in Rate"
                value={`${checkInRate}%`}
                sub="Event Average"
                icon={<CheckCircle2 size={18} className="text-emerald-400" />}
                trend="+5%"
            />
            <AnalyticsCard
                title="Engagement"
                value="8.4"
                sub="Avg. Score"
                icon={<TrendingUp size={18} className="text-purple-400" />}
                trend="+0.6"
            />
            <AnalyticsCard
                title="Growth"
                value="4,200"
                sub="Registered Users"
                icon={<BarChart3 size={18} className="text-amber-400" />}
                trend="+340"
            />
        </div>
    );
}
