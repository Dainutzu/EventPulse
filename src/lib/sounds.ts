/**
 * EventPulse Sound System Utility
 * Handles dynamic audio loading, volume control, and respects user settings.
 */

// Debounce map to prevent overlapping sounds
const lastPlayed: Record<string, number> = {};

export const SOUND_TYPES = {
    success: "/sounds/success.mp3",
    scan: "/sounds/scan.mp3",
    achievement: "/sounds/achievement.mp3",
    notification: "/sounds/notification.mp3",
} as const;

export type SoundType = keyof typeof SOUND_TYPES;

/**
 * Checks if sound effects are enabled in user settings.
 * Defaults to true if not set.
 */
export const isSoundEnabled = (): boolean => {
    if (typeof window === "undefined") return false;
    const setting = localStorage.getItem("ep_sound_enabled");
    return setting !== "false";
};

/**
 * Toggles the sound setting globally in localStorage.
 */
export const toggleSoundSettings = (enabled: boolean): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ep_sound_enabled", enabled.toString());
};

/**
 * Plays a discrete UI sound effect.
 * Enforces rules: Settings check, low volume, no overlap/spamming.
 */
export const playSound = (type: SoundType) => {
    // 1. Strict check: Do not attempt to load audio if disabled
    if (!isSoundEnabled()) return;

    // 2. Prevent overlapping/spamming the exact same sound (throttle 500ms)
    const now = Date.now();
    if (lastPlayed[type] && now - lastPlayed[type] < 500) {
        return;
    }
    lastPlayed[type] = now;

    try {
        // 3. Dynamically load/play the audio
        const audio = new Audio(SOUND_TYPES[type]);

        // 4. Force low volume (0.3 - 0.5 range as requested)
        audio.volume = type === 'notification' ? 0.3 : 0.4;

        // 5. Play with promise handling to respect browser autoplay policies
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                // Autoplay policy prevented playback, fail silently as required for UI sounds
                console.warn(`Sound playback prevented: ${error.name}`);
            });
        }
    } catch (e) {
        // Fail gracefully
        console.error("Failed to play sound", e);
    }
};
