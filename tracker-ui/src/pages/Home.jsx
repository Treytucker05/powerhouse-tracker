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
      <h1 className="text-emerald-600 text-3xl font-bold mb-6">
        PowerHouse Tracker
      </h1>
      
      {/* Weekly Volume Card */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Weekly Volume</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Fatigue Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${fatigueStatus.color}-100 text-${fatigueStatus.color}-800`}>
              {fatigueStatus.level}
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading volume data...</div>
          </div>
        ) : weeklyVolume.length === 0 ? (
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-2">No volume data available</div>
              <button 
                onClick={() => navigate('/logger')}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                Start your first workout →
              </button>
            </div>
          </div>
        ) : (
          <>
            <BarMiniChart data={weeklyVolume} />
            <div className="mt-3 text-xs text-gray-500">
              Total exercises tracked: {weeklyVolume.length} • 
              Total volume: {weeklyVolume.reduce((sum, item) => sum + item.volume, 0)} sets
            </div>
          </>
        )}
      </div>

      <p className="mb-6 text-gray-600">Welcome to the PowerHouse Training Tracker</p>{/* Quick Actions */}
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
