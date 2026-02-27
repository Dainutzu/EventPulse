"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MOCK_EVENTS } from "@/lib/mockData";
import { Event } from "@/types";

interface EventContextType {
    events: Event[];
    registeredEventIds: string[];
    registerEvent: (eventId: string) => void;
    unregisterEvent: (eventId: string) => void;
    isRegistered: (eventId: string) => boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
    const [events] = useState<Event[]>(MOCK_EVENTS);
    const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Initial hydration from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("event_registrations");
        if (stored) {
            try {
                setRegisteredEventIds(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse registrations", e);
            }
        }
        setIsHydrated(true);
    }, []);

    // Sync to localStorage
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem("event_registrations", JSON.stringify(registeredEventIds));
        }
    }, [registeredEventIds, isHydrated]);

    const registerEvent = (eventId: string) => {
        setRegisteredEventIds((prev) => {
            if (prev.includes(eventId)) return prev;
            return [...prev, eventId];
        });
    };

    const unregisterEvent = (eventId: string) => {
        setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
    };

    const isRegistered = (eventId: string) => {
        return registeredEventIds.includes(eventId);
    };

    const value = {
        events,
        registeredEventIds,
        registerEvent,
        unregisterEvent,
        isRegistered,
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
}

export function useEventStore() {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error("useEventStore must be used within an EventProvider");
    }
    return context;
}
