import { NextResponse } from "next/server";
import { MOCK_USER, MOCK_PORTFOLIO } from "@/lib/mockData";

export async function GET() {
    try {
        // In a real implementation:
        // This would compute stats based on activity_log and user points_total

        const attended = MOCK_PORTFOLIO.filter(p => ["ATTENDEE", "FINALIST"].includes(p.role)).length;
        const organized = MOCK_PORTFOLIO.filter(p => ["ORGANIZER", "VOLUNTEER"].includes(p.role)).length;

        const stats = {
            attended: attended || 24, // Fallback to provided defaults if mock list is short
            organized: organized || 5,
            points: MOCK_USER.points,
            rank: "Gold Tier" // Computed mock rank
        };

        return NextResponse.json({ stats }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
