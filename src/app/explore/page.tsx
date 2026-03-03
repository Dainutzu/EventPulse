"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/state/useEventStore";

export default function ExploreRedirect() {
    const router = useRouter();
    const { setActiveTab } = useEventStore();

    useEffect(() => {
        setActiveTab("explore");
        router.replace("/");
    }, [router, setActiveTab]);

    return null;
}
