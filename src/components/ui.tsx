import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility to merge tailwind classes gracefully */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Icons (using lucide-react approximations) ---
export {
    Home,
    Compass,
    Ticket,
    User,
    Bell,
    Calendar,
    Clock,
    MapPin,
    ChevronLeft,
    Share2,
    Download,
    CheckCircle,
    Users,
    TrendingUp,
    Search,
    Star,
    Award,
    QrCode,
} from "lucide-react";

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "ghost" | "outline";
    size?: "default" | "sm" | "lg";
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", fullWidth, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                    {
                        "bg-[var(--color-accent)] text-white hover:bg-blue-600 shadow-[0_8px_24px_rgba(59,130,246,0.25)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] hover:-translate-y-0.5":
                            variant === "primary",
                        "bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-surface)]":
                            variant === "ghost",
                        "bg-transparent border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)]":
                            variant === "outline",
                        "px-6 py-4 text-[17px]": size === "default",
                        "px-5 py-2.5 text-sm rounded-xl": size === "sm",
                        "px-8 py-5 text-lg": size === "lg",
                        "w-full": fullWidth,
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

// --- Card ---
export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden",
            className
        )}
        {...props}
    >
        {children}
    </div>
);

// --- Badge / Pill ---
export const Badge = ({
    className,
    variant = "default",
    children,
    style,
    ...rest
}: {
    className?: string;
    variant?: "default" | "success" | "warning" | "purple" | "outline";
    children: React.ReactNode;
    style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">) => {
    return (
        <span
            style={style}
            className={cn(
                "inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border",
                {
                    "bg-blue-500/15 text-[var(--color-accent)] border-blue-500/30": variant === "default",
                    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30": variant === "success",
                    "bg-amber-500/15 text-amber-400 border-amber-500/30": variant === "warning",
                    "bg-purple-500/15 text-purple-400 border-purple-500/30": variant === "purple",
                    "bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)]":
                        variant === "outline",
                },
                className
            )}
            {...rest}
        >
            {children}
        </span>
    );
};


// --- Bottom Navigation ---
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, QrCode, User } from "lucide-react";

export const BottomNav = ({
    activeTab,
    onTabChange
}: {
    activeTab?: string;
    onTabChange?: (tab: string) => void
}) => {
    const pathname = usePathname();
    const currentTab = activeTab || (pathname === "/explore" ? "explore" : pathname === "/profile" ? "profile" : "home");

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full z-[100]">
            {/* Gradient fade above nav */}
            <div className="h-24 w-full bg-gradient-to-t from-[var(--color-bg)] to-transparent pointer-events-none absolute bottom-0 -z-10" />

            <div className="bg-[var(--color-surface)]/80 backdrop-blur-xl border-t border-[var(--color-border)] px-4 pt-3 pb-safe-bottom flex items-center justify-around relative max-w-md mx-auto">
                <NavItem href="/" icon={<Home size={24} />} label="Home" active={currentTab === "home"} onClick={() => onTabChange?.("home")} />
                <NavItem href="/explore" icon={<Compass size={24} />} label="Explore" active={currentTab === "explore"} onClick={() => onTabChange?.("explore")} />

                {/* Center QR Scanner Button - Keep SPA behavior for scanner since it's a tool */}
                <div className="relative -top-8 flex flex-col items-center">
                    <button
                        onClick={() => onTabChange?.("scanner")}
                        className="w-14 h-14 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(59,130,246,0.5)] border-4 border-[var(--color-bg)] transition-transform hover:scale-110 active:scale-95 z-10"
                    >
                        <QrCode size={26} />
                    </button>
                </div>

                <NavItem href="/profile" icon={<User size={24} />} label="Profile" active={currentTab === "profile"} onClick={() => onTabChange?.("profile")} />
            </div>
        </div>
    );
};

const NavItem = ({ href, icon, label, active, onClick }: { href: string; icon: React.ReactNode; label: string; active: boolean; onClick?: () => void }) => (
    <Link href={href} onClick={onClick} className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors hover:bg-[var(--color-surface-elevated)] group">
        <div className={cn("transition-colors duration-200", active ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)]")}>
            {icon}
        </div>
        <span className={cn("text-[10px] font-bold uppercase tracking-wider transition-colors duration-200", active ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)]")}>
            {label}
        </span>
    </Link>
);
