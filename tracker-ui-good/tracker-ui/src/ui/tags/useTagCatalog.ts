import { useEffect, useMemo, useState } from "react";
import { loadCsv } from "@/lib/loadCsv";

export type TagMeta = { key: string; group: string; label: string; description?: string };

export function useTagCatalog() {
    const [rows, setRows] = useState<TagMeta[]>([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await loadCsv<TagMeta>("methodology/extraction/tag_catalog.csv");
                if (!cancelled) setRows((data || []).filter((t) => t.key));
            } catch {
                if (!cancelled) setRows([]);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const index = useMemo(() => {
        const byKey = new Map<string, TagMeta>();
        for (const r of rows) byKey.set(r.key, r);
        return byKey;
    }, [rows]);

    function getTagMeta(key: string): TagMeta {
        const m = index.get(key);
        if (m) return m;
        // Fallback for unknown keys
        return { key, label: key, group: "Meta" };
    }

    function listAllTags(): TagMeta[] {
        return [...rows].sort((a, b) => (a.group === b.group ? a.label.localeCompare(b.label) : a.group.localeCompare(b.group)));
    }

    return { getTagMeta, listAllTags };
}
