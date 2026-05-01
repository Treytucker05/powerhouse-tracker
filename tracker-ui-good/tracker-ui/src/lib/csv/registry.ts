export type CsvRegistryEntry = {
    key: string;
    src: string;  // under data/extraction
    dest: string; // under public/methodology/extraction
};

export const CSV_REGISTRY: CsvRegistryEntry[] = [
    { key: 'conditioning', src: 'data/extraction/conditioning.csv', dest: 'public/methodology/extraction/conditioning.csv' },
    { key: 'jumps_throws', src: 'data/extraction/jumps_throws.csv', dest: 'public/methodology/extraction/jumps_throws.csv' },
];
