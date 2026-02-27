export const MOCK_USER = {
    id: "u1",
    name: "Viyath De silva",
    email: "viyath@university.edu",
    role: "student",
    avatar: "VD",
    points: 1200,
};

export const MOCK_EVENTS = [
    {
        id: "e1",
        title: "AI & Machine Learning Workshop",
        category: "Academic",
        date: new Date(2025, 9, 12).toISOString(),
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
        date: new Date(2025, 9, 15).toISOString(),
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
        date: new Date(2025, 9, 18).toISOString(),
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
        date: new Date(2025, 10, 15).toISOString(),
        timeStart: "09:00",
        timeEnd: "16:30",
        venue: "Main Auditorium, Building 4",
        club: "University Robotics Club",
        maxParticipants: 500,
        registered: 312,
        banner: null,
        categoryColor: "#3B82F6",
        description:
            "Join us for an immersive day exploring the boundaries of artificial intelligence and robotics. This year's summit brings together industry leaders, academic researchers, and student innovators to discuss the future of automated systems.\n\nAttendees will have the opportunity to participate in hands-on workshops, witness live robot demonstrations, and network with recruiters from top-tier tech companies. Refreshments and a networking lunch will be provided for all registered participants.",
    },
];

export const MOCK_PORTFOLIO = [
    {
        id: "p1",
        title: "Annual Tech Symposium",
        venue: "Main Auditorium",
        date: new Date(2023, 9, 12).toISOString(),
        role: "CORE ATTENDEE",
        points: 50,
        roleColor: "#10B981",
        icon: "📅",
    },
    {
        id: "p2",
        title: "Volunteer Meetup",
        venue: "Student Lounge",
        date: new Date(2023, 8, 28).toISOString(),
        role: "LEAD VOLUNTEER",
        points: 120,
        roleColor: "#F59E0B",
        icon: "🤝",
    },
    {
        id: "p3",
        title: "Hackathon 2023",
        venue: "IT Lab Block B",
        date: new Date(2023, 7, 15).toISOString(),
        role: "FINALIST",
        points: 300,
        roleColor: "#8B5CF6",
        icon: "💻",
    },
    {
        id: "p4",
        title: "Cultural Fest",
        venue: "Open Air Theater",
        date: new Date(2023, 6, 10).toISOString(),
        role: "PARTICIPANT",
        points: 25,
        roleColor: "#6B7280",
        icon: "🎭",
    },
];

export const CATEGORIES = ["All", "Academic", "Sports", "Cultural", "Workshop", "Competition"];

export const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

export const formatMonthDay = (dateString: string) => {
    const date = new Date(dateString);
    return {
        month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
        day: date.getDate(),
    };
};

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
