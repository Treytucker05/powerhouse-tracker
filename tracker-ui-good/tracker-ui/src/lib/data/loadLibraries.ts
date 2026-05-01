import { loadCsv } from "@/lib/loadCsv";

// Simple JSON fetcher that returns null if not found/invalid
async function tryLoadJson<T = any>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) return null;
        const text = await res.text();
        // Guard against empty
        if (!text || !text.trim()) return null;
        // Handle optional JSONC by stripping comments if present
        const stripped = text
            .replace(/\/\/[^\n]*$/gm, "") // strip // comments
            .replace(/\/\*[\s\S]*?\*\//gm, ""); // strip /* */ comments
        const json = JSON.parse(stripped);
        return json as T;
    } catch {
        return null;
    }
}

export type DataSource = "json" | "csv";
export interface LoadResult<T> {
    rows: T[];
    source: DataSource;
}

// Assistance Library
export async function loadAssistanceLibrary<T extends Record<string, any>>(): Promise<LoadResult<T>> {
    const base = import.meta.env.BASE_URL || "/";
    const jsonUrl = `${base}methodology/json/assistance_exercises.json`;
    const j = await tryLoadJson<T[]>(jsonUrl);
    if (Array.isArray(j) && j.length) return { rows: j, source: "json" };
    const csv = await loadCsv<T>(`${base}methodology/extraction/assistance_exercises.csv`).catch(() => [] as T[]);
    return { rows: Array.isArray(csv) ? (csv as T[]) : [], source: "csv" };
}

// Warmups Library
export async function loadWarmupsLibrary<T extends Record<string, any>>(): Promise<LoadResult<T>> {
    const base = import.meta.env.BASE_URL || "/";
    const jsonUrl = `${base}methodology/json/warmups.json`;
    const j = await tryLoadJson<T[]>(jsonUrl);
    if (Array.isArray(j) && j.length) return { rows: j, source: "json" };
    const csv = await loadCsv<T>(`${base}methodology/extraction/warmups.csv`).catch(() => [] as T[]);
    return { rows: Array.isArray(csv) ? (csv as T[]) : [], source: "csv" };
}

// Supplemental Library
export async function loadSupplementalLibrary<T extends Record<string, any>>(): Promise<LoadResult<T>> {
    const base = import.meta.env.BASE_URL || "/";
    const jsonUrl = `${base}methodology/json/supplemental.json`;
    const j = await tryLoadJson<T[]>(jsonUrl);
    if (Array.isArray(j) && j.length) return { rows: j, source: "json" };
    const csv = await loadCsv<T>(`${base}methodology/extraction/supplemental.csv`).catch(() => [] as T[]);
    return { rows: Array.isArray(csv) ? (csv as T[]) : [], source: "csv" };
}

// Conditioning Library
export async function loadConditioningLibrary<T extends Record<string, any>>(): Promise<LoadResult<T>> {
    const base = import.meta.env.BASE_URL || "/";
    const jsonUrl = `${base}methodology/json/conditioning.json`;
    const j = await tryLoadJson<T[]>(jsonUrl);
    if (Array.isArray(j) && j.length) return { rows: j, source: "json" };
    const csv = await loadCsv<T>(`${base}methodology/extraction/conditioning.csv`).catch(() => [] as T[]);
    return { rows: Array.isArray(csv) ? (csv as T[]) : [], source: "csv" };
}

// Jumps & Throws Library
export async function loadJumpsThrowsLibrary<T extends Record<string, any>>(): Promise<LoadResult<T>> {
    const base = import.meta.env.BASE_URL || "/";
    const jsonUrl = `${base}methodology/json/jumps_throws.json`;
    const j = await tryLoadJson<T[]>(jsonUrl);
    if (Array.isArray(j) && j.length) return { rows: j, source: "json" };
    const csv = await loadCsv<T>(`${base}methodology/extraction/jumps_throws.csv`).catch(() => [] as T[]);
    return { rows: Array.isArray(csv) ? (csv as T[]) : [], source: "csv" };
}

// Special Rules Library
export async function loadSpecialRulesLibrary<T extends Record<string, any>>(): Promise<LoadResult<T>> {
    const base = import.meta.env.BASE_URL || "/";
    const jsonUrl = `${base}methodology/json/special_rules.json`;
    const j = await tryLoadJson<T[]>(jsonUrl);
    if (Array.isArray(j) && j.length) return { rows: j, source: "json" };
    const csv = await loadCsv<T>(`${base}methodology/extraction/special_rules.csv`).catch(() => [] as T[]);
    return { rows: Array.isArray(csv) ? (csv as T[]) : [], source: "csv" };
}

// Templates Library (merged master + additions)
export async function loadTemplatesLibrary<RowT extends Record<string, any>>(): Promise<LoadResult<RowT>> {
    const base = import.meta.env.BASE_URL || "/";

    // Try JSON mirrors first
    const masterJsonUrl = `${base}methodology/json/templates_master.json`;
    const additionsJsonUrl = `${base}methodology/json/templates_additions.json`;
    const [jm, ja] = await Promise.all([
        tryLoadJson<RowT[]>(masterJsonUrl),
        tryLoadJson<RowT[]>(additionsJsonUrl)
    ]);
    if (Array.isArray(jm) || Array.isArray(ja)) {
        const master = Array.isArray(jm) ? jm! : [];
        const adds = Array.isArray(ja) ? ja! : [];
        const idFrom = (row: RowT) => {
            const maybeId = (row as any).id;
            if (maybeId) return String(maybeId);
            const name = String((row as any)["Template Name"] || (row as any).display_name || "").toLowerCase().trim();
            return name.replace(/^(jack sh\*t|jack shit)$/i, "jackshit").replace(/[^a-z0-9]+/g, "-");
        };
        const byId = new Map<string, RowT>();
        master.forEach((r) => { const id = idFrom(r); if (id) byId.set(id, r); });
        adds.forEach((r) => { const id = idFrom(r); if (id) byId.set(id, r); });
        return { rows: Array.from(byId.values()), source: "json" };
    }

    // Fallback to CSV merge (mirrors existing UI logic)
    const MASTER_URL = `${base}methodology/extraction/templates_master.csv`;
    const ADDITIONS_URL = `${base}methodology/extraction/templates_additions.csv`;
    const [masterCsv, additionsCsv] = await Promise.all([
        loadCsv<RowT>(MASTER_URL).catch(() => [] as RowT[]),
        loadCsv<RowT>(ADDITIONS_URL).catch(() => [] as RowT[])
    ]);

    const cleanMaster = (masterCsv as RowT[]).filter((r) => r && ((r as any)["Template Name"] || "").toString().trim().length > 0);
    const mappedAdds = (additionsCsv as any[]).map((r: any) => ({
        "Template Name": (r.display_name || "").trim(),
        "Book": (r.source_book || "").trim(),
        "Page": (r.source_pages || "").trim(),
        "Main Work": (r.core_scheme || "").trim(),
        "Supplemental": (r.supplemental || "").trim(),
        "Assistance": (r.assistance_guideline || "").trim(),
        "Conditioning": (r.conditioning_guideline || "").trim(),
        "Leader/Anchor": (r.leader_anchor || "").trim(),
        "Notes": (r.notes || "").trim(),
        __id: (r.id || "").trim(),
        __source_book: (r.source_book || "").trim(),
        __source_pages: (r.source_pages || "").trim(),
    })) as unknown as RowT[];

    const idFrom = (row: RowT) => {
        if ((row as any).__id) return String((row as any).__id);
        const name = String((row as any)["Template Name"] || (row as any).display_name || "").toLowerCase().trim();
        return name
            .replace(/^(jack sh\*t|jack shit)$/i, 'jackshit')
            .replace(/[^a-z0-9]+/g, '-');
    };

    const byId = new Map<string, RowT>();
    cleanMaster.forEach((r) => { const id = idFrom(r); if (id) byId.set(id, r); });
    mappedAdds.forEach((r) => { const id = idFrom(r); if (!id) return; byId.set(id, r); });
    const merged = Array.from(byId.values());
    return { rows: merged, source: "csv" };
}
