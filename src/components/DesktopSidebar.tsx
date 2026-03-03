"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Compass,
    Ticket,
    User,
    Settings,
    LogOut,
    LayoutDashboard,
    ShieldCheck
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "./ui";
import { MOCK_USER } from "@/lib/mockUser";

const NAV_ITEMS = [
    { href: "/home", icon: Home, label: "Dashboard" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/portfolio", icon: Ticket, label: "Registered" },
    { href: "/profile", icon: User, label: "Profile" },
];

export function DesktopSidebar() {
    const pathname = usePathname();
    const isAdmin = MOCK_USER.role === "admin";

    return (
        <aside className="w-64 h-screen sticky top-0 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] transition-all duration-300">
            {/* Logo Section */}
            <div className="p-8 flex items-center gap-3">
                <BrandLogo size={40} rounded="rounded-xl" />
                <span className="font-black text-xl tracking-tight">Event Pulse</span>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 mt-4 space-y-1.5">
                {NAV_ITEMS.map((item) => {
                    const active = pathname?.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                                active
                                    ? "bg-blue-600/10 text-blue-500 font-bold"
                                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-main)]"
                            )}
                        >
                            <item.icon size={22} className={cn("transition-all duration-300", active ? "scale-110 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]" : "group-hover:scale-110 group-hover:text-blue-500/70")} />
                            <span className="text-[15px] group-hover:translate-x-1 transition-transform">{item.label}</span>
                            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <Link
                        href="/admin"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                            pathname?.startsWith("/admin")
                                ? "bg-purple-600/10 text-purple-500 font-bold"
                                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-main)]"
                        )}
                    >
                        <ShieldCheck size={22} className={cn("transition-all duration-200", pathname?.startsWith("/admin") ? "scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]" : "group-hover:scale-105")} />
                        <span className="text-[15px]">Admin</span>
                    </Link>
                )}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-[var(--color-border)] space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
                    <ThemeToggle />
                    <span className="text-sm font-bold text-[var(--color-text-muted)]">Appearance</span>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 cursor-pointer group">
                    <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-sm font-bold">Sign Out</span>
                </div>
            </div>
        </aside>
    );
}
