import { NextResponse } from "next/server";
import { MOCK_PORTFOLIO } from "@/lib/mockUser";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "attended"; // registered, attended, organized

        // In a real app: JOIN events and registrations/activity_log

        let filteredEvents: { id: string; title: string; venue: string; date: string; role: string; points: number; roleColor: string; icon: string; }[] | { id: string; eventId: string; title: string; date: string; venue: string; role: string; points: number; roleColor: string; icon: string; }[] = [];

        if (type === "attended") {
            filteredEvents = MOCK_PORTFOLIO.filter(p => ["ATTENDEE", "FINALIST"].includes(p.role));
        } else if (type === "organized") {
            filteredEvents = MOCK_PORTFOLIO.filter(p => ["ORGANIZER", "VOLUNTEER"].includes(p.role));
        } else if (type === "registered") {
            // Mock some registered events that haven't occurred yet
            filteredEvents = [
                { id: 't1', eventId: 'e1', title: "Upcoming AI Workshop", date: "2025-11-20T14:00:00Z", venue: "TBD", role: "PENDING", points: 0, roleColor: "#A0aec0", icon: "🕒" }
            ];
        }

        return NextResponse.json({ events: filteredEvents }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user events" }, { status: 500 });
    }
}
