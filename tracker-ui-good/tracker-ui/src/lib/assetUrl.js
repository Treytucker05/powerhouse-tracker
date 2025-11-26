export function assetUrl(p) {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '/');
    const rel = String(p).replace(/^\/+/, '');
    return base + rel;
}
