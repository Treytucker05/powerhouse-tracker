// Cardio / Conditioning MVP templates
export const CardioTemplates = {
    LISS30: { id: 'LISS30', type: 'LISS', minutes: 30, intensity: 'Zone2' },
    LISS45: { id: 'LISS45', type: 'LISS', minutes: 45, intensity: 'Zone2' },
    HIIT10x1: { id: 'HIIT10x1', type: 'HIIT', work: '1:00', rest: '1:00', rounds: 10 },
    Tempo20: { id: 'Tempo20', type: 'Tempo', minutes: 20 }
};

export function pickCardio(daysPerWeek, state) {
    if (state?.cardioMode && CardioTemplates[state.cardioMode]) return state.cardioMode;
    return daysPerWeek >= 4 ? 'LISS30' : 'LISS45';
}

export default { CardioTemplates, pickCardio };
