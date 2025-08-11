// Template utilities for 5/3/1 program templates
// TODO: This is a placeholder for template application logic

export function applyTemplate(program, templateKey) {
    // Apply template-specific modifications to program state
    switch (templateKey) {
        case 'bbb':
            return {
                ...program,
                template: 'bbb',
                supplemental: {
                    type: 'BBB',
                    pairing: 'same',
                    pct: 50,
                    sets: 5,
                    reps: 10
                }
            };
        case 'triumvirate':
            return {
                ...program,
                template: 'triumvirate',
                supplemental: null
            };
        case 'bodyweight':
            return {
                ...program,
                template: 'bodyweight',
                supplemental: null
            };
        case 'jackshit':
            return {
                ...program,
                template: 'jackshit',
                supplemental: null
            };
        default:
            return {
                ...program,
                template: 'custom',
                supplemental: null
            };
    }
}
