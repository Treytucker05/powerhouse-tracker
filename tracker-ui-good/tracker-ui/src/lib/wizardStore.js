// src/lib/wizardStore.js
const KEY = 'ph_531_wizard_v1';

export function loadWizardState() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveWizardState(state) {
    try {
        localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
        // ignore quota errors
    }
}

export function clearWizardState() {
    try {
        localStorage.removeItem(KEY);
    } catch {
        // ignore
    }
}
