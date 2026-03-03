import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { MOCK_EVENTS } from "@/lib/mockData";
import { Event, AttendanceStatus } from "@/types";

interface RegistrationState {
    status: AttendanceStatus;
    reminder: boolean;
}

interface EventContextType {
    events: Event[];
    registrations: Record<string, RegistrationState>;
    registerEvent: (eventId: string) => void;
    unregisterEvent: (eventId: string) => void;
    updateAttendance: (eventId: string, status: AttendanceStatus) => void;
    toggleReminder: (eventId: string) => void;
    isRegistered: (eventId: string) => boolean;
    getAttendanceStatus: (eventId: string) => AttendanceStatus;
    hasReminder: (eventId: string) => boolean;
    // Admin functions
    addEvent: (event: Event) => void;
    updateEvent: (event: Event) => void;
    deleteEvent: (eventId: string) => void;
    // Engagement
    engagementScore: number;
    interests: string[];
    setInterests: (interests: string[]) => void;
    attendedCategories: string[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [registrations, setRegistrations] = useState<Record<string, RegistrationState>>({});
    const [interests, setInterestsState] = useState<string[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Initial hydration
    useEffect(() => {
        const storedReg = localStorage.getItem("eventpulse_registrations");
        const storedEvents = localStorage.getItem("eventpulse_events");
        const storedInterests = localStorage.getItem("eventpulse_interests");

        if (storedReg) {
            try { setRegistrations(JSON.parse(storedReg)); } catch (e) { console.error(e); }
        }
        if (storedEvents) {
            try { setEvents(JSON.parse(storedEvents)); } catch (e) { console.error(e); }
        }
        if (storedInterests) {
            try { setInterestsState(JSON.parse(storedInterests)); } catch (e) { console.error(e); }
        }
        setIsHydrated(true);
    }, []);

    // Sync
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem("eventpulse_registrations", JSON.stringify(registrations));
            localStorage.setItem("eventpulse_events", JSON.stringify(events));
            localStorage.setItem("eventpulse_interests", JSON.stringify(interests));
        }
    }, [registrations, events, interests, isHydrated]);

    const setInterests = (newInterests: string[]) => {
        setInterestsState(newInterests);
    };

    const attendedCategories = useMemo(() => {
        const attendedEventIds = Object.keys(registrations).filter(id => registrations[id].status === "attended");
        const categories = events
            .filter(e => attendedEventIds.includes(e.id))
            .map(e => e.category);
        return Array.from(new Set(categories));
    }, [registrations, events]);

    const registerEvent = (eventId: string) => {
        setRegistrations(prev => ({
            ...prev,
            [eventId]: { status: "registered", reminder: prev[eventId]?.reminder || false }
        }));
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registered: e.registered + 1 } : e));
    };

    const unregisterEvent = (eventId: string) => {
        setRegistrations(prev => {
            const next = { ...prev };
            delete next[eventId];
            return next;
        });
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registered: Math.max(0, e.registered - 1) } : e));
    };

    const updateAttendance = (eventId: string, status: AttendanceStatus) => {
        setRegistrations(prev => ({
            ...prev,
            [eventId]: { ...prev[eventId], status }
        }));
    };

    const toggleReminder = (eventId: string) => {
        setRegistrations(prev => ({
            ...prev,
            [eventId]: { ...prev[eventId], reminder: !prev[eventId]?.reminder }
        }));
    };

    const isRegistered = (eventId: string) => !!registrations[eventId];
    const getAttendanceStatus = (eventId: string) => registrations[eventId]?.status || "none";
    const hasReminder = (eventId: string) => !!registrations[eventId]?.reminder;

    const addEvent = (event: Event) => setEvents(prev => [event, ...prev]);
    const updateEvent = (event: Event) => setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    const deleteEvent = (eventId: string) => setEvents(prev => prev.filter(e => e.id !== eventId));

    const engagementScore = useMemo(() => {
        const regCount = Object.values(registrations).length;
        const attendCount = Object.values(registrations).filter(r => r.status === "attended").length;
        // Simple formula: registrations count * 5 + attendance * 15, capped at 100
        return Math.min(100, (regCount * 5) + (attendCount * 15));
    }, [registrations]);

    const value = {
        events,
        registrations,
        registerEvent,
        unregisterEvent,
        updateAttendance,
        toggleReminder,
        isRegistered,
        getAttendanceStatus,
        hasReminder,
        addEvent,
        updateEvent,
        deleteEvent,
        engagementScore,
        interests,
        setInterests,
        attendedCategories
    };

    return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEventStore() {
    const context = useContext(EventContext);
    if (!context) throw new Error("useEventStore must be used within EventProvider");
    return context;
}
