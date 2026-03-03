"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/state/useEventStore";

export default function PortfolioRedirect() {
    const router = useRouter();
    const { setActiveTab } = useEventStore();

    useEffect(() => {
        setActiveTab("portfolio");
        router.replace("/");
    }, [router, setActiveTab]);

    return null;
}
