import { useState } from "react";
import useWorkoutSessions from "../lib/useWorkoutSessions";
import useSessionSets from "../lib/useSessionSets";
import Drawer from "../components/Drawer";

export default function Sessions() {
  const sessions = useWorkoutSessions();
  const [selected, setSelected] = useState(null);
  const sets = useSessionSets(selected?.id);

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">Workout Sessions</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.id} className="border-t hover:bg-slate-50 cursor-pointer"
                onClick={() => setSelected(s)}>
              <td className="p-2">{new Date(s.start_time).toLocaleString()}</td>
              <td className="p-2">{s.end_time ? new Date(s.end_time).toLocaleString() : "—"}</td>
              <td className="p-2">{s.notes ?? "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Drawer open={!!selected} onClose={() => setSelected(null)}>
        <h3 className="text-xl font-bold mb-2">Set log</h3>
        {sets.length === 0 && <p>No sets recorded.</p>}
        {sets.length > 0 && (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-2">#</th>
                <th className="p-2">Exercise</th>
                <th className="p-2">Weight</th>
                <th className="p-2">Reps</th>
                <th className="p-2">RIR</th>
              </tr>
            </thead>
            <tbody>
              {sets.map(st => (
                <tr key={st.id} className="border-t">
                  <td className="p-2">{st.set_number}</td>
                  <td className="p-2">{st.exercise}</td>
                  <td className="p-2">{st.weight}</td>
                  <td className="p-2">{st.reps}</td>
                  <td className="p-2">{st.rir ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Drawer>
    </section>
  );
}
