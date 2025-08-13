// src/contexts/SettingsContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getUnit as getStoredUnit, setUnit as setStoredUnit, getIncrementForUnit } from '../lib/fiveThreeOne/math';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
    const [unit, setUnit] = useState(getStoredUnit()); // 'lb' | 'kg'
    const [useAutoIncrement, setUseAutoIncrement] = useState(true);
    const [customIncrement, setCustomIncrement] = useState(null); // e.g., 1, 2.5

    useEffect(() => { setStoredUnit(unit); }, [unit]);

    const roundingIncrement = useMemo(() => {
        if (useAutoIncrement) return getIncrementForUnit();
        const v = Number(customIncrement || 0);
        return v > 0 ? v : getIncrementForUnit();
    }, [useAutoIncrement, customIncrement, unit]);

    const value = useMemo(() => ({
        unit,
        setUnit,
        useAutoIncrement,
        setUseAutoIncrement,
        customIncrement,
        setCustomIncrement,
        roundingIncrement,
    }), [unit, useAutoIncrement, customIncrement, roundingIncrement]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
    return ctx;
}
