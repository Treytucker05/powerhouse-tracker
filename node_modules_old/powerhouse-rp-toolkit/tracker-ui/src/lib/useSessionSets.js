import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useSessionSets(sessionId) {
  const [sets, setSets] = useState([]);
  useEffect(() => {
    if (!sessionId) return;
    let ignore = false;
    supabase
      .from("workout_sets")
      .select("*")
      .eq("session_id", sessionId)
      .order("set_number")
      .then(({ data, error }) => {
        if (!ignore && !error) setSets(data ?? []);
      });
    return () => { ignore = true };
  }, [sessionId]);
  return sets;
}
