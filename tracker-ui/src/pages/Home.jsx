import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWeeklyVolume from "../lib/useWeeklyVolume";
import BarMiniChart from "../components/BarMiniChart";
import DeloadDrawer from "../components/DeloadDrawer";

export default function Home() {
  const { data: weeklyVolume, loading } = useWeeklyVolume();
  const [deloadDrawerOpen, setDeloadDrawerOpen] = useState(false);
  const [deloadOffenders, setDeloadOffenders] = useState([]);
  const navigate = useNavigate();

  // Calculate fatigue status (simplified logic)
  const calculateFatigueStatus = () => {
    if (!weeklyVolume.length) return { level: 'unknown', color: 'gray' };
    
    const totalVolume = weeklyVolume.reduce((sum, item) => sum + item.volume, 0);
    const avgVolume = totalVolume / weeklyVolume.length;
    
    if (avgVolume < 10) return { level: 'Low', color: 'emerald' };
    if (avgVolume < 20) return { level: 'Moderate', color: 'amber' };
    return { level: 'High', color: 'red' };
  };

  const analyzeDeloadNeed = () => {
    // Simplified deload analysis - in real app this would use proper algorithm
    const offenders = [];
    
    weeklyVolume.forEach(item => {
      if (item.volume > 25) { // Arbitrary high volume threshold
        offenders.push({
          name: item.muscle,
          reason: `High volume (${item.volume} sets) may indicate fatigue accumulation`
        });
      }
    });

    // Add some mock offenders for demo if no real ones
    if (offenders.length === 0 && weeklyVolume.length > 0) {
      offenders.push({
        name: 'Chest',
        reason: 'RIR trending below target for 2 weeks'
      });
    }

    setDeloadOffenders(offenders);
    setDeloadDrawerOpen(true);
  };

  const fatigueStatus = calculateFatigueStatus();

  return (
    <div className="p-4">
      <h1 className="text-emerald-600 text-3xl font-bold mb-4">
        PowerHouse Tracker
      </h1>
      <p className="mb-6">Welcome to the PowerHouse Training Tracker</p>
      
      {/* Weekly Volume Widget */}
      <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Weekly Volume</h3>
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <BarMiniChart data={weeklyVolume} />
        )}
        
        {/* Fatigue Status Badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-medium">Fatigue Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${fatigueStatus.color}-100 text-${fatigueStatus.color}-800`}>
            {fatigueStatus.level}
          </span>
        </div>
      </div>      {/* Quick Actions */}
      <div className="space-y-2">
        <button 
          onClick={() => navigate('/sessions')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
        >
          View Sessions
        </button>
        <button 
          onClick={() => navigate('/intelligence')}
          className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 mr-2"
        >
          View Intelligence
        </button>
        <button 
          onClick={() => navigate('/logger')}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mr-2"
        >
          Start Workout
        </button>
        <button 
          onClick={analyzeDeloadNeed}
          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
        >
          Analyze Deload Need
        </button>
      </div>

      {/* Deload Drawer */}
      <DeloadDrawer 
        open={deloadDrawerOpen}
        onClose={() => setDeloadDrawerOpen(false)}
        offenders={deloadOffenders}
      />
    </div>
  );
}
