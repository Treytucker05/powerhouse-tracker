import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type EquipmentId = string;
type EquipmentState = {
    selected: EquipmentId[];
    toggle: (id: EquipmentId) => void;
    setAll: (ids: EquipmentId[]) => void;
    clear: () => void;
};

const KEY = "equipment.v1";
const EquipmentCtx = createContext<EquipmentState | null>(null);

export function EquipmentProvider({ children }: { children: React.ReactNode }) {
    const [selected, setSelected] = useState<EquipmentId[]>(() => {
        try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
    });
    useEffect(() => { localStorage.setItem(KEY, JSON.stringify(selected)); }, [selected]);

    const value = useMemo(() => ({
        selected,
        toggle: (id: EquipmentId) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]),
        setAll: (ids: EquipmentId[]) => setSelected(Array.from(new Set(ids))),
        clear: () => setSelected([])
    }), [selected]);

    return <EquipmentCtx.Provider value={value}>{children}</EquipmentCtx.Provider>;
}

export function useEquipment() {
    const ctx = useContext(EquipmentCtx);
    if (!ctx) throw new Error("useEquipment must be used within EquipmentProvider");
    return ctx;
}
