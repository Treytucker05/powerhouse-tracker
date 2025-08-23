import Papa from "papaparse";

// Build a BASE_URL-safe path. Accepts paths starting with "/" or relative.
function withBase(url: string): string {
    try {
        const base = (import.meta as any)?.env?.BASE_URL || "/";
        // If already absolute http(s) or starts with base, return as-is
        if (/^https?:\/\//i.test(url)) return url;
        const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
        const trimmedUrl = url.startsWith('/') ? url : `/${url}`;
        if (trimmedUrl.startsWith(base) || trimmedUrl.startsWith(trimmedBase)) return url;
        return `${trimmedBase}${trimmedUrl}`;
    } catch {
        return url;
    }
}

export async function loadCsv<T = any>(path: string): Promise<T[]> {
    const src = withBase(path);
    return new Promise((resolve, reject) => {
        Papa.parse(src, {
            header: true,
            download: true,
            complete: (results) => resolve(results.data as T[]),
            error: (err) => reject(err),
        });
    });
}
