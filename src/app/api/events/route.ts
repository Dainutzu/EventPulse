import { NextResponse } from "next/server";
import { MOCK_EVENTS } from "@/lib/mockData";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    const sort = searchParams.get("sort");

    let events = [...MOCK_EVENTS];

    if (category && category !== "All") {
        events = events.filter((e) => e.faculty === category);
    }

    if (query) {
        const q = query.toLowerCase();
        events = events.filter((e) =>
            e.title.toLowerCase().includes(q) ||
            (e.organizer && e.organizer.toLowerCase().includes(q)) ||
            e.faculty.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q)
        );
    }

    if (sort) {
        if (sort === "Upcoming") {
            events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (sort === "Ending Soon") {
            events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Simplified mock sort
        } else if (sort === "Most Popular") {
            events.sort((a, b) => b.registered - a.registered);
        }
    } else {
        // Default sort by upcoming
        events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return NextResponse.json({ events });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // In a real app with Supabase, this would verify the user is an organizer
        // and insert the record into the events table

        const newEvent = {
            id: `e${Date.now()}`,
            registered: 0,
            banner: null,
            ...body,
        };

        return NextResponse.json({ event: newEvent, success: true }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "Failed to create event" }, { status: 400 });
    }
}
