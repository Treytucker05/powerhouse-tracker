import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type BookMode = "recommend" | "enforce";
type Settings = { bookMode: BookMode; setBookMode: (m: BookMode) => void; };

const SettingsCtx = createContext<Settings | null>(null);
const KEY = "settings.v1";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [bookMode, setBookMode] = useState<BookMode>(() => {
        try { return (JSON.parse(sessionStorage.getItem(KEY) || "{}").bookMode as BookMode) || "recommend"; }
        catch { return "recommend"; }
    });
    useEffect(() => { sessionStorage.setItem(KEY, JSON.stringify({ bookMode })); }, [bookMode]);

    const value = useMemo(() => ({ bookMode, setBookMode }), [bookMode]);
    return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}
export function useSettings() {
    const ctx = useContext(SettingsCtx);
    if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
    return ctx;
}
