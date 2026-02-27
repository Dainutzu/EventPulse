import { useLocalStorage } from "../hooks/usePersistence";
import { MOCK_EVENTS } from "../lib/mockData";
import { Event } from "../types";

/**
 * Hook for managing event registrations and status.
 * Investor demo safe persistence using localStorage.
 */
export function useEventState() {
    const [registrations, setRegistrations] = useLocalStorage<string[]>("event_registrations", []);

    // In a real app, this would be fetched from an API
    const [events] = useState<Event[]>(MOCK_EVENTS);

    const registerEvent = (eventId: string) => {
        if (!registrations.includes(eventId)) {
            setRegistrations([...registrations, eventId]);
        }
    };

    const unregisterEvent = (eventId: string) => {
        setRegistrations(registrations.filter(id => id !== eventId));
    };

    const isRegistered = (eventId: string) => {
        return registrations.includes(eventId);
    };

    const registeredEvents = events.filter(e => registrations.includes(e.id));

    return {
        events,
        registrations,
        registeredEvents,
        registerEvent,
        unregisterEvent,
        isRegistered
    };
}

import { useState } from "react";
