export type AttendanceStatus = "none" | "registered" | "attended";

export interface Event {
    id: string;
    title: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    location: string;
    faculty: string;
    subcategory: string;
    organizer?: string;
    maxParticipants: number;
    registered: number;
    banner: string | null;
    categoryColor: string;
    description: string;
    trending?: boolean;
    reminderSet?: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: "student" | "admin" | "organizer";
    avatar: string;
    points: number;
    engagementScore: number;
    streak: number;
    interests: string[];
}

export interface PortfolioItem {
    id: string;
    title: string;
    venue: string;
    date: string;
    role: string;
    points: number;
    roleColor: string;
    icon: string;
}
