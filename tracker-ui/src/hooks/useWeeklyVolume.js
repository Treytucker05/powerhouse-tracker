import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/trainingStateContext";

export default function useWeeklyVolume() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    setLoading(true);

    supabase
      .from("weekly_volume")
      .select("*")
      .eq("user_id", user.id)
      .order("week", { ascending: true })
      .then(({ data, error }) => {
        if (isMounted) {
          if (error) {
            console.error("weekly_volume error:", error);
            setData([]);
          } else {
            setData(data);
          }
          setLoading(false);
        }
      });

    return () => (isMounted = false);
  }, [user]);

  return { data, loading };
}
