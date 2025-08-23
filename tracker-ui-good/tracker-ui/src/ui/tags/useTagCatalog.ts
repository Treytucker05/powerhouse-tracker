import { useEffect, useMemo, useState } from "react";
import { TAG_GROUP_STYLES } from "./colors";
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

  function getTagMeta(key: string) {
    return index.get(key);
  }

  function getTagStyle(key: string) {
    const group = index.get(key)?.group || "default";
    return TAG_GROUP_STYLES[group] ?? TAG_GROUP_STYLES.default;
  }

  function listAllTags() {
    return [...rows].sort((a, b) => (a.group === b.group ? a.label.localeCompare(b.label) : a.group.localeCompare(b.group)));
  }

  return { getTagMeta, getTagStyle, listAllTags };
}
