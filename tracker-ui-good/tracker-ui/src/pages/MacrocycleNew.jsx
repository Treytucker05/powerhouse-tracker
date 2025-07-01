import CardWrapper from "../components/ui/CardWrapper";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import Breadcrumb from "../components/navigation/Breadcrumb";
import SectionDivider from "../components/ui/SectionDivider";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { PlanningActions } from "../components/ui/fabHelpers";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarIcon, ChartBarIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';

// Import RP Research & Algorithms (Updated 2024-25)
import {
  MACROCYCLE_TEMPLATES,
  BASE_VOLUME_LANDMARKS,
  RIR_SCHEMES,
  GOAL_TYPES,
  PHASE_DURATION_BASE,
  PHASE_DURATION_MODIFIERS,
  calculateVolumeProgression,
  calculateRIRProgression,
  calculatePhaseDuration,
  calculateIntensityFromRIR,
  shouldDeload
} from "../constants/rpConstants";
import { RIRProgression } from "../../../lib/rirProgression";

export default function Macrocycle() {
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [macrocycleData, setMacrocycleData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('hypertrophy_12');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [programStartDate, setProgramStartDate] = useState(new Date());

  // Initialize RIR progression calculator
  const rirCalculator = new RIRProgression();

  // Extract program data from navigation state or use research-based defaults
  const programData = location.state?.programData || {
    goal: 'hypertrophy',
    duration: 12,
    trainingAge: 'intermediate',
    availableDays: 4,
    name: 'Custom Macrocycle',
    startDate: new Date().toISOString().split('T')[0],
    recoveryScore: 'average'
  };

  // Generate dynamic mesocycles based on RP research (2024-25 Updated)
  const generateMesocycles = (template, programGoals) => {
    const templateData = MACROCYCLE_TEMPLATES[template];
    if (!templateData) return [];

    const mesocycles = [];
    let currentWeekTracker = 1;
    const startDate = new Date(programGoals.startDate || new Date());

    templateData.blocks.forEach((block, index) => {
      // Calculate dynamic phase duration using RP research
      const dynamicDuration = calculatePhaseDuration(
        block.block_type === 'accumulation' ? 'hypertrophy' :
          block.block_type === 'intensification' ? 'strength' :
            block.block_type === 'realization' ? 'peak' : 'foundation',
        programGoals.trainingAge,
        programGoals.goal,
        programGoals.recoveryScore
      );

      // Use dynamic duration but respect template minimums
      const finalDuration = Math.max(block.duration_weeks, dynamicDuration);

      // Calculate real volume progression for this phase
      const chestData = calculateVolumeProgression('chest', finalDuration, programGoals.trainingAge);
      const backData = calculateVolumeProgression('back', finalDuration, programGoals.trainingAge);
      const quadsData = calculateVolumeProgression('quads', finalDuration, programGoals.trainingAge);

      // Calculate real RIR progression
      const exerciseType = block.block_type === 'accumulation' ? 'compound' : 'compound';
      const rirProgression = calculateRIRProgression(finalDuration, exerciseType);

      // Determine current status and progress
      const blockStartWeek = currentWeekTracker;
      const blockEndWeek = currentWeekTracker + finalDuration - 1;
      const status = getBlockStatus(blockStartWeek, blockEndWeek, currentWeek);
      const progress = calculateBlockProgress(blockStartWeek, finalDuration, currentWeek);

      // Calculate deload recommendation for this phase
      const currentVolumeExample = chestData.landmarks.mev + (chestData.landmarks.mrv - chestData.landmarks.mev) * 0.7;
      const deloadCheck = shouldDeload({
        currentVolume: currentVolumeExample,
        mrvThreshold: chestData.landmarks.mrv,
        fatigueScore: 5, // Default moderate fatigue
        performanceDrop: 0,
        weeksSinceDeload: Math.min(currentWeekTracker - 1, 6),
        sleepQuality: 6,
        motivationLevel: 7,
        jointPain: 3
      });

      const blockData = {
        id: index + 1,
        name: getBlockName(block.block_type, block.focus),
        weeks: finalDuration,
        originalWeeks: block.duration_weeks,
        status,
        progress,
        icon: getBlockIcon(block.block_type),
        gradient: getBlockGradient(block.block_type),
        borderColor: getBlockBorderColor(block.block_type),
        glowColor: getBlockGlowColor(block.block_type),
        startDate: calculateStartDate(blockStartWeek, startDate),
        endDate: calculateEndDate(blockEndWeek, startDate),
        objectives: getBlockObjectives(block.block_type, programGoals.goal),
        keyMetrics: calculateDynamicKeyMetrics(block, programGoals, chestData, finalDuration),
        rirProgression,
        volumeProgression: {
          chest: chestData.progression,
          back: backData.progression,
          quads: quadsData.progression
        },
        volumeLandmarks: {
          chest: chestData.landmarks,
          back: backData.landmarks,
          quads: quadsData.landmarks
        },
        deloadRecommendation: deloadCheck,
        blockType: block.block_type,
        researchBased: true
      };

      mesocycles.push(blockData);
      currentWeekTracker += finalDuration;
    });

    return mesocycles;
  };

  // Helper functions for dynamic mesocycle generation
  const getBlockName = (blockType, focus) => {
    const nameMap = {
      accumulation: 'Volume Accumulation',
      intensification: 'Strength Intensification',
      realization: 'Peak Performance',
      deload: 'Recovery & Adaptation',
      maintenance: 'Maintenance Phase'
    };
    return nameMap[blockType] || blockType;
  };

  const getBlockStatus = (blockStart, blockEnd, currentWeek) => {
    if (currentWeek > blockEnd) return 'completed';
    if (currentWeek >= blockStart && currentWeek <= blockEnd) return 'current';
    return 'planned';
  };

  const calculateBlockProgress = (blockStart, blockLength, currentWeek) => {
    if (currentWeek < blockStart) return 0;
    if (currentWeek > blockStart + blockLength - 1) return 100;
    const weeksCompleted = currentWeek - blockStart + 1;
    return Math.round((weeksCompleted / blockLength) * 100);
  };

  const getBlockIcon = (blockType) => {
    const iconMap = {
      accumulation: '💪',
      intensification: '🔥',
      realization: '⚡',
      deload: '🛡️',
      maintenance: '⚖️'
    };
    return iconMap[blockType] || '🎯';
  };

  const getBlockGradient = (blockType) => {
    const gradientMap = {
      accumulation: 'from-green-600 to-green-800',
      intensification: 'from-orange-600 to-red-700',
      realization: 'from-purple-600 to-purple-800',
      deload: 'from-blue-600 to-blue-800',
      maintenance: 'from-gray-600 to-gray-800'
    };
    return gradientMap[blockType] || 'from-gray-600 to-gray-800';
  };

  const getBlockBorderColor = (blockType) => {
    const borderMap = {
      accumulation: 'border-green-500/50',
      intensification: 'border-orange-500/50',
      realization: 'border-purple-500/50',
      deload: 'border-blue-500/50',
      maintenance: 'border-gray-500/50'
    };
    return borderMap[blockType] || 'border-gray-500/50';
  };

  const getBlockGlowColor = (blockType) => {
    const glowMap = {
      accumulation: 'green',
      intensification: 'orange',
      realization: 'purple',
      deload: 'blue',
      maintenance: 'gray'
    };
    return glowMap[blockType] || 'gray';
  };

  const calculateStartDate = (weekNumber, programStart) => {
    const startDate = new Date(programStart);
    startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    return startDate.toISOString().split('T')[0];
  };

  const calculateEndDate = (weekNumber, programStart) => {
    const endDate = new Date(programStart);
    endDate.setDate(endDate.getDate() + weekNumber * 7 - 1);
    return endDate.toISOString().split('T')[0];
  };

  const getBlockObjectives = (blockType, goal) => {
    const objectiveMap = {
      accumulation: {
        hypertrophy: ['Maximize training volume', 'Progressive overload focus', 'Muscle growth emphasis'],
        strength: ['Build work capacity', 'Volume accumulation', 'Movement quality'],
        powerbuilding: ['Balanced volume/intensity', 'Compound lift focus', 'Accessory integration']
      },
      intensification: {
        hypertrophy: ['Maintain volume', 'Increase intensity', 'Advanced techniques'],
        strength: ['Heavy compound focus', '85-95% 1RM training', 'Skill refinement'],
        powerbuilding: ['Strength emphasis', 'Competition prep', 'Peak loading']
      },
      realization: {
        hypertrophy: ['Peak performance', 'Volume tapering', 'Recovery optimization'],
        strength: ['Competition peaking', '95-105% attempts', 'Skill expression'],
        powerbuilding: ['Testing maxes', 'Performance validation', 'Peak conditioning']
      },
      deload: ['Active recovery', 'Adaptation consolidation', 'Fatigue dissipation'],
      maintenance: ['Maintain gains', 'Lifestyle integration', 'Long-term adherence']
    };

    return objectiveMap[blockType]?.[goal] || objectiveMap[blockType] || ['Phase-specific training'];
  };

  const calculateDynamicKeyMetrics = (block, programGoals, chestData, weeks) => {
    const metrics = {};

    if (block.block_type === 'accumulation') {
      // Real volume progression from RP research
      metrics.volume = `${chestData.landmarks.mev}-${chestData.landmarks.mrv} sets`;
      metrics.intensity = '65-80% 1RM';
      metrics.frequency = `${programGoals.availableDays || 4}x/week`;
      metrics.focus = 'Volume Accumulation';

      // Calculate actual volume increase
      const volumeIncrease = Math.round(((chestData.landmarks.mrv - chestData.landmarks.mev) / chestData.landmarks.mev) * 100);
      metrics.progression = `+${volumeIncrease}% volume`;

    } else if (block.block_type === 'intensification') {
      // Intensity-focused metrics
      metrics.intensity = '80-95% 1RM';
      metrics.volume = `${Math.round(chestData.landmarks.mev * 0.8)}-${Math.round(chestData.landmarks.mev * 1.1)} sets`;
      metrics.frequency = `${Math.max(3, programGoals.availableDays - 1)}x/week`;
      metrics.focus = 'Strength Building';
      metrics.progression = '+15-25% load';

    } else if (block.block_type === 'realization') {
      // Peak performance metrics
      metrics.intensity = '95-105% 1RM';
      metrics.volume = `${Math.round(chestData.landmarks.mev * 0.6)}-${Math.round(chestData.landmarks.mev * 0.8)} sets`;
      metrics.tapering = 'Active';
      metrics.focus = 'Performance Peak';
      metrics.progression = 'Peak Testing';

    } else if (block.block_type === 'deload') {
      // Deload metrics
      metrics.intensity = '50-70% 1RM';
      metrics.volume = `${Math.round(chestData.landmarks.mev * 0.4)}-${Math.round(chestData.landmarks.mev * 0.6)} sets`;
      metrics.recovery = 'Primary';
      metrics.focus = 'Recovery';
      metrics.progression = 'Restoration';

    } else {
      // Maintenance metrics
      metrics.intensity = '70-85% 1RM';
      metrics.volume = `${chestData.landmarks.mev}-${Math.round(chestData.landmarks.mev * 1.2)} sets`;
      metrics.frequency = `${Math.max(2, programGoals.availableDays - 1)}x/week`;
      metrics.focus = 'Maintenance';
      metrics.progression = 'Sustain Gains';
    }

    return metrics;
  };

  // Calculate current week based on program start date
  const calculateCurrentWeek = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(diffDays / 7));
  };

  // Initialize mesocycles with RP data
  const mesocycles = generateMesocycles(selectedTemplate, programData);

  // Update current week when component mounts
  useEffect(() => {
    const week = calculateCurrentWeek(programData.startDate);
    setCurrentWeek(week);
    setProgramStartDate(new Date(programData.startDate));
  }, [programData.startDate]);

  // Load existing macrocycle data or create new
  useEffect(() => {
    const loadMacrocycleData = async () => {
      setIsLoading(true);

      try {
        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('macrocycles')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .single();

        // For now, use generated data with real RP calculations
        setMacrocycleData({
          template: selectedTemplate,
          programData,
          mesocycles,
          currentWeek,
          researchVersion: '2024-25',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error loading macrocycle data:', error);
        // Fallback to generated data
        setMacrocycleData({
          template: selectedTemplate,
          programData,
          mesocycles,
          currentWeek,
          researchVersion: '2024-25',
          createdAt: new Date().toISOString()
        });
      } finally {
        setTimeout(() => setIsLoading(false), 1200); // Maintain loading UX
      }
    };

    loadMacrocycleData();
  }, [selectedTemplate, currentWeek]);

  // Save macrocycle changes with research validation
  const saveMacrocycle = async (updatedData) => {
    try {
      // Validate phase durations against RP research
      const validatedData = { ...updatedData };

      validatedData.mesocycles = validatedData.mesocycles.map(phase => {
        const maxDuration = PHASE_DURATION_BASE[phase.blockType]?.max || 8;
        const minDuration = PHASE_DURATION_BASE[phase.blockType]?.min || 2;

        if (phase.weeks > maxDuration || phase.weeks < minDuration) {
          console.warn(`Phase ${phase.name} duration ${phase.weeks} outside research recommendations (${minDuration}-${maxDuration} weeks)`);
        }

        return phase;
      });

      // TODO: Implement Supabase save with validation
      // const { data, error } = await supabase
      //   .from('macrocycles')
      //   .upsert({
      //     ...validatedData,
      //     research_version: '2024-25',
      //     last_modified: new Date().toISOString()
      //   });

      console.log('Saving RP research-based macrocycle data:', validatedData);
      setMacrocycleData(validatedData);

    } catch (error) {
      console.error('Error saving macrocycle:', error);
    }
  };

  // Function to modify phase duration with RP validation
  const modifyPhaseDuration = (phaseId, newDuration) => {
    const phase = mesocycles.find(m => m.id === phaseId);
    if (!phase) return;

    // Validate against RP research
    const recommendedDuration = calculatePhaseDuration(
      phase.blockType === 'accumulation' ? 'hypertrophy' :
        phase.blockType === 'intensification' ? 'strength' :
          phase.blockType === 'realization' ? 'peak' : 'foundation',
      programData.trainingAge,
      programData.goal,
      programData.recoveryScore
    );

    if (Math.abs(newDuration - recommendedDuration) > 2) {
      console.warn(`Duration ${newDuration} weeks differs significantly from RP research recommendation of ${recommendedDuration} weeks`);
    }

    // Update the mesocycle data
    const updatedMesocycles = mesocycles.map(m =>
      m.id === phaseId ? { ...m, weeks: newDuration } : m
    );

    const updatedData = { ...macrocycleData, mesocycles: updatedMesocycles };
    saveMacrocycle(updatedData);
  };

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

  // Enhanced Timeline Card Component with Dynamic Data
  const TimelineCard = ({ mesocycle }) => {
    const isExpanded = expandedPhase === mesocycle.id;
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
      <div
        className={`relative p-6 rounded-2xl border-2 transition-all duration-700 ease-out cursor-pointer group ${mesocycle.status === 'completed'
          ? `bg-gradient-to-br ${mesocycle.gradient}/20 ${mesocycle.borderColor} shadow-lg`
          : mesocycle.status === 'current'
            ? `bg-gradient-to-br ${mesocycle.gradient}/30 ${mesocycle.borderColor} shadow-xl animate-pulse`
            : `bg-gradient-to-br from-gray-800/40 to-gray-700/30 border-gray-600/40 shadow-md`
          } backdrop-blur-sm hover:scale-[1.02] hover:shadow-2xl ${isExpanded ? 'scale-[1.02] shadow-2xl' : ''
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
        {/* Research Badge */}
        {mesocycle.researchBased && (
          <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-400/30">
            RP 2024-25
          </div>
        )}

        {/* Phase Icon & Status Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{mesocycle.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '0.3px'
                }}>
                {mesocycle.name}
                {mesocycle.weeks !== mesocycle.originalWeeks && (
                  <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded border border-yellow-400/30">
                    Modified: {mesocycle.originalWeeks}→{mesocycle.weeks}w
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-300">
                {formatDate(mesocycle.startDate)} - {formatDate(mesocycle.endDate)} • {mesocycle.weeks} weeks
              </p>
              {mesocycle.deloadRecommendation && mesocycle.deloadRecommendation.recommendation !== 'NOT_NEEDED' && (
                <p className="text-xs text-orange-400 mt-1">
                  Deload: {mesocycle.deloadRecommendation.recommendation}
                </p>
              )}
            </div>
          </div>

          {/* Circular Progress Indicator */}
          <div className="flex flex-col items-center space-y-2">
            <CircularProgress
              percentage={mesocycle.progress}
              color={mesocycle.glowColor}
              size={70}
            />
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${mesocycle.status === 'completed'
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

        {/* Expanded Details with Dynamic Data */}
        <div className={`transition-all duration-500 ease-out overflow-hidden ${isExpanded ? 'max-h-[40rem] opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="pt-4 border-t border-gray-600/30 space-y-4">

            {/* Volume Progression Section */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mr-2"></span>
                Volume Progression (RP Research)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(mesocycle.volumeLandmarks || {}).slice(0, 3).map(([muscle, landmarks]) => (
                  <div key={muscle} className="bg-gray-800/50 rounded-lg p-2 text-center backdrop-blur-sm">
                    <p className="text-xs text-gray-400 mb-1 capitalize">{muscle}</p>
                    <p className="text-xs font-semibold text-blue-400">{landmarks.mev}-{landmarks.mrv} sets</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIR Progression Section */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-2"></span>
                RIR Progression (Compound Exercises)
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {mesocycle.rirProgression?.slice(0, 4).map((week, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-2 text-center backdrop-blur-sm">
                    <p className="text-xs text-gray-400">W{week.week}</p>
                    <p className="text-xs font-semibold text-green-400">{week.targetRIR} RIR</p>
                    <p className="text-xs text-gray-500">{week.intensity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase Objectives */}
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

            {/* Dynamic Key Metrics */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-2"></span>
                Key Metrics
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(mesocycle.keyMetrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-800/50 rounded-lg p-2 text-center backdrop-blur-sm">
                    <p className="text-xs text-gray-400 mb-1 capitalize">{key}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deload Analysis */}
            {mesocycle.deloadRecommendation && (
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                <h4 className="text-orange-300 font-semibold mb-2 text-sm">Deload Analysis</h4>
                <p className="text-xs text-orange-200 mb-2">
                  Status: <span className="font-semibold">{mesocycle.deloadRecommendation.recommendation}</span>
                </p>
                {mesocycle.deloadRecommendation.triggers.length > 0 && (
                  <ul className="text-xs text-orange-300 space-y-1">
                    {mesocycle.deloadRecommendation.triggers.slice(0, 2).map((trigger, idx) => (
                      <li key={idx}>• {trigger}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expand/Collapse Indicator */}
        <div className="absolute bottom-4 right-4">
          <div className={`w-6 h-6 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
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
          {/* Loading State */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Page Header with Template Selector */}
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
                  🎯 {programData.name || 'Macrocycle Designer'}
                </h1>
                <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-2"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    letterSpacing: '0.3px'
                  }}>
                  Evidence-based periodization using Renaissance Periodization research (2024-25)
                </p>
                <p className="text-blue-400 text-sm mb-6">
                  Dynamic phase calculations • Real volume progressions • Research-validated deload triggers
                </p>

                {/* Template Selector */}
                <div className="flex justify-center mb-20">
                  <div className="relative">
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="bg-red-600 hover:bg-red-700 border-2 border-red-500 text-white font-black text-xl px-8 py-6 rounded-xl shadow-2xl focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 cursor-pointer min-w-[20rem] uppercase tracking-wide"
                      style={{
                        appearance: 'none',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        paddingLeft: '3rem',
                        letterSpacing: '1px',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                        backgroundColor: '#dc2626 !important',
                        color: '#ffffff !important'
                      }}
                    >
                      {Object.entries(MACROCYCLE_TEMPLATES).map(([key, template]) => (
                        <option
                          key={key}
                          value={key}
                          style={{
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            backgroundColor: '#dc2626',
                            color: '#ffffff'
                          }}
                        >
                          {template.name.toUpperCase()}
                        </option>
                      ))}
                    </select>

                    {/* Clear Dropdown Arrow - Left Side */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-20">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
                        }}
                      >
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Large spacer div to create separation */}
                <div className="h-24 w-full bg-transparent"></div>

                {/* Program Info - Vertical Stack with Dynamic Data */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-4 shadow-lg">
                    <div className="space-y-2 text-center">
                      <div className="text-sm text-gray-400">
                        Goal: <span className="text-blue-400 font-semibold capitalize">{programData.goal}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Duration: <span className="text-green-400 font-semibold">{programData.duration} weeks</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Training Age: <span className="text-purple-400 font-semibold capitalize">{programData.trainingAge}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Days/Week: <span className="text-orange-400 font-semibold">{programData.availableDays}</span>
                      </div>
                      <div className="text-sm text-gray-400 border-t border-gray-600 pt-2 mt-2">
                        Current Week: <span className="text-red-400 font-semibold">{currentWeek}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Started: {new Date(programData.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Timeline Visualization */}
              <CardWrapper title="🎯 RP-Based Training Timeline" subtitle="Evidence-based phase progression with MEV/MRV calculations">
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

              {/* Current Phase Analysis */}
              {mesocycles.find(m => m.status === 'current') && (
                <div className="relative">
                  <CardWrapper
                    title={
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{mesocycles.find(m => m.status === 'current')?.icon}</div>
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
                            Current Phase: {mesocycles.find(m => m.status === 'current')?.name}
                          </h2>
                          <p className="text-green-300 text-lg font-semibold"
                            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                            Week {Math.ceil(mesocycles.find(m => m.status === 'current')?.progress / 100 * mesocycles.find(m => m.status === 'current')?.weeks)} of {mesocycles.find(m => m.status === 'current')?.weeks} • {mesocycles.find(m => m.status === 'current')?.progress}% Complete
                          </p>
                        </div>
                      </div>
                    }
                    subtitle=""
                  >
                    {/* RP Volume Analysis */}
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                      <div className="space-y-6">
                        <h3 className="text-white font-bold text-lg mb-4">Volume Landmarks (RP Research)</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(BASE_VOLUME_LANDMARKS).slice(0, 4).map(([muscle, landmarks]) => (
                            <div key={muscle} className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-500/30">
                              <h4 className="text-blue-300 font-semibold capitalize mb-2">{muscle}</h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">MEV:</span>
                                  <span className="text-blue-400 font-medium">{landmarks.mev} sets</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">MRV:</span>
                                  <span className="text-red-400 font-medium">{landmarks.mrv} sets</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-white font-bold text-lg mb-4">RIR Progression</h3>
                        <div className="space-y-3">
                          {mesocycles.find(m => m.status === 'current')?.rirProgression?.slice(0, 4).map((week, index) => (
                            <div key={index} className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-3 border border-green-500/30">
                              <div className="flex justify-between items-center">
                                <span className="text-green-300 font-semibold">Week {week.week}</span>
                                <div className="text-right">
                                  <div className="text-green-400 font-bold">{week.targetRIR} RIR</div>
                                  <div className="text-gray-400 text-xs">{week.intensity}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </div>
              )}

              {/* RP Research Info */}
              <CardWrapper title="🧬 Renaissance Periodization Integration" subtitle="Evidence-based training methodology">
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">RP Research Applied:</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                        MEV/MRV volume landmarks for all muscle groups
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                        RIR progression schemes by phase length
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                        High SFR exercise recommendations
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                        Training age volume adjustments
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Dynamic Calculations:</h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-3 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Volume Progression</span>
                          <span className="text-blue-400 font-semibold">MEV → MRV</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-3 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">RIR Schemes</span>
                          <span className="text-green-400 font-semibold">4-6 week blocks</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-3 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Deload Timing</span>
                          <span className="text-orange-400 font-semibold">Auto-calculated</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardWrapper>
            </>
          )}
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
