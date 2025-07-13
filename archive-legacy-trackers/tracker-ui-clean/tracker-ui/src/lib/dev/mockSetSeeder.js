export function seedMockSets(state) {
  const muscles = ["chest", "back", "legs", "shoulders", "arms"]; // Match context naming
  const today = new Date();
  const weekIdx = state?.state?.currentMesocycle?.currentWeek || 1;
  const mesocycleId = 'mock-mesocycle-2025';
  
  const loggedSets = [];
  const loggedSessions = [];
  
  // Create sessions for the current week (and some previous weeks)
  for (let week = 1; week <= weekIdx; week++) {
    const sessionsThisWeek = week === weekIdx ? 3 : 4; // Current week might be incomplete
    
    for (let session = 1; session <= sessionsThisWeek; session++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(sessionDate.getDate() - ((weekIdx - week) * 7) - (4 - session));
      
      const sessionId = `session-w${week}-s${session}`;
      
      // Add session record
      loggedSessions.push({
        id: sessionId,
        week: week,
        date: sessionDate.toISOString(),
        mesocycleId: mesocycleId,
        completed: true,
        duration: 45 + Math.random() * 30, // 45-75 minutes
        exercises: muscles.length
      });
      
      // Add sets for this session
      muscles.forEach((muscle, muscleIdx) => {
        // 3 sets per muscle per session
        for (let setNum = 1; setNum <= 3; setNum++) {
          loggedSets.push({
            id: crypto.randomUUID(),
            muscle: muscle,
            load: 135 + muscleIdx * 10 + week * 5, // Progressive overload
            reps: 8 + Math.floor(Math.random() * 5), // 8-12 reps
            rir: Math.max(0, 3 - setNum), // Decreasing RIR through sets
            week: week,
            date: sessionDate.toISOString(),
            mesocycleId: mesocycleId,
            sessionId: sessionId,
          });
        }
      });
    }
  }
  
  // Volume landmarks for MRV calculations - match context structure
  const volumeLandmarks = {};
  muscles.forEach(m => {
    volumeLandmarks[m] = {
      mv: 8,
      mev: 12,
      mav: 16,
      mrv: 20
    };
  });
  
  // Mock MRV table for the deload logic
  const mrvTable = {};
  muscles.forEach(m => {
    mrvTable[m] = 20;
  });
  
  // Mock cycle data to match selector expectations
  const cycleData = {
    id: mesocycleId,
    goal: 'Hypertrophy',
    specializations: ['chest', 'arms'], // Use lowercase
    currentWeek: weekIdx,
    weeks: 6,
    currentDay: 3,
    deloadWeek: 6,
    sessionsPerWeek: 4,
    startDate: new Date(Date.now() - (weekIdx - 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + (6 - weekIdx) * 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  // Mock mesocycle to update the existing structure
  const currentMesocycle = {
    ...state?.state?.currentMesocycle,
    length: 6,
    currentWeek: weekIdx,
    startDate: cycleData.startDate,
    endDate: cycleData.endDate,
    phase: 'accumulation',
    trainingGoal: 'Hypertrophy'
  };
  
  const mockData = {
    loggedSets,
    loggedSessions, // Add session tracking
    volumeLandmarks,
    mrvTable,
    fatigueScore: 45,
    cycleData,
    currentMesocycle
  };
  
  console.log('Seeding mock data:', {
    sets: loggedSets.length,
    sessions: loggedSessions.length,
    muscles: muscles,
    week: weekIdx,
    cycle: cycleData
  });
  
  // Use the proper action instead of direct mutation
  state.seedMockData(mockData);
}
