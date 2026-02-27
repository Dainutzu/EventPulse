export function formatDate(dateInput: string | Date): string {
    const date = typeof dateInput === "string"
        ? new Date(dateInput)
        : dateInput;

    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function formatMonthDay(dateInput: string | Date) {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return {
        month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
        day: date.getDate(),
    };
}
