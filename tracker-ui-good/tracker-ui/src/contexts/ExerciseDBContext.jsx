// src/contexts/ExerciseDBContext.jsx
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { loadExerciseDatabase, getExercisesByCategory, getExercises, getExercise } from '../data/exerciseDatabase.js';

const ExerciseDBContext = createContext({ loaded: false });

export function ExerciseDBProvider({ children }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [stamp, setStamp] = useState(0);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                await loadExerciseDatabase();
                if (active) {
                    setLoaded(true);
                    setStamp(Date.now());
                }
            } catch (e) {
                if (active) {
                    setError(e);
                }
            }
        })();
        return () => { active = false; };
    }, []);

    const categoriesMap = useMemo(() => loaded ? getExercisesByCategory() : {}, [loaded, stamp]);
    const flat = useMemo(() => loaded ? getExercises() : [], [loaded, stamp]);
    const byName = useMemo(() => {
        const map = {};
        flat.forEach(r => { map[r.exercise.toLowerCase()] = r; });
        return map;
    }, [flat]);

    const value = useMemo(() => ({ loaded, error, categoriesMap, exercises: flat, getRow: (name) => getExercise(name) || byName[name?.toLowerCase()] || null }), [loaded, error, categoriesMap, flat, byName]);

    return (
        <ExerciseDBContext.Provider value={value}>{children}</ExerciseDBContext.Provider>
    );
}

export function useExerciseDB() {
    return useContext(ExerciseDBContext);
}

export default ExerciseDBContext;
