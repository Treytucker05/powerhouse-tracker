import MesocycleWizard from "../../components/mesocycle/MesocycleWizard";
import { useTrainingState } from "../../lib/state/trainingState";

export default function MesocyclePage() {
  const plan = useTrainingState(s=>s.mesocycle.weeklyPlan);
  if (!plan.length) return <MesocycleWizard />;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Mesocycle Overview</h1>
      <table className="w-full text-left">
        <thead><tr><th>Week</th><th>Sets</th><th>Target RIR</th></tr></thead>
        <tbody>{plan.map(p=>(
          <tr key={p.week}><td>{p.week}</td><td>{p.sets}</td><td>{p.targetRIR}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
