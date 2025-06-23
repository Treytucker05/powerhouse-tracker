import Header from "../components/dashboard/Header";
import NavBar from "../components/dashboard/NavBar";
import CardWrapper from "../components/ui/CardWrapper";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Macrocycle() {
  const mesocycles = [
    { id: 1, name: 'Foundation Phase', weeks: 6, status: 'completed', progress: 100 },
    { id: 2, name: 'Hypertrophy Phase', weeks: 8, status: 'current', progress: 65 },
    { id: 3, name: 'Strength Phase', weeks: 6, status: 'planned', progress: 0 },
    { id: 4, name: 'Peak Phase', weeks: 4, status: 'planned', progress: 0 },
  ];

  const MesocycleCard = ({ mesocycle }) => (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
      mesocycle.status === 'completed' 
        ? 'bg-green-900/20 border-green-500' 
        : mesocycle.status === 'current'
        ? 'bg-red-900/20 border-red-500 shadow-red-500/20'
        : 'bg-gray-700 border-gray-600'
    } shadow-lg`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-white">{mesocycle.name}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          mesocycle.status === 'completed' 
            ? 'bg-green-500/20 text-green-400' 
            : mesocycle.status === 'current'
            ? 'bg-red-500/20 text-red-400'
            : 'bg-gray-600/20 text-gray-400'
        }`}>
          {mesocycle.status}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-3">{mesocycle.weeks} weeks</p>
      <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            mesocycle.status === 'completed' 
              ? 'bg-green-500' 
              : mesocycle.status === 'current'
              ? 'bg-red-500'
              : 'bg-gray-500'
          }`}
          style={{ width: `${mesocycle.progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-400">{mesocycle.progress}% complete</p>
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
                🎯 Macrocycle Overview
              </h1>
              <p className="text-gray-400 text-lg">
                Long-term training periodization and phase planning (3-12 months)
              </p>
            </div>

            {/* Timeline Visualization */}
            <CardWrapper title="Training Timeline" subtitle="Current macrocycle progression">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-600"></div>
                
                <div className="space-y-6">
                  {mesocycles.map((mesocycle, index) => (
                    <div key={mesocycle.id} className="relative flex items-center">
                      {/* Timeline dot */}
                      <div className={`w-4 h-4 rounded-full border-2 mr-4 ${
                        mesocycle.status === 'completed' 
                          ? 'bg-green-500 border-green-500' 
                          : mesocycle.status === 'current'
                          ? 'bg-red-500 border-red-500 animate-pulse'
                          : 'bg-gray-600 border-gray-600'
                      }`}></div>
                      
                      {/* Mesocycle info */}
                      <div className="flex-1">
                        <MesocycleCard mesocycle={mesocycle} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardWrapper>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Current Phase Details */}
              <CardWrapper title="Current Phase: Hypertrophy" subtitle="Week 5 of 8">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Phase Objectives</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Maximize muscle growth</li>
                      <li>• Volume progression 8-18 sets per muscle</li>
                      <li>• 6-12 rep range focus</li>
                      <li>• Moderate intensity (70-85% 1RM)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Progress Metrics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Volume Load</span>
                        <p className="text-white font-semibold">+15%</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Body Weight</span>
                        <p className="text-green-400 font-semibold">+2.3 lbs</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Strength</span>
                        <p className="text-green-400 font-semibold">+8%</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Recovery</span>
                        <p className="text-yellow-400 font-semibold">Good</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardWrapper>

              {/* Periodization Strategy */}
              <CardWrapper title="Periodization Strategy" subtitle="Annual training plan">
                <div className="space-y-4">
                  <div className="p-3 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <h4 className="text-white font-medium">Linear Periodization</h4>
                    <p className="text-gray-400 text-sm">Progressive overload with phase-specific adaptations</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Phase Distribution:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-green-900/20 p-2 rounded border-l-2 border-green-500">
                        <span className="text-green-400">Foundation: 25%</span>
                      </div>
                      <div className="bg-red-900/20 p-2 rounded border-l-2 border-red-500">
                        <span className="text-red-400">Hypertrophy: 35%</span>
                      </div>
                      <div className="bg-yellow-900/20 p-2 rounded border-l-2 border-yellow-500">
                        <span className="text-yellow-400">Strength: 25%</span>
                      </div>
                      <div className="bg-purple-900/20 p-2 rounded border-l-2 border-purple-500">
                        <span className="text-purple-400">Peak: 15%</span>
                      </div>
                    </div>
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
