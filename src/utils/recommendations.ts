import { Event } from "@/types";

/**
 * Scoring system:
 * +3 if category matches user interest
 * +2 if category matches previously attended events
 * +1 if event is trending
 * +1 if event is within next 7 days
 */
export function getRecommendedEvents(
    events: Event[],
    userInterests: string[],
    attendedCategories: string[]
): Event[] {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const scoredEvents = events.map((event) => {
        let score = 0;

        // +3 if category matches user interest
        if (userInterests.includes(event.category)) {
            score += 3;
        }

        // +2 if category matches previously attended events
        if (attendedCategories.includes(event.category)) {
            score += 2;
        }

        // +1 if event is trending
        if (event.trending) {
            score += 1;
        }

        // +1 if event is within next 7 days
        const eventDate = new Date(event.date);
        if (eventDate >= now && eventDate <= nextWeek) {
            score += 1;
        }

        return { ...event, recommendationScore: score };
    });

    // Filter out events with 0 score and sort descending
    const recommended = scoredEvents
        .filter(e => e.recommendationScore > 0)
        .sort((a, b) => b.recommendationScore - a.recommendationScore);

    // Failsafe: if no matching events, show trending events
    if (recommended.length === 0) {
        return events.filter(e => e.trending).slice(0, 5);
    }

    return recommended.slice(0, 5);
}
