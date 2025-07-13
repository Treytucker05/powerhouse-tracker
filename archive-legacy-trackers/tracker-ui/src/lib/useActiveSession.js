import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

/**
 * Hook to manage active workout session state
 */
export default function useActiveSession() {
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for existing active session on mount
  useEffect(() => {
    checkForActiveSession();
  }, []);

  const checkForActiveSession = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .is('end_time', null)
        .order('start_time', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setActiveSession(data[0]);
      }
    } catch (error) {
      console.error('Error checking for active session:', error);
    }
  };

  const startSession = async (notes = '') => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{
          start_time: new Date().toISOString(),
          notes
        }])
        .select()
        .single();

      if (error) throw error;
      
      setActiveSession(data);
      return data;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const finishSession = async (notes = '') => {
    if (!activeSession) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_sessions')
        .update({
          end_time: new Date().toISOString(),
          notes: notes || activeSession.notes
        })
        .eq('id', activeSession.id)
        .select()
        .single();

      if (error) throw error;
      
      setActiveSession(null);
      return data;
    } catch (error) {
      console.error('Error finishing session:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addSet = async (setData) => {
    if (!activeSession) throw new Error('No active session');

    try {
      const { data, error } = await supabase
        .from('workout_sets')
        .insert([{
          session_id: activeSession.id,
          ...setData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding set:', error);
      throw error;
    }
  };

  return {
    activeSession,
    loading,
    startSession,
    finishSession,
    addSet,
    checkForActiveSession
  };
}
