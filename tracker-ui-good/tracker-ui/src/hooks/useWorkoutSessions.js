import { useState } from 'react';
import { supabase } from '../lib/api/supabaseClient';
import { useTrainingState } from '../context/trainingStateContext';

export function useWorkoutSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state } = useTrainingState();

  // Fetch all workout sessions for the current user
  const fetchSessions = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_sets (
            id,
            exercise_name,
            muscle_group,
            weight,
            reps,
            rir,
            completed_at,
            set_number
          )
        `)
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

      if (error) throw error;

      setSessions(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching workout sessions:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new workout session
  const createSession = async (sessionData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{
          user_id: sessionData.userId,
          session_name: sessionData.sessionName,
          mesocycle_week: sessionData.mesocycleWeek || state.currentMesocycle.currentWeek,
          planned_exercises: sessionData.plannedExercises || [],
          started_at: new Date().toISOString(),
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setSessions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating workout session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing workout session
  const updateSession = async (sessionId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('workout_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      setSessions(prev => prev.map(session =>
        session.id === sessionId ? { ...session, ...data } : session
      ));

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating workout session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Finish a workout session
  const finishSession = async (sessionId, completedData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_volume: completedData.totalVolume,
          total_sets: completedData.totalSets,
          duration_minutes: completedData.durationMinutes,
          notes: completedData.notes || ''
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      setSessions(prev => prev.map(session =>
        session.id === sessionId ? { ...session, ...data } : session
      ));

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error finishing workout session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a workout session
  const deleteSession = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      // Delete associated sets first
      await supabase
        .from('workout_sets')
        .delete()
        .eq('session_id', sessionId);

      // Delete the session
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(session => session.id !== sessionId));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting workout session:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Log a set within a session
  const logSet = async (sessionId, setData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('workout_sets')
        .insert([{
          session_id: sessionId,
          exercise_name: setData.exerciseName,
          muscle_group: setData.muscleGroup,
          weight: setData.weight,
          reps: setData.reps,
          rir: setData.rir,
          set_number: setData.setNumber,
          completed_at: new Date().toISOString(),
          notes: setData.notes || ''
        }])
        .select()
        .single();

      if (error) throw error;

      // Update the session with the new set
      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            workout_sets: [...(session.workout_sets || []), data]
          };
        }
        return session;
      }));

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error logging set:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Undo the last set in a session
  const undoLastSet = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      // Find the most recent set for this session
      const { data: lastSet, error: fetchError } = await supabase
        .from('workout_sets')
        .select('id')
        .eq('session_id', sessionId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) throw fetchError;

      // Delete the last set
      const { error: deleteError } = await supabase
        .from('workout_sets')
        .delete()
        .eq('id', lastSet.id);

      if (deleteError) throw deleteError;

      // Update local state
      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            workout_sets: session.workout_sets?.filter(set => set.id !== lastSet.id) || []
          };
        }
        return session;
      }));

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error undoing last set:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get session statistics
  const getSessionStats = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session || !session.workout_sets) return null;

    const sets = session.workout_sets;
    const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    const totalSets = sets.length;
    const exerciseCount = new Set(sets.map(set => set.exercise_name)).size;
    const avgRIR = sets.length > 0 ? sets.reduce((sum, set) => sum + set.rir, 0) / sets.length : 0;

    return {
      totalVolume,
      totalSets,
      exerciseCount,
      avgRIR: Math.round(avgRIR * 10) / 10,
      muscleGroups: [...new Set(sets.map(set => set.muscle_group))]
    };
  };

  // Get weekly volume by muscle group
  const getWeeklyVolume = (weekNumber) => {
    const weekSessions = sessions.filter(session =>
      session.mesocycle_week === weekNumber && session.status === 'completed'
    );

    const volumeByMuscle = {};

    weekSessions.forEach(session => {
      session.workout_sets?.forEach(set => {
        const muscle = set.muscle_group;
        const volume = set.weight * set.reps;
        volumeByMuscle[muscle] = (volumeByMuscle[muscle] || 0) + volume;
      });
    });

    return volumeByMuscle;
  };

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
    updateSession,
    finishSession,
    deleteSession,
    logSet,
    undoLastSet,
    getSessionStats,
    getWeeklyVolume
  };
}
