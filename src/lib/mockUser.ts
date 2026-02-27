import { User, PortfolioItem } from "../types";
import { getDateRelative } from "../utils/dateUtils";

export const MOCK_USER: User = {
    id: "u1",
    name: "Viyath De silva",
    email: "viyath@university.edu",
    role: "student",
    avatar: "VD",
    points: 1200,
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

export const CATEGORIES = ["All", "Academic", "Sports", "Cultural", "Workshop", "Competition"];
