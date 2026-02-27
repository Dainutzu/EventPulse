export interface Event {
    id: string;
    title: string;
    category: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    venue: string;
    club: string;
    maxParticipants: number;
    registered: number;
    banner: string | null;
    categoryColor: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    points: number;
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
