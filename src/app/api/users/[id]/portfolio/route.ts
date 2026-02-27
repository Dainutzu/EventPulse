import { NextResponse } from "next/server";
import { MOCK_PORTFOLIO, MOCK_USER } from "@/lib/mockData";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // In a real implementation:
        // const { data, error } = await supabase
        //   .from('activity_log')
        //   .select('*, events(*)')
        //   .eq('user_id', id);

        // Mocking the response
        const portfolioTokens = {
            user: MOCK_USER,
            timeline: MOCK_PORTFOLIO,
            stats: {
                attended: 24,
                organized: 5,
                points: MOCK_USER.points,
            }
        };

        return NextResponse.json(portfolioTokens, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
    }
}
