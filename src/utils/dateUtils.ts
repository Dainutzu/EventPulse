import { Event } from "../types";

/**
 * Generates a mock event with a date relative to today.
 * @param daysOffset How many days from today the event should occur.
 * @returns A date string in ISO format.
 */
export const getDateRelative = (daysOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString();
};

/**
 * Formats a date string into a premium, human-readable format.
 * Example: Tuesday, October 24, 2026
 */
export const formatPremiumDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

/**
 * Formats a date for the small date block in the UI.
 */
export const formatDateBlock = (dateString: string) => {
    const date = new Date(dateString);
    return {
        month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
        day: date.getDate(),
    };
};

/**
 * Filters and sorts events into upcoming and past categories.
 */
export const processEvents = (events: Event[]) => {
    const now = new Date().getTime();

    const upcoming = events
        .filter(e => new Date(e.date).getTime() >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const past = events
        .filter(e => new Date(e.date).getTime() < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcoming, past };
};
