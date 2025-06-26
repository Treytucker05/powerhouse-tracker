/* Pure functions — no React imports */
export const getCurrentCycle = (state) => {
  return state?.cycleData || {
    goal: 'Hypertrophy',
    specializations: [],
    currentWeek: 1,
    weeks: 6,
    currentDay: 1
  };
};

export const getWeeklySetTonnageByMuscle = (state) => {
  const weekIdx = state?.cycleData?.currentWeek || 1;
  const sets = {};
  const tonnage = {};
  
  if (state?.loggedSets) {
    state.loggedSets
      .filter((s) => s.week === weekIdx)
      .forEach(({ muscle, load, reps }) => {
        sets[muscle] = (sets[muscle] || 0) + 1;
        tonnage[muscle] = (tonnage[muscle] || 0) + load * reps; // lbs only for now
      });
  }
  
  return { sets, tonnage };
};

export const getAggregateVolume = (byMuscle) => {
  const setsValues = Object.values(byMuscle?.sets || {});
  const tonnageValues = Object.values(byMuscle?.tonnage || {});
  
  const totalSets = setsValues.length > 0 ? setsValues.reduce((a, b) => a + b, 0) : 0;
  const totalTon = tonnageValues.length > 0 ? tonnageValues.reduce((a, b) => a + b, 0) : 0;
  
  return { totalSets, totalTon };
};

// Calendar Progress
export const getDaysToDeload = (state) => {
  const cycle = state?.cycleData;
  if (!cycle) return 0;
  
  const deloadWeek = cycle.deloadWeek || cycle.weeks;
  const currentWeek = cycle.currentWeek || 1;
  const daysPerWeek = 7;
  
  return Math.max(0, (deloadWeek - currentWeek) * daysPerWeek);
};

// Extended Aggregate Volume - Monthly
export const getMonthlyAggregates = (state) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cycle = state?.cycleData;
  
  if (!state?.loggedSets) return { sets: 0, tonnage: 0, sessions: 0, plannedSessions: 0 };
  
  const recentSets = state.loggedSets.filter(set => {
    const setDate = new Date(set.date || Date.now());
    return setDate >= thirtyDaysAgo;
  });
  
  const sets = recentSets.length;
  const tonnage = recentSets.reduce((sum, set) => sum + (set.load * set.reps), 0);
  const sessions = new Set(recentSets.map(set => set.sessionId)).size;
  
  // Estimate planned sessions (4 sessions/week * ~4.3 weeks/month)
  const plannedSessions = Math.round((cycle?.sessionsPerWeek || 4) * 4.3);
  
  return { sets, tonnage, sessions, plannedSessions };
};

// Extended Aggregate Volume - Program (Mesocycle)
export const getProgramAggregates = (state) => {
  const cycle = state?.cycleData;
  if (!cycle || !state?.loggedSets) return { sets: 0, tonnage: 0, sessions: 0, plannedSessions: 0 };
  
  const programSets = state.loggedSets.filter(set => set.mesocycleId === cycle.id);
  
  const sets = programSets.length;
  const tonnage = programSets.reduce((sum, set) => sum + (set.load * set.reps), 0);
  const sessions = new Set(programSets.map(set => set.sessionId)).size;
  
  // Calculate planned sessions for entire program
  const plannedSessions = (cycle.weeks || 6) * (cycle.sessionsPerWeek || 4);
  
  return { sets, tonnage, sessions, plannedSessions };
};

// Session Compliance - Current Week
export const getSessionCompliance = (state) => {
  const cycle = state?.cycleData;
  if (!cycle) return { completed: 0, scheduled: 0, percentage: 0 };
  
  const currentWeek = cycle.currentWeek || 1;
  const scheduledSessions = cycle.sessionsPerWeek || 4;
  
  if (!state?.loggedSessions) return { completed: 0, scheduled: scheduledSessions, percentage: 0 };
  
  const completedThisWeek = state.loggedSessions.filter(session => 
    session.week === currentWeek && session.completed
  ).length;
  
  const percentage = scheduledSessions > 0 ? Math.round((completedThisWeek / scheduledSessions) * 100) : 0;
  
  return { 
    completed: completedThisWeek, 
    scheduled: scheduledSessions, 
    percentage 
  };
};

// Mesocycle-to-date RIR
export const getMesocycleRIR = (state) => {
  const cycle = state?.cycleData;
  if (!cycle || !state?.loggedSets) return null;
  
  const mesocycleSets = state.loggedSets.filter(set => 
    set.mesocycleId === cycle.id && typeof set.rir === 'number'
  );
  
  if (mesocycleSets.length === 0) return null;
  
  const totalRIR = mesocycleSets.reduce((sum, set) => sum + set.rir, 0);
  return (totalRIR / mesocycleSets.length).toFixed(1);
};

// Weekly RIR (for comparison)
export const getWeeklyRIR = (state) => {
  const cycle = state?.cycleData;
  if (!cycle || !state?.loggedSets) return null;
  
  const currentWeek = cycle.currentWeek || 1;
  const weekSets = state.loggedSets.filter(set => 
    set.week === currentWeek && typeof set.rir === 'number'
  );
  
  if (weekSets.length === 0) return null;
  
  const totalRIR = weekSets.reduce((sum, set) => sum + set.rir, 0);
  return (totalRIR / weekSets.length).toFixed(1);
};

// Get current day name
export const getCurrentDayName = (state) => {
  const cycle = state?.cycleData;
  if (!cycle) return '';
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  return dayNames[today.getDay()];
};

// Check if any muscle is approaching MRV
export const checkMuscleAtMRV = (state) => {
  const vol = getWeeklySetTonnageByMuscle(state);
  const volumeLandmarks = state?.volumeLandmarks || {};
  
  for (const muscle of Object.keys(vol.sets)) {
    const currentSets = vol.sets[muscle];
    const mrv = volumeLandmarks[muscle]?.mrv || 20; // Default MRV
    const mrvPercentage = (currentSets / mrv) * 100;
    
    if (mrvPercentage >= 90) {
      return { muscle, percentage: Math.round(mrvPercentage) };
    }
  }
  
  return null;
};
