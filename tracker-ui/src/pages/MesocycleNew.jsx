import Header from "../components/dashboard/Header";
import NavBar from "../components/dashboard/NavBar";
import CardWrapper from "../components/ui/CardWrapper";
import MesocycleBuilder from "../components/dashboard/MesocycleBuilder";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import "../components/dashboard/DashboardLayout.css";

export default function Mesocycle() {
  const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  
  const volumeLandmarks = {
    'Chest': { mev: 8, mav: 18, mrv: 22 },
    'Back': { mev: 10, mav: 20, mrv: 25 },
    'Shoulders': { mev: 8, mav: 16, mrv: 20 },
    'Arms': { mev: 6, mav: 14, mrv: 18 },
    'Legs': { mev: 12, mav: 22, mrv: 28 },
    'Core': { mev: 0, mav: 12, mrv: 16 }
  };

  const VolumeSlider = ({ muscle, landmarks }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white font-medium">{muscle}</span>
        <span className="text-gray-400 text-sm">Current: {landmarks.mav} sets</span>
      </div>
      <div className="relative">
        <input 
          type="range" 
          min={landmarks.mev} 
          max={landmarks.mrv} 
          defaultValue={landmarks.mav}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>MEV: {landmarks.mev}</span>
          <span>MAV: {landmarks.mav}</span>
          <span>MRV: {landmarks.mrv}</span>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="min-h-screen bg-gray-900">
          <Header />
          <NavBar />
          <main className="container mx-auto px-6 py-8 space-y-8 max-w-7xl">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                🗓️ Mesocycle Planning
              </h1>
              <p className="text-gray-400 text-lg">
                Plan and configure your training blocks (3-6 weeks) with volume progression
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Volume Landmarks Configuration */}
              <CardWrapper 
                title="Volume Landmarks" 
                subtitle="Configure MEV, MAV, and MRV for each muscle group"
                className="lg:col-span-2"
              >
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {muscleGroups.map(muscle => (
                    <VolumeSlider 
                      key={muscle} 
                      muscle={muscle} 
                      landmarks={volumeLandmarks[muscle]} 
                    />
                  ))}
                </div>
              </CardWrapper>

              {/* Mesocycle Builder */}
              <CardWrapper title="Mesocycle Builder" subtitle="Create and manage training blocks">
                <MesocycleBuilder />
              </CardWrapper>

              {/* Phase Overview */}
              <CardWrapper title="Training Phases" subtitle="Current mesocycle structure">
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-green-500">
                    <h4 className="text-white font-medium">Accumulation Phase</h4>
                    <p className="text-gray-400 text-sm">Weeks 1-3: Volume progression</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="text-white font-medium">Intensification Phase</h4>
                    <p className="text-gray-400 text-sm">Week 4: High intensity, reduced volume</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                    <h4 className="text-white font-medium">Deload Phase</h4>
                    <p className="text-gray-400 text-sm">Week 5: Recovery and adaptation</p>
                  </div>
                </div>
              </CardWrapper>
            </div>
          </main>
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
