import React, { createContext, useContext, useState } from 'react';
type BuilderState = Record<string, any>;
const Ctx = createContext<{state:BuilderState; setState:(u:Partial<BuilderState>)=>void} | null>(null);
export function BuilderStateProvider({ children }: { children: React.ReactNode }) {
    const [state, set] = useState<BuilderState>({});
    const setState = (u: Partial<BuilderState>) => set(prev => ({ ...prev, ...u }));
    return <Ctx.Provider value={{ state, setState }}>{children}</Ctx.Provider>;
}
export function useBuilder() {
    const v = useContext(Ctx);
    if (!v) throw new Error('useBuilder must be used within BuilderStateProvider');
    return v;
}
