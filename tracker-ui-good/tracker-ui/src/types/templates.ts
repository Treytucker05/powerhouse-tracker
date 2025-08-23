// CSV type for templates_additions.csv and merged template rows
// Keep fields optional for backward compatibility when merging with legacy master CSV
export type TemplateCsv = {
    // Additions CSV canonical fields (project header)
    id?: string; // kebab id (for additions)
    display_name?: string;
    category?: string;
    days_per_week?: string | number; // aka weekly_frequency in some seeds
    core_scheme?: string; // aka main_scheme in some seeds
    supplemental?: string;
    assistance_guideline?: string; // aka assistance_targets
    conditioning_guideline?: string;
    leader_anchor?: string;
    notes?: string;
    source_book?: string; // aka source
    source_pages?: string; // aka pages

    // Legacy/master CSV fields used by Step 2 (explicit string-literal keys to reflect header order)
    'Template Name'?: string;
    'Book'?: string;
    'Page'?: string;
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
