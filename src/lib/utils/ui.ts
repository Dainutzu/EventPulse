export const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
};

export const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
        Academic: "var(--color-accent)",
        Sports: "var(--color-accent-amber)",
        Cultural: "var(--color-accent-purple)",
        Workshop: "var(--color-accent-green)",
        Competition: "var(--color-accent-green)",
    };
    return map[cat] || "var(--color-text-muted)";
};
