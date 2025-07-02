import CardWrapper from "../components/ui/CardWrapper";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import Breadcrumb from "../components/navigation/Breadcrumb";
import SectionDivider from "../components/ui/SectionDivider";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { PlanningActions } from "../components/ui/fabHelpers";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { useState, useEffect } from "react";
import { CalendarIcon, ChartBarIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Macrocycle() {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [_isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  const mesocycles = [
    { 
      id: 1, 
      name: 'Foundation Phase', 
      weeks: 6, 
      status: 'completed', 
      progress: 100,
      icon: '🏗️',
      gradient: 'from-blue-600 to-blue-800',
      borderColor: 'border-blue-500/50',
      glowColor: 'blue',
      startDate: '2024-01-01',
      endDate: '2024-02-11',
      objectives: ['Build training base', 'Improve movement quality', 'Establish routine'],
      keyMetrics: { volume: '+25%', technique: '95%', consistency: '90%' }
    },
    { 
      id: 2, 
      name: 'Hypertrophy Phase', 
      weeks: 8, 
      status: 'current', 
      progress: 65,
      icon: '💪',
      gradient: 'from-green-600 to-green-800',
      borderColor: 'border-green-500/50',
      glowColor: 'green',
      startDate: '2024-02-12',
      endDate: '2024-04-08',
      objectives: ['Maximize muscle growth', 'Volume progression', '6-12 rep focus'],
      keyMetrics: { volume: '+15%', weight: '+2.3 lbs', strength: '+8%' }
    },
    { 
      id: 3, 
      name: 'Strength Phase', 
      weeks: 6, 
      status: 'planned', 
      progress: 0,
      icon: '🔥',
      gradient: 'from-orange-600 to-red-700',
      borderColor: 'border-orange-500/50',
      glowColor: 'orange',
      startDate: '2024-04-09',
      endDate: '2024-05-20',
      objectives: ['Build maximal strength', 'Lower rep ranges', 'Heavy compound focus'],
      keyMetrics: { '1RM': 'TBD', 'Intensity': 'TBD', 'Power': 'TBD' }
    },
    { 
      id: 4, 
      name: 'Peak Phase', 
      weeks: 4, 
      status: 'planned', 
      progress: 0,
      icon: '⚡',
      gradient: 'from-purple-600 to-purple-800',
      borderColor: 'border-purple-500/50',
      glowColor: 'purple',
      startDate: '2024-05-21',
      endDate: '2024-06-17',
      objectives: ['Peak performance', 'Competition prep', 'Taper and recover'],
      keyMetrics: { 'Performance': 'TBD', 'Recovery': 'TBD', 'Readiness': 'TBD' }
    },
  ];

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 60, strokeWidth = 4, color = 'red' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colorMap = {
      blue: '#3b82f6',
      green: '#10b981',
      orange: '#f97316',
      purple: '#8b5cf6',
      red: '#ef4444',
      gray: '#6b7280'
    };

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorMap[color]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${colorMap[color]}40)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  // Enhanced Timeline Card Component
  const TimelineCard = ({ mesocycle }) => {
    const isExpanded = expandedPhase === mesocycle.id;
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return (
      <div 
        className={`relative p-6 rounded-2xl border-2 transition-all duration-700 ease-out cursor-pointer group ${
          mesocycle.status === 'completed' 
            ? `bg-gradient-to-br ${mesocycle.gradient}/20 ${mesocycle.borderColor} shadow-lg` 
            : mesocycle.status === 'current'
            ? `bg-gradient-to-br ${mesocycle.gradient}/30 ${mesocycle.borderColor} shadow-xl animate-pulse`
            : `bg-gradient-to-br from-gray-800/40 to-gray-700/30 border-gray-600/40 shadow-md`
        } backdrop-blur-sm hover:scale-[1.02] hover:shadow-2xl ${
          isExpanded ? 'scale-[1.02] shadow-2xl' : ''
        }`}
        style={{
          boxShadow: mesocycle.status === 'current' 
            ? `0 15px 40px rgba(16, 185, 129, 0.25), 0 6px 20px rgba(0, 0, 0, 0.3)`
            : mesocycle.status === 'completed'
            ? `0 10px 30px rgba(59, 130, 246, 0.2), 0 4px 15px rgba(0, 0, 0, 0.3)`
            : '0 8px 25px rgba(0, 0, 0, 0.3)'
        }}
        onClick={() => setExpandedPhase(isExpanded ? null : mesocycle.id)}
      >
        {/* Phase Icon & Status Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{mesocycle.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    letterSpacing: '0.3px'
                  }}>
                {mesocycle.name}
              </h3>
              <p className="text-sm text-gray-300">
                {formatDate(mesocycle.startDate)} - {formatDate(mesocycle.endDate)} • {mesocycle.weeks} weeks
              </p>
            </div>
          </div>
          
          {/* Circular Progress Indicator */}
          <div className="flex flex-col items-center space-y-2">
            <CircularProgress 
              percentage={mesocycle.progress} 
              color={mesocycle.glowColor}
              size={70}
            />
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              mesocycle.status === 'completed' 
                ? 'bg-gradient-to-r from-blue-500/30 to-blue-400/20 text-blue-300 border border-blue-400/30' 
                : mesocycle.status === 'current'
                ? 'bg-gradient-to-r from-green-500/30 to-green-400/20 text-green-300 border border-green-400/30'
                : 'bg-gradient-to-r from-gray-600/30 to-gray-500/20 text-gray-300 border border-gray-500/30'
            }`}
                 style={{
                   textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                   backdropFilter: 'blur(8px)'
                 }}>
              {mesocycle.status}
            </span>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="relative w-full bg-gray-700/50 rounded-full h-4 mb-4 overflow-hidden"
             style={{ 
               boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
               backdropFilter: 'blur(4px)'
             }}>
          <div 
            className={`h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden bg-gradient-to-r ${mesocycle.gradient}`}
            style={{ 
              width: `${mesocycle.progress}%`,
              boxShadow: `0 0 15px rgba(16, 185, 129, 0.6), inset 0 1px 2px rgba(255,255,255,0.2)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
          </div>
        </div>

        {/* Expanded Details */}
        <div className={`transition-all duration-500 ease-out overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-4 border-t border-gray-600/30 space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-2"></span>
                Phase Objectives
              </h4>
              <ul className="text-gray-300 text-sm space-y-1 ml-4">
                {mesocycle.objectives.map((objective, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-green-500 rounded-full mr-2"></span>
                Key Metrics
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(mesocycle.keyMetrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-800/50 rounded-lg p-2 text-center backdrop-blur-sm">
                    <p className="text-xs text-gray-400 mb-1">{key}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Indicator */}
        <div className="absolute bottom-4 right-4">
          <div className={`w-6 h-6 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-black text-white mb-4 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #dc2626 50%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 4px 8px rgba(220, 38, 38, 0.3)',
                  letterSpacing: '1px'
                }}>
              🎯 Macrocycle Overview
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed"
               style={{
                 textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                 letterSpacing: '0.3px'
               }}>
              Long-term training periodization and phase planning (3-12 months)
            </p>
          </div>

          {/* Enhanced Timeline Visualization */}
          <CardWrapper title="🎯 Training Timeline" subtitle="Modern phase progression with visual milestones">
            <div className="space-y-8">
              {mesocycles.map((mesocycle, index) => (
                <div key={mesocycle.id} className="relative">
                  {/* Connecting Line */}
                  {index < mesocycles.length - 1 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-1 h-8 bg-gradient-to-b from-gray-600 to-transparent z-0"></div>
                  )}
                  
                  <TimelineCard mesocycle={mesocycle} index={index} />
                </div>
              ))}
            </div>
          </CardWrapper>

          {/* Current Phase Hero Card */}
          <div className="relative">
            <CardWrapper 
              title={
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">💪</div>
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          textShadow: '0 4px 8px rgba(16, 185, 129, 0.3)',
                          letterSpacing: '0.5px'
                        }}>
                      Current Phase: Hypertrophy
                    </h2>
                    <p className="text-green-300 text-lg font-semibold"
                       style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                      Week 5 of 8 • 65% Complete
                    </p>
                  </div>
                </div>
              }
              subtitle=""
            >
              <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                {/* Phase Overview */}
                <div className="space-y-6">
                  {/* Progress Ring */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <CircularProgress percentage={65} color="green" size={120} strokeWidth={8} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl">💪</div>
                        <div className="text-xs text-gray-400 mt-1">PROGRESS</div>
                      </div>
                    </div>
                  </div>                  {/* Phase Objectives */}
                  <div className="bg-gradient-to-br from-green-900/40 to-green-800/30 rounded-2xl p-6 border border-green-500/30 backdrop-blur-sm">
                    <h3 className="text-green-300 font-bold mb-6 flex items-center text-lg">
                      <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-3"></span>
                      Phase Objectives
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Muscle Growth Objective */}
                      <div className="bg-gradient-to-br from-green-800/30 to-green-700/20 rounded-xl p-4 border border-green-500/20 hover:border-green-400/40 transition-all duration-200 group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-green-400 text-lg">🧬</span>
                            </div>
                            <div>
                              <h4 className="text-green-300 font-bold text-sm">Muscle Growth</h4>
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-xs text-green-500 font-medium">ON TRACK</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">Primary focus on hypertrophic adaptations</p>
                        <div className="bg-green-900/20 rounded-lg p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-green-400">Progress</span>
                            <span className="text-xs text-green-300">78%</span>
                          </div>
                          <div className="w-full bg-green-900/40 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300" style={{width: '78%'}}></div>
                          </div>
                        </div>
                      </div>

                      {/* Volume Progression Objective */}
                      <div className="bg-gradient-to-br from-blue-800/30 to-blue-700/20 rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-200 group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-blue-400 text-lg">📊</span>
                            </div>
                            <div>
                              <h4 className="text-blue-300 font-bold text-sm">Volume Progression</h4>
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-xs text-blue-500 font-medium">ACTIVE</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">8-18 sets per muscle group weekly</p>
                        <div className="bg-blue-900/20 rounded-lg p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-blue-400">Volume Load</span>
                            <span className="text-xs text-blue-300">65%</span>
                          </div>
                          <div className="w-full bg-blue-900/40 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300" style={{width: '65%'}}></div>
                          </div>
                        </div>
                      </div>

                      {/* Rep Range Focus */}
                      <div className="bg-gradient-to-br from-purple-800/30 to-purple-700/20 rounded-xl p-4 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-200 group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-purple-400 text-lg">🎯</span>
                            </div>
                            <div>
                              <h4 className="text-purple-300 font-bold text-sm">Rep Range Focus</h4>
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                <span className="text-xs text-purple-500 font-medium">OPTIMIZED</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">6-12 reps for optimal muscle growth</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-xs text-purple-300">6-12 reps</span>
                          </div>
                          <span className="text-xs text-purple-400 font-medium">✓ Target Range</span>
                        </div>
                      </div>

                      {/* Intensity Control */}
                      <div className="bg-gradient-to-br from-orange-800/30 to-orange-700/20 rounded-xl p-4 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-200 group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-orange-400 text-lg">⚡</span>
                            </div>
                            <div>
                              <h4 className="text-orange-300 font-bold text-sm">Intensity Control</h4>
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                                <span className="text-xs text-orange-500 font-medium">BALANCED</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">70-85% 1RM for volume accumulation</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span className="text-xs text-orange-300">70-85% 1RM</span>
                          </div>
                          <span className="text-xs text-orange-400 font-medium">✓ Optimal Load</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>                {/* Progress Metrics */}
                <div className="space-y-6">
                  {/* Key Performance Indicators */}
                  <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-6 flex items-center text-lg">
                      <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mr-3"></span>
                      Progress Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Volume Load Metric */}
                      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-5 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-3 group-hover:bg-green-500/30 transition-colors">
                              <span className="text-green-400 text-xl">📈</span>
                            </div>
                            <div>
                              <h4 className="text-green-300 font-bold text-sm">Volume Load</h4>
                              <p className="text-xs text-green-400/80">Weekly progression</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-green-400 font-bold text-2xl mb-1">+15%</p>
                            <p className="text-xs text-green-300/70">vs. last phase</p>
                          </div>
                          <div className="text-right">
                            <div className="bg-green-900/40 rounded-lg px-2 py-1">
                              <span className="text-xs text-green-300 font-medium">TRENDING UP</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Body Weight Metric */}
                      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-5 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors">
                              <span className="text-blue-400 text-xl">⚖️</span>
                            </div>
                            <div>
                              <h4 className="text-blue-300 font-bold text-sm">Body Weight</h4>
                              <p className="text-xs text-blue-400/80">Lean mass tracking</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-blue-400 font-bold text-2xl mb-1">+2.3 lbs</p>
                            <p className="text-xs text-blue-300/70">lean mass gain</p>
                          </div>
                          <div className="text-right">
                            <div className="bg-blue-900/40 rounded-lg px-2 py-1">
                              <span className="text-xs text-blue-300 font-medium">ON TARGET</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Strength Metric */}
                      <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-xl p-5 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mr-3 group-hover:bg-orange-500/30 transition-colors">
                              <span className="text-orange-400 text-xl">💪</span>
                            </div>
                            <div>
                              <h4 className="text-orange-300 font-bold text-sm">Strength</h4>
                              <p className="text-xs text-orange-400/80">Compound lifts</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-orange-400 font-bold text-2xl mb-1">+8%</p>
                            <p className="text-xs text-orange-300/70">total improvement</p>
                          </div>
                          <div className="text-right">
                            <div className="bg-orange-900/40 rounded-lg px-2 py-1">
                              <span className="text-xs text-orange-300 font-medium">EXCELLENT</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recovery Metric */}
                      <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl p-5 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mr-3 group-hover:bg-yellow-500/30 transition-colors">
                              <span className="text-yellow-400 text-xl">😴</span>
                            </div>
                            <div>
                              <h4 className="text-yellow-300 font-bold text-sm">Recovery</h4>
                              <p className="text-xs text-yellow-400/80">Sleep & stress</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-yellow-400 font-bold text-2xl mb-1">7.2/10</p>
                            <p className="text-xs text-yellow-300/70">daily average</p>
                          </div>
                          <div className="text-right">
                            <div className="bg-yellow-900/40 rounded-lg px-2 py-1">
                              <span className="text-xs text-yellow-300 font-medium">GOOD</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Timeline */}
                  <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-2xl p-6 border border-green-500/30 backdrop-blur-sm">
                    <h3 className="text-green-300 font-bold mb-4 flex items-center">
                      <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-3"></span>
                      Weekly Progress
                    </h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-300">Week Progress</span>
                      <span className="text-sm text-green-300 font-semibold">5 of 8 weeks</span>
                    </div>
                    <div className="relative w-full bg-gray-700/50 rounded-full h-3 mb-4 overflow-hidden">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ 
                          width: '62.5%',
                          boxShadow: '0 0 15px rgba(16, 185, 129, 0.6), inset 0 1px 2px rgba(255,255,255,0.2)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Week 1</span>
                      <span className="text-green-400 font-semibold">Current: Week 5</span>
                      <span>Week 8</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardWrapper>
          </div>

          {/* Periodization Strategy */}
          <CardWrapper title="🎯 Periodization Strategy" subtitle="Annual training plan and phase distribution">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                  <h4 className="text-blue-300 font-bold mb-2 flex items-center">
                    <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3"></span>
                    Linear Periodization
                  </h4>
                  <p className="text-gray-300 text-sm">Progressive overload with phase-specific adaptations</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Training Philosophy:</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Evidence-based programming
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Progressive overload focus
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                      Autoregulation integration
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Phase Distribution:</h4>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 p-4 rounded-xl border-l-4 border-blue-500 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-300 font-semibold">🏗️ Foundation</span>
                      <span className="text-blue-400 font-bold">25%</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Base building & movement quality</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 p-4 rounded-xl border-l-4 border-green-500 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-green-300 font-semibold">💪 Hypertrophy</span>
                      <span className="text-green-400 font-bold">35%</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Muscle growth emphasis</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/20 p-4 rounded-xl border-l-4 border-orange-500 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-300 font-semibold">🔥 Strength</span>
                      <span className="text-orange-400 font-bold">25%</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Maximal strength focus</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 p-4 rounded-xl border-l-4 border-purple-500 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300 font-semibold">⚡ Peak</span>
                      <span className="text-purple-400 font-bold">15%</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Performance optimization</p>
                  </div>
                </div>
              </div>
            </div>
          </CardWrapper>
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
