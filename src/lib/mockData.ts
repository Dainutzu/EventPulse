import { getDateRelative } from "../utils/dateUtils";
import { Event } from "../types";

export const MOCK_EVENTS: Event[] = [
    {
        id: "e1",
        title: "AI & Machine Learning Workshop",
        category: "Academic",
        date: getDateRelative(2),
        timeStart: "14:00",
        timeEnd: "17:00",
        venue: "CS Lab Block A",
        club: "Computer Science Club",
        maxParticipants: 60,
        registered: 48,
        banner: null,
        categoryColor: "#3B82F6",
        description:
            "Dive into practical machine learning with hands-on sessions covering neural networks, NLP, and computer vision. Industry mentors will guide you through real-world case studies and cutting-edge tools.",
    },
    {
        id: "e2",
        title: "Inter-University Cricket Finals",
        category: "Sports",
        date: getDateRelative(5),
        timeStart: "09:00",
        timeEnd: "16:00",
        venue: "Main Sports Ground",
        club: "Sports Council",
        maxParticipants: 200,
        registered: 152,
        banner: null,
        categoryColor: "#F97316",
        description:
            "Cheer for our university cricket team in the final showdown of the inter-university cricket championship. Free entry for all students with ID.",
    },
    {
        id: "e3",
        title: "Evening of Jazz & Fusion",
        category: "Cultural",
        date: getDateRelative(1),
        timeStart: "18:30",
        timeEnd: "21:00",
        venue: "Open Air Theater",
        club: "Music Society",
        maxParticipants: 300,
        registered: 215,
        banner: null,
        categoryColor: "#A855F7",
        description:
            "An enchanting evening of jazz, fusion, and world music performed by our talented music society members and special guest artists.",
    },
    {
        id: "e4",
        title: "Future Horizons: AI & Robotics Summit 2024",
        category: "Academic",
        date: getDateRelative(12),
        timeStart: "09:00",
        timeEnd: "16:30",
        venue: "Main Auditorium, Building 4",
        club: "University Robotics Club",
        maxParticipants: 500,
        registered: 312,
        banner: null,
        categoryColor: "#3B82F6",
        description:
            "Join us for an immersive day exploring the boundaries of artificial intelligence and robotics. This year's summit brings together industry leaders, academic researchers, and student innovators to discuss the future of automated systems.",
    },
    {
        id: "e5",
        title: "Startup Founders Networking",
        category: "Academic",
        date: getDateRelative(-2), // Past event
        timeStart: "18:00",
        timeEnd: "20:00",
        venue: "Business School Hall",
        club: "Entrepreneurship Club",
        maxParticipants: 100,
        registered: 95,
        banner: null,
        categoryColor: "#10B981",
        description: "Network with fellow student entrepreneurs and local startup founders.",
    }
];
