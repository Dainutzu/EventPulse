import { NextResponse } from "next/server";
import { MOCK_USER } from "@/lib/mockUser";

export async function GET() {
    try {
        // In a real implementation:
        // const { user, error } = await supabase.auth.getUser()
        // const { data } = await supabase.from('users').select('*').eq('id', user.id).single()

        // Returning mocked data from mockData.ts
        const profile = {
            ...MOCK_USER,
            initials: MOCK_USER.name.split(" ").map(n => n[0]).join("").toUpperCase()
        };

        return NextResponse.json({ profile }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}
