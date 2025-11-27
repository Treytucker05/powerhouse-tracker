import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useWorkoutSessions() {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    let ignore = false;
    supabase
      .from("workout_sessions")
      .select("*")
      .order("start_time", { ascending: false })
      .then(({ data, error }) => {
        if (!ignore && !error) setSessions(data ?? []);
      });
    return () => { ignore = true };
  }, []);
  return sessions;
}
