import { useState } from "react";
import { useTrainingState } from "../../lib/state/trainingState";
import { designMesocycle } from "../../lib/algorithms/mesocycleDesigner";

export default function MesocycleWizard() {
  const { setConfig, setWeeklyPlan } = useTrainingState(s=>s.mesocycle);
  const [weeks,setWeeks] = useState(5);
  const [startVol,setStartVol] = useState(10);
  const [endVol,setEndVol] = useState(18);

  const handleGenerate = () => {
    const cfg = { weeks, startVolume:startVol, endVolume:endVol, rirStart:4, rirEnd:0 };
    setConfig(cfg);
    setWeeklyPlan(designMesocycle(cfg));
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Mesocycle Builder</h1>
      <label className="block">Weeks
        <input type="number" value={weeks} min={3} max={8}
               onChange={e=>setWeeks(+e.target.value)} className="input"/>
      </label>
      <label className="block">Start Volume (sets)
        <input type="number" value={startVol}
               onChange={e=>setStartVol(+e.target.value)} className="input"/>
      </label>
      <label className="block">End Volume (sets)
        <input type="number" value={endVol}
               onChange={e=>setEndVol(+e.target.value)} className="input"/>
      </label>
      <button onClick={handleGenerate} className="btn btn-primary w-full">
        Generate Mesocycle
      </button>
    </div>
  );
}
