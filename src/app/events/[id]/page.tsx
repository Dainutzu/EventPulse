"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useEventStore } from "@/state/useEventStore";
import EventDetailsSection from "@/components/spa/EventDetailsSection";

export default function EventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setSelectedEventId } = useEventStore();

  useEffect(() => {
    if (id) {
      setSelectedEventId(id as string);
    }
    return () => setSelectedEventId(null);
  }, [id, setSelectedEventId]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <EventDetailsSection />
    </div>
  );
}
