// Rotation normalization utilities
// Extract rotation pattern logic for reusability and testability

export interface RotationResult {
    normalizedRotation: string[][];
    scheduleFrequency: 2 | 3 | 4;
}

/**
 * Normalize rotation patterns to ensure they match the expected schedule frequency.
 * For 2-day and 3-day schedules, each cycle should contain exactly `scheduleFrequency` lifts.
 * For 4-day schedules, rotation is not applicable (uses fixed order).
 */
export function normalizeRotation(
    rotation: string[][] | undefined,
    scheduleFrequency: 2 | 3 | 4,
    fallbackLifts: string[] = ['squat', 'bench', 'deadlift', 'press']
): RotationResult {
    // 4-day schedules don't use rotation patterns
    if (scheduleFrequency === 4) {
        return {
            normalizedRotation: [],
            scheduleFrequency
        };
    }

    // If no rotation provided, create default pattern
    if (!rotation || rotation.length === 0) {
        return {
            normalizedRotation: createDefaultRotation(scheduleFrequency, fallbackLifts),
            scheduleFrequency
        };
    }

    // Validate and normalize existing rotation
    const normalized = rotation.map(cycle => {
        if (cycle.length !== scheduleFrequency) {
            // If cycle length doesn't match, take first N or pad with fallback
            if (cycle.length > scheduleFrequency) {
                return cycle.slice(0, scheduleFrequency);
            } else {
                const padded = [...cycle];
                while (padded.length < scheduleFrequency) {
                    const nextLift = fallbackLifts[padded.length % fallbackLifts.length];
                    if (!padded.includes(nextLift)) {
                        padded.push(nextLift);
                    } else {
                        // Find a lift not already in the cycle
                        const unused = fallbackLifts.find(lift => !padded.includes(lift));
                        padded.push(unused || fallbackLifts[0]);
                    }
                }
                return padded;
            }
        }
        return cycle;
    });

    return {
        normalizedRotation: normalized,
        scheduleFrequency
    };
}

/**
 * Create a default rotation pattern for the given schedule frequency.
 */
function createDefaultRotation(
    scheduleFrequency: 2 | 3,
    lifts: string[]
): string[][] {
    if (scheduleFrequency === 2) {
        // 2-day default: alternate between upper/lower patterns
        return [
            [lifts[0] || 'squat', lifts[1] || 'bench'],
            [lifts[2] || 'deadlift', lifts[3] || 'press']
        ];
    } else if (scheduleFrequency === 3) {
        // 3-day default: each cycle hits 3 lifts, rotating through all 4
        return [
            [lifts[0] || 'squat', lifts[1] || 'bench', lifts[2] || 'deadlift'],
            [lifts[3] || 'press', lifts[0] || 'squat', lifts[1] || 'bench'],
            [lifts[2] || 'deadlift', lifts[3] || 'press', lifts[0] || 'squat'],
            [lifts[1] || 'bench', lifts[2] || 'deadlift', lifts[3] || 'press']
        ];
    }

    return [];
}

/**
 * Validate that a rotation pattern is consistent and well-formed.
 */
export function validateRotation(
    rotation: string[][],
    scheduleFrequency: 2 | 3 | 4
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (scheduleFrequency === 4) {
        return { valid: true, errors: [] }; // 4-day doesn't use rotation
    }

    if (rotation.length === 0) {
        errors.push('Rotation cannot be empty for 2-day or 3-day schedules');
        return { valid: false, errors };
    }

    rotation.forEach((cycle, index) => {
        if (cycle.length !== scheduleFrequency) {
            errors.push(`Cycle ${index + 1} has ${cycle.length} lifts, expected ${scheduleFrequency}`);
        }

        // Check for duplicates within cycle
        const unique = new Set(cycle);
        if (unique.size !== cycle.length) {
            errors.push(`Cycle ${index + 1} contains duplicate lifts`);
        }
    });

    return { valid: errors.length === 0, errors };
}
