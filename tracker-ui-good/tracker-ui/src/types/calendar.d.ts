export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type Phase = "Leader" | "Deload" | "Anchor" | "TMTest";
export type EventType = "SESSION" | "COND_HARD" | "COND_EASY" | "DELOAD" | "TM_TEST";

export interface CalEvent {
    id: string;
    type: EventType;
    day: Weekday;
    weekIndex: number;   // start with 0; extend later for multi-week views
    phase: Phase;
    meta: {
        lift?: "Squat" | "Bench" | "Deadlift" | "Press";
        supplemental?: string; // e.g., "BBB 5x10 @50%"
        assistanceTargets?: Record<"Push" | "Pull" | "Single-Leg/Core" | "Core", number>;
        minutes?: number;  // cached estimate
        label?: string;    // display override
    };
}
