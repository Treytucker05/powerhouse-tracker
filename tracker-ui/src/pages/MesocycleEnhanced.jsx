import { useState, useEffect } from "react";
import CardWrapper from "../components/ui/CardWrapper";
import MesocycleBuilder from "../components/dashboard/MesocycleBuilder";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import Breadcrumb from "../components/navigation/Breadcrumb";
import SectionDivider from "../components/ui/SectionDivider";
import FloatingActionButton, { PlanningActions } from "../components/ui/FloatingActionButton";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { CalendarIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';
import "../components/dashboard/DashboardLayout.css";

export default function Mesocycle() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // All muscles from the volume chart
  const muscleGroups = ['Chest', 'Back', 'Quads', 'Glutes', 'Hamstrings', 'Shoulders', 'Biceps', 'Triceps', 'Calves', 'Abs', 'Forearms', 'Neck', 'Traps'];
  
  const volumeLandmarks = {
    'Chest': { mev: 8, mav: 18, mrv: 22 },
    'Back': { mev: 10, mav: 20, mrv: 25 },
    'Quads': { mev: 10, mav: 20, mrv: 25 },
    'Glutes': { mev: 8, mav: 14, mrv: 16 },
    'Hamstrings': { mev: 8, mav: 12, mrv: 20 },
    'Shoulders': { mev: 6, mav: 10, mrv: 20 },
    'Biceps': { mev: 6, mav: 14, mrv: 16 },
    'Triceps': { mev: 6, mav: 10, mrv: 18 },
    'Calves': { mev: 6, mav: 8, mrv: 16 },
    'Abs': { mev: 4, mav: 6, mrv: 16 },
    'Forearms': { mev: 4, mav: 4, mrv: 12 },
    'Neck': { mev: 2, mav: 3, mrv: 8 },
    'Traps': { mev: 4, mav: 4, mrv: 12 }
  };

  const VolumeSlider = ({ muscle, landmarks }) => {
    const [currentValue, setCurrentValue] = useState(landmarks.mav);
    
    const getSliderColor = (value) => {
      if (value < landmarks.mev) return '#dc2626'; // Red - below MEV
      if (value > landmarks.mrv) return '#dc2626'; // Red - above MRV
      return '#22c55e'; // Green - optimal range
    };

    const getSliderBackground = (value) => {
      // Create gradient that spans the full range (0 to max)
      const maxRange = Math.max(landmarks.mrv * 1.5, 30); // Allow 50% beyond MRV or minimum 30
      const mevPercent = (landmarks.mev / maxRange) * 100;
      const mrvPercent = (landmarks.mrv / maxRange) * 100;
      
      return `linear-gradient(to right, 
        #dc2626 0%, 
        #dc2626 ${mevPercent}%, 
        #eab308 ${mevPercent}%, 
        #22c55e ${(mevPercent + mrvPercent) / 2}%, 
        #eab308 ${mrvPercent}%, 
        #dc2626 ${mrvPercent}%, 
        #dc2626 100%)`;
    };

    const maxRange = Math.max(landmarks.mrv * 1.5, 30); // Allow 50% beyond MRV
    const sliderColor = getSliderColor(currentValue);

    return (
      <div className="bg-gray-800 border-2 rounded-xl p-6 transition-all duration-300 premium-card glass-morphism-subtle hover:scale-105"
           style={{
             borderColor: sliderColor,
             boxShadow: `0 4px 12px rgba(${sliderColor === '#22c55e' ? '34, 197, 94' : '220, 38, 38'}, 0.3)`
           }}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-bold text-lg uppercase">
            {muscle}
          </span>
          <span className="text-sm font-bold"
                style={{ 
                  color: sliderColor,
                  textShadow: `0 0 8px ${sliderColor}`
                }}>
            Current: {currentValue} sets
          </span>
        </div>
        
        <div className="relative mb-4">
          <input 
            type="range" 
            min={0} 
            max={maxRange} 
            value={currentValue}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer outline-none"
            style={{
              background: getSliderBackground(currentValue),
            }}
            onChange={(e) => setCurrentValue(parseInt(e.target.value))}
          />
          
          {/* Volume landmark indicators */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>MEV: {landmarks.mev}</span>
            <span>MAV: {landmarks.mav}</span>
            <span>MRV: {landmarks.mrv}</span>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentValue < landmarks.mev ? 'bg-red-900/50 text-red-300' :
            currentValue > landmarks.mrv ? 'bg-red-900/50 text-red-300' :
            'bg-green-900/50 text-green-300'
          }`}>
            {currentValue < landmarks.mev ? 'Below MEV' :
             currentValue > landmarks.mrv ? 'Above MRV' :
             'Optimal Range'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          {/* Enhanced Navigation */}
          <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <Breadcrumb />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {isLoading ? (
              <LoadingSkeleton type="card" count={3} className="h-64" />
            ) : (
              <>
                {/* Hero Section */}
                <div className="text-center space-y-4 animate-fade-in-up">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Mesocycle Planning
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Design your training blocks with precision volume control and progressive overload
                  </p>
                </div>

                <SectionDivider 
                  title="Volume Configuration"
                  icon={ChartBarIcon}
                  gradient={true}
                />

                {/* Volume Tracking Section */}
                <div className="space-y-8">
                  <CardWrapper 
                    title="Weekly Volume Targets" 
                    className="glass-morphism premium-card animate-slide-in-up"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {muscleGroups.map((muscle) => (
                        <VolumeSlider
                          key={muscle}
                          muscle={muscle}
                          landmarks={volumeLandmarks[muscle]}
                        />
                      ))}
                    </div>
                  </CardWrapper>
                </div>

                <SectionDivider 
                  title="Training Phases"
                  icon={CalendarIcon}
                  gradient={true}
                />

                {/* Training Phases */}
                <div className="space-y-8">
                  <CardWrapper 
                    title="Mesocycle Structure" 
                    className="glass-morphism premium-card animate-slide-in-up"
                  >
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-6 rounded-xl border border-green-500/30 glass-morphism-subtle timeline-item">
                        <div className="flex items-center mb-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />
                          <h4 className="text-green-400 font-bold text-lg">
                            Volume Accumulation
                          </h4>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                          Weeks 1-2: Progressive volume increase with moderate intensity
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-3/4 progress-bar" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 p-6 rounded-xl border border-yellow-500/30 glass-morphism-subtle timeline-item">
                        <div className="flex items-center mb-4">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse" />
                          <h4 className="text-yellow-400 font-bold text-lg">
                            Intensity Block
                          </h4>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                          Week 3: Peak intensity with maintained volume
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full w-1/2 progress-bar" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 p-6 rounded-xl border border-red-500/30 glass-morphism-subtle timeline-item">
                        <div className="flex items-center mb-4">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse" />
                          <h4 className="text-red-400 font-bold text-lg">
                            Peaking Phase
                          </h4>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                          Week 4: High intensity training with reduced volume
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full w-4/5 progress-bar" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 rounded-xl border border-purple-500/30 glass-morphism-subtle timeline-item md:col-span-2 lg:col-span-3">
                        <div className="flex items-center mb-4">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 animate-pulse" />
                          <h4 className="text-purple-400 font-bold text-lg">
                            Deload Phase
                          </h4>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                          Week 5: Recovery, adaptation, and preparation for next block
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full w-1/3 progress-bar" />
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </div>

                <SectionDivider 
                  title="Program Builder"
                  icon={ClockIcon}
                  gradient={true}
                />

                {/* Mesocycle Builder */}
                <div className="animate-fade-in-up">
                  <MesocycleBuilder />
                </div>
              </>
            )}
          </div>

          {/* Floating Action Button */}
          <FloatingActionButton 
            actions={PlanningActions.mesocycle}
            position="bottom-right"
            color="blue"
          />
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
