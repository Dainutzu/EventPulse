import { User, PortfolioItem } from "../types";
import { getDateRelative } from "../utils/dateUtils";

export const MOCK_USER: User = {
    id: "u1",
    name: "Viyath De silva",
    email: "viyath@university.edu",
    role: "admin",
    avatar: "VD",
    points: 1250,
    engagementScore: 85,
    streak: 4,
    interests: ["Tech", "Career"],
};

export const MOCK_PORTFOLIO: PortfolioItem[] = [
    {
        id: "p1",
        title: "Annual Tech Symposium",
        venue: "Main Auditorium",
        date: getDateRelative(-30),
        role: "CORE ATTENDEE",
        points: 50,
        roleColor: "#10B981",
        icon: "📅",
    },
    {
        id: "p2",
        title: "Volunteer Meetup",
        venue: "Student Lounge",
        date: getDateRelative(-45),
        role: "LEAD VOLUNTEER",
        points: 120,
        roleColor: "#F59E0B",
        icon: "🤝",
    },
];

export const CATEGORIES = ["Academic", "Tech", "Sports", "Cultural", "Career"];
