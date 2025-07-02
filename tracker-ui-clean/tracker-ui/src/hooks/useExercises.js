import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [exerciseHistory, setExerciseHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all exercises from database
  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setExercises(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching exercises:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new exercise
  const createExercise = async (exerciseData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('exercises')
        .insert([{
          name: exerciseData.name,
          muscle_group: exerciseData.muscleGroup,
          category: exerciseData.category || 'user_created',
          equipment: exerciseData.equipment || 'bodyweight',
          difficulty: exerciseData.difficulty || 'intermediate',
          instructions: exerciseData.instructions || '',
          is_custom: true
        }])
        .select()
        .single();

      if (error) throw error;
      
      setExercises(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating exercise:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing exercise
  const updateExercise = async (exerciseId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', exerciseId)
        .select()
        .single();

      if (error) throw error;
      
      setExercises(prev => prev.map(exercise => 
        exercise.id === exerciseId ? { ...exercise, ...data } : exercise
      ));
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating exercise:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an exercise
  const deleteExercise = async (exerciseId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if exercise has been used in workouts
      const { data: usageCheck } = await supabase
        .from('workout_sets')
        .select('id')
        .eq('exercise_id', exerciseId)
        .limit(1);

      if (usageCheck && usageCheck.length > 0) {
        throw new Error('Cannot delete exercise that has been used in workouts. Archive it instead.');
      }
      
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);

      if (error) throw error;
      
      setExercises(prev => prev.filter(exercise => exercise.id !== exerciseId));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting exercise:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Archive/unarchive an exercise
  const archiveExercise = async (exerciseId, archived = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('exercises')
        .update({ archived })
        .eq('id', exerciseId)
        .select()
        .single();

      if (error) throw error;
      
      setExercises(prev => prev.map(exercise => 
        exercise.id === exerciseId ? { ...exercise, archived } : exercise
      ));
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error archiving exercise:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get exercise history for a specific exercise
  const fetchExerciseHistory = async (exerciseName, userId, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('workout_sets')
        .select(`
          *,
          workout_sessions!inner (
            user_id,
            started_at,
            session_name
          )
        `)
        .eq('exercise_name', exerciseName)
        .eq('workout_sessions.user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      setExerciseHistory(prev => ({
        ...prev,
        [exerciseName]: data || []
      }));
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching exercise history:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get exercise statistics
  const getExerciseStats = (exerciseName) => {
    const history = exerciseHistory[exerciseName];
    if (!history || history.length === 0) return null;
    
    const weights = history.map(set => set.weight).filter(w => w > 0);
    const volumes = history.map(set => set.weight * set.reps);
    const rirs = history.map(set => set.rir).filter(r => r !== null);
    
    return {
      totalSets: history.length,
      maxWeight: weights.length > 0 ? Math.max(...weights) : 0,
      avgWeight: weights.length > 0 ? weights.reduce((sum, w) => sum + w, 0) / weights.length : 0,
      totalVolume: volumes.reduce((sum, v) => sum + v, 0),
      avgVolume: volumes.length > 0 ? volumes.reduce((sum, v) => sum + v, 0) / volumes.length : 0,
      avgRIR: rirs.length > 0 ? rirs.reduce((sum, r) => sum + r, 0) / rirs.length : null,
      lastPerformed: history[0]?.completed_at,
      progressTrend: calculateProgressTrend(history)
    };
  };

  // Calculate exercise progress trend
  const calculateProgressTrend = (history) => {
    if (history.length < 2) return 'insufficient_data';
    
    // Compare recent sessions vs older sessions
    const recentSessions = history.slice(0, Math.ceil(history.length / 3));
    const olderSessions = history.slice(-Math.ceil(history.length / 3));
    
    const recentAvgVolume = recentSessions.reduce((sum, set) => 
      sum + (set.weight * set.reps), 0) / recentSessions.length;
    const olderAvgVolume = olderSessions.reduce((sum, set) => 
      sum + (set.weight * set.reps), 0) / olderSessions.length;
    
    const volumeChange = (recentAvgVolume - olderAvgVolume) / olderAvgVolume;
    
    if (volumeChange > 0.1) return 'improving';
    if (volumeChange < -0.1) return 'declining';
    return 'stable';
  };

  // Get exercises by muscle group
  const getExercisesByMuscle = (muscleGroup) => {
    return exercises.filter(exercise => 
      exercise.muscle_group === muscleGroup && !exercise.archived
    );
  };

  // Search exercises
  const searchExercises = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(lowercaseQuery) ||
      exercise.muscle_group.toLowerCase().includes(lowercaseQuery) ||
      exercise.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Get recommended weight for next set
  const getRecommendedWeight = (exerciseName, targetRIR = 2) => {
    const history = exerciseHistory[exerciseName];
    if (!history || history.length === 0) return null;
    
    // Find recent sets with similar RIR
    const recentSets = history
      .slice(0, 10) // Last 10 sets
      .filter(set => Math.abs(set.rir - targetRIR) <= 1);
    
    if (recentSets.length === 0) {
      // Fallback to any recent sets
      const fallbackSets = history.slice(0, 5);
      if (fallbackSets.length === 0) return null;
      
      const avgWeight = fallbackSets.reduce((sum, set) => sum + set.weight, 0) / fallbackSets.length;
      return Math.round(avgWeight * 0.95); // Conservative estimate
    }
    
    const avgWeight = recentSets.reduce((sum, set) => sum + set.weight, 0) / recentSets.length;
    return Math.round(avgWeight);
  };

  // Load initial data
  useEffect(() => {
    fetchExercises();
  }, []);

  return {
    exercises,
    exerciseHistory,
    loading,
    error,
    fetchExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    archiveExercise,
    fetchExerciseHistory,
    getExerciseStats,
    getExercisesByMuscle,
    searchExercises,
    getRecommendedWeight
  };
}
