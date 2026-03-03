"use client";

import { useMemo } from "react";
import { useEventStore } from "@/state/useEventStore";
import { TrendingUp, Users, Calendar, BarChart3 } from "lucide-react";
import { Badge } from "./ui";

export function AnalyticsPanel() {
    const { events } = useEventStore();

    const stats = useMemo(() => {
        const totalThisMonth = events.length; // Simplified for mock
        const registeredTotal = events.reduce((acc, ev) => acc + (ev.registered || 0), 0);
        const engagementScore = 84; // Mock score

        return {
            totalThisMonth,
            registeredTotal,
            engagementScore,
            upcoming: 3
        };
    }, [events]);

    return (
        <div className="space-y-8 sticky top-8">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-black tracking-tight">Overview</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Real-time engagement metrics</p>
            </div>

            <div className="grid gap-4">
                <AnalyticsCard
                    icon={<Calendar className="text-blue-500" size={20} />}
                    label="Events This Month"
                    value={stats.totalThisMonth}
                    trend="+2 new this week"
                />
                <AnalyticsCard
                    icon={<Users className="text-emerald-500" size={20} />}
                    label="Total Registrations"
                    value={stats.registeredTotal}
                    trend="12% from last month"
                />
                <AnalyticsCard
                    icon={<TrendingUp className="text-purple-500" size={20} />}
                    label="Engagement Score"
                    value={`${stats.engagementScore}%`}
                    trend="Top 10% on campus"
                />
            </div>

            <div className="pt-6 border-t border-[var(--color-border)]">
                <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-4">Upcoming Deadline</h4>
                <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-4 rounded-2xl">
                    <p className="text-sm font-bold mb-1">Hackathon 2024</p>
                    <div className="flex items-center gap-2">
                        <Badge variant="warning" className="text-[9px] px-1.5">Ends in 2h</Badge>
                        <span className="text-[11px] text-[var(--color-text-muted)]">Final check-in required</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnalyticsCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string | number; trend: string }) {
    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-3xl hover:border-white/10 transition-all group">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className="text-[13px] font-bold text-[var(--color-text-muted)]">{label}</span>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-black">{value}</span>
                <span className="text-[10px] font-bold text-blue-500/80 mb-1">{trend}</span>
            </div>
        </div>
    );
}
