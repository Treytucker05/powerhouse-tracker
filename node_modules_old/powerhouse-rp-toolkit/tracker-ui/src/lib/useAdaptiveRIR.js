import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Fetches adaptive RIR recommendations (latest per muscle).
 * Expects a Supabase view/table: `rir_recommendations`
 *   { muscle: text, recommended_rir: numeric, confidence: numeric }
 */
export default function useAdaptiveRIR() {
  const [data, setData] = useState([]);
  useEffect(() => {
    let ignore = false;
    supabase
      .from("rir_recommendations")
      .select("*")
      .then(({ data, error }) => {
        if (!ignore && !error) setData(data ?? []);
      });
    return () => { ignore = true };
  }, []);
  return data;
}
