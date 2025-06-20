import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Fetches weekly volume data from Supabase.
 * Expects a view/table: `weekly_volume`
 *   { muscle: text, volume: numeric, week: integer }
 */
export default function useWeeklyVolume() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    
    supabase
      .from("weekly_volume")
      .select("*")
      .order("week", { ascending: true })
      .then(({ data, error }) => {
        if (!ignore && !error) {
          setData(data ?? []);
        }
        setLoading(false);
      });
    return () => { ignore = true };
  }, []);
  
  return { data, loading };
}
