// Canonical methodology types used by CSV-driven 5/3/1 builder flows

export type TemplateCsv = {
    id: string;
    display_name: string;
    category?: string;
    goal?: string;
    days_per_week?: string | number;
    main_lifts?: string;
    supplemental?: string;
    assistance?: string;
    assistance_guideline?: string;
    conditioning_guideline?: string;
    scheme?: string; // aka core_scheme
    percent_notes?: string;
    cycles?: string;
    notes?: string;
    source?: string;  // aka source_book
    pages?: string;   // aka source_pages

    // Legacy/master compatibility fields (selected, optional)
    'Template Name'?: string;
    'Main Work'?: string;
    'Supplemental'?: string;
    'Assistance'?: string;
    'Conditioning'?: string;
    'Leader/Anchor'?: string;
    'Notes'?: string;

    // Optional UI presentation strings (when present in CSV additions)
    ui_main?: string;
    ui_supplemental?: string;
    ui_assistance?: string;
    ui_conditioning?: string;
    ui_notes?: string;

    // Allow unknown properties for forward/backward compatibility
    [key: string]: any;
};

export type Step3CustomizeState = {
    novFullPrep: boolean;
    deloadEnabled: boolean;
    trainingFrequency: 2 | 3 | 4 | 5;
    dayMap: Record<1 | 2 | 3 | 4 | 5, string>;
    rotation: Array<'Squat' | 'Bench' | 'Deadlift' | 'Press'>;
};
