import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Fetches weekly volume data from Supabase with RLS support.
 * Expects a table: `weekly_volume`
 *   { muscle: text, volume: numeric, week: integer, user_id: uuid }
 */
export default function useWeeklyVolume() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    let ignore = false;
    
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    supabase
      .from("weekly_volume")
      .select("*")
      .eq("user_id", user.id)
      .order("week", { ascending: true })
      .then(({ data, error }) => {
        if (!ignore && !error) {
          setData(data ?? []);
        }
        if (error) {
          console.error("Error fetching weekly volume:", error);
        }
        setLoading(false);
      });
    return () => { ignore = true };
  }, [user]);

  // Helper function to insert new weekly volume data
  const insertWeeklyVolume = async (volumeData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("weekly_volume")
      .insert({
        ...volumeData,
        user_id: user.id
      })
      .select();

    if (error) {
      console.error("Error inserting weekly volume:", error);
      throw error;
    }

    return data;
  };
  
  return { data, loading, user, insertWeeklyVolume };
}
