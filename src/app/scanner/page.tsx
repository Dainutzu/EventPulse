"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/state/useEventStore";

export default function ScannerRedirect() {
    const router = useRouter();
    const { setActiveTab } = useEventStore();

    useEffect(() => {
        setActiveTab("scanner");
        router.replace("/");
    }, [router, setActiveTab]);

    return null;
}
