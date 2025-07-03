/**
 * Macrocycle Designer - RP Research Integrated Version
 * Created: July 1, 2025
 * 
 * This version includes:
 * - Full Renaissance Periodization (RP) research integration (2024-25)
 * - Dynamic mesocycle generation with calculatePhaseDuration, calculateVolumeProgression, calculateRIRProgression
 * - Real MEV/MRV volume landmarks and progressions
 * - Research-validated deload recommendations using shouldDeload algorithm
 * - Program Design navigation with tabs and breadcrumb navigation
 * - Comprehensive debug logging and RP compliance validation
 * - Template-based macrocycle creation with research-based modifications
 * - Current phase analysis with live RP volume and RIR data
 * 
 * Key Features:
 * - Evidence-based periodization using latest RP research
 * - Dynamic phase calculations (not static data)
 * - Real-time compliance checking against RP guidelines
 * - Full navigation integration with Program Design workflow
 * - Comprehensive testing and debugging capabilities
 */

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
import { CalendarIcon, ChartBarIcon, TrophyIcon, ClockIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { supabase } from "../lib/supabaseClient";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

// 🐛 DEBUG: Enhanced logging for testing and validation
const DEBUG_MODE = process.env.NODE_ENV === 'development' || true; // Force enable for testing

const debugLog = (category, data, level = 'info') => {
  if (!DEBUG_MODE) return;

  const timestamp = new Date().toISOString();
  const styles = {
    info: 'color: #3b82f6; font-weight: bold;',
    warn: 'color: #f59e0b; font-weight: bold;',
    error: 'color: #ef4444; font-weight: bold;',
    success: 'color: #10b981; font-weight: bold;'
  };

  console.group(`%c🔍 [${category}] ${timestamp}`, styles[level]);
  console.log(data);
  console.groupEnd();
};

const validateRPCompliance = (mesocycles, programData) => {
  debugLog('RP Compliance Check', { mesocycles, programData }, 'info');

  const compliance = {
    volumeLandmarks: true,
    rirProgression: true,
    phaseDurations: true,
    warnings: []
  };

  // Check volume landmarks compliance
  mesocycles.forEach((phase, index) => {
    if (phase.volumeLandmarks) {
      Object.entries(phase.volumeLandmarks).forEach(([muscle, landmarks]) => {
        if (landmarks.mev < 4 || landmarks.mrv > 30) {
          compliance.volumeLandmarks = false;
          compliance.warnings.push(`${muscle} landmarks outside reasonable range: MEV=${landmarks.mev}, MRV=${landmarks.mrv}`);
        }
      });
    }

    // Check RIR progression starts at 4
    if (phase.rirProgression && phase.rirProgression.length > 0) {
      const firstRIR = phase.rirProgression[0].targetRIR;
      if (firstRIR < 4) {
        compliance.rirProgression = false;
        compliance.warnings.push(`Phase ${index + 1} RIR starts below 4: ${firstRIR}`);
      }
    }

    // Check phase duration constraints
    if (phase.weeks < 1 || phase.weeks > 12) {
      compliance.phaseDurations = false;
      compliance.warnings.push(`Phase ${index + 1} duration outside constraints: ${phase.weeks} weeks`);
    }
  });

  debugLog('RP Compliance Results', compliance, compliance.warnings.length > 0 ? 'warn' : 'success');
  return compliance;
};

export default function Macrocycle7125() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🐛 DEBUG: Log navigation state and entry point
  debugLog('Component Mount', {
    entryPoint: location.state ? 'Program Design Navigation' : 'Direct Navigation',
    locationState: location.state,
    pathname: location.pathname,
    componentVersion: 'Macrocycle7.1.25 - RP Research Integrated'
  }, 'info');

  // State management
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [macrocycleData, setMacrocycleData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('hypertrophy_12');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [programStartDate, setProgramStartDate] = useState(new Date());
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mesocycleOrder, setMesocycleOrder] = useState([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // 🐛 DEBUG: Log program data and defaults usage
  debugLog('Program Data Processing', {
    receivedFromNavigation: !!location.state?.programData,
    finalProgramData: programData,
    usedDefaults: !location.state?.programData
  }, 'info');

  // Generate dynamic mesocycles based on RP research (2024-25 Updated)
  const generateMesocycles = (template, programGoals) => {
    // 🐛 DEBUG: Start mesocycle generation timing
    const generationStart = performance.now();
    debugLog('Mesocycle Generation Start', {
      template,
      programGoals,
      templateData: MACROCYCLE_TEMPLATES[template]
    }, 'info');

    const templateData = MACROCYCLE_TEMPLATES[template];
    if (!templateData) {
      debugLog('Template Error', { template, availableTemplates: Object.keys(MACROCYCLE_TEMPLATES) }, 'error');
      return [];
    }

    const mesocycles = [];
    let currentWeekTracker = 1;
    const startDate = new Date(programGoals.startDate || new Date());

    templateData.blocks.forEach((block, index) => {
      // 🐛 DEBUG: Log each block processing
      debugLog(`Processing Block ${index + 1}`, {
        blockType: block.block_type,
        originalDuration: block.duration_weeks,
        focus: block.focus
      }, 'info');

      // Calculate dynamic phase duration using RP research
      const dynamicDuration = calculatePhaseDuration(
        block.block_type === 'accumulation' ? 'hypertrophy' :
          block.block_type === 'intensification' ? 'strength' :
            block.block_type === 'realization' ? 'peak' : 'foundation',
        programGoals.trainingAge,
        programGoals.goal,
        programGoals.recoveryScore
      );

      // 🐛 DEBUG: Log phase duration calculation
      debugLog(`Phase Duration Calculation`, {
        blockType: block.block_type,
        originalDuration: block.duration_weeks,
        dynamicDuration,
        trainingAge: programGoals.trainingAge,
        goal: programGoals.goal,
        recoveryScore: programGoals.recoveryScore
      }, 'info');

      // Use dynamic duration but respect template minimums
      const finalDuration = Math.max(block.duration_weeks, dynamicDuration);

      // Calculate real volume progression for this phase
      const chestData = calculateVolumeProgression('chest', finalDuration, programGoals.trainingAge);
      const backData = calculateVolumeProgression('back', finalDuration, programGoals.trainingAge);
      const quadsData = calculateVolumeProgression('quads', finalDuration, programGoals.trainingAge);

      // 🐛 DEBUG: Log volume calculations
      debugLog(`Volume Progression Calculations`, {
        phaseDuration: finalDuration,
        trainingAge: programGoals.trainingAge,
        chestLandmarks: chestData.landmarks,
        backLandmarks: backData.landmarks,
        quadsLandmarks: quadsData.landmarks,
        chestProgression: chestData.progression,
        backProgression: backData.progression,
        quadsProgression: quadsData.progression
      }, 'info');

      // Calculate real RIR progression
      const exerciseType = block.block_type === 'accumulation' ? 'compound' : 'compound';
      const rirProgression = calculateRIRProgression(finalDuration, exerciseType);

      // 🐛 DEBUG: Log RIR progression calculations
      debugLog(`RIR Progression Calculations`, {
        phaseDuration: finalDuration,
        exerciseType,
        rirProgression,
        startsAt: rirProgression[0]?.targetRIR,
        endsAt: rirProgression[rirProgression.length - 1]?.targetRIR
      }, 'info');

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

      // 🐛 DEBUG: Log deload calculations
      debugLog(`Deload Recommendation`, {
        currentVolume: currentVolumeExample,
        mrvThreshold: chestData.landmarks.mrv,
        deloadCheck,
        weeksSinceDeload: Math.min(currentWeekTracker - 1, 6)
      }, 'info');

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

      // 🐛 DEBUG: Log completed block data
      debugLog(`Block ${index + 1} Complete`, {
        blockData: {
          name: blockData.name,
          weeks: blockData.weeks,
          status: blockData.status,
          progress: blockData.progress,
          startWeek: blockStartWeek,
          endWeek: blockEndWeek
        },
        nextWeekTracker: currentWeekTracker
      }, 'success');
    });

    // 🐛 DEBUG: Log final mesocycle generation results
    const generationEnd = performance.now();
    const generationTime = generationEnd - generationStart;

    debugLog('Mesocycle Generation Complete', {
      totalPhases: mesocycles.length,
      totalWeeks: currentWeekTracker - 1,
      generationTime: `${generationTime.toFixed(2)}ms`,
      phases: mesocycles.map(m => ({ name: m.name, weeks: m.weeks, type: m.blockType }))
    }, 'success');

    // 🐛 DEBUG: Validate RP compliance
    const compliance = validateRPCompliance(mesocycles, programGoals);
    if (compliance.warnings.length > 0) {
      debugLog('RP Compliance Warnings', compliance.warnings, 'warn');
    }

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

  // 🐛 DEBUG: Log mesocycles initialization
  debugLog('Mesocycles Initialized', {
    selectedTemplate,
    totalMesocycles: mesocycles.length,
    mesocycleNames: mesocycles.map(m => m.name),
    totalDuration: mesocycles.reduce((sum, m) => sum + m.weeks, 0)
  }, 'info');

  // Update current week when component mounts
  useEffect(() => {
    const week = calculateCurrentWeek(programData.startDate);
    setCurrentWeek(week);
    setProgramStartDate(new Date(programData.startDate));

    // 🐛 DEBUG: Log current week calculation
    debugLog('Current Week Calculation', {
      startDate: programData.startDate,
      calculatedWeek: week,
      today: new Date().toISOString().split('T')[0]
    }, 'info');
  }, [programData.startDate]);

  // Load existing macrocycle data or create new
  useEffect(() => {
    const loadMacrocycleData = async () => {
      setIsLoading(true);

      // 🐛 DEBUG: Log data loading start
      debugLog('Data Loading Start', {
        selectedTemplate,
        currentWeek,
        mesocycleCount: mesocycles.length
      }, 'info');

      try {
        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('macrocycles')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .single();

        // For now, use generated data with real RP calculations
        const macrocycleData = {
          template: selectedTemplate,
          programData,
          mesocycles,
          currentWeek,
          researchVersion: '2024-25',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };

        setMacrocycleData(macrocycleData);
        setMesocycleOrder(mesocycles.map(m => m.id));

        // 🐛 DEBUG: Log successful data creation
        debugLog('Macrocycle Data Created', {
          template: selectedTemplate,
          phaseCount: mesocycles.length,
          currentWeek,
          researchVersion: '2024-25'
        }, 'success');

      } catch (error) {
        console.error('Error loading macrocycle data:', error);
        debugLog('Data Loading Error', error, 'error');

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
        setTimeout(() => {
          setIsLoading(false);
          debugLog('Loading Complete', { loadingTime: '1200ms' }, 'info');
        }, 1200); // Maintain loading UX
      }
    };

    loadMacrocycleData();
  }, [selectedTemplate, currentWeek]);

  // Save macrocycle changes with research validation
  const saveMacrocycle = async (updatedData) => {
    try {
      // 🐛 DEBUG: Log save operation start
      debugLog('Save Operation Start', {
        dataSize: JSON.stringify(updatedData).length,
        mesocycleCount: updatedData.mesocycles?.length
      }, 'info');

      // Validate phase durations against RP research
      const validatedData = { ...updatedData };

      validatedData.mesocycles = validatedData.mesocycles.map(phase => {
        const maxDuration = PHASE_DURATION_BASE[phase.blockType]?.max || 8;
        const minDuration = PHASE_DURATION_BASE[phase.blockType]?.min || 2;

        if (phase.weeks > maxDuration || phase.weeks < minDuration) {
          const warning = `Phase ${phase.name} duration ${phase.weeks} outside research recommendations (${minDuration}-${maxDuration} weeks)`;
          console.warn(warning);
          debugLog('Validation Warning', {
            phase: phase.name,
            duration: phase.weeks,
            minRecommended: minDuration,
            maxRecommended: maxDuration
          }, 'warn');
        }

        return phase;
      });

      // TODO: Implement Supabase save with validation
      const { data, error } = await supabase
        .from('macrocycles')
        .upsert({
          name: validatedData.name || programData.name,
          goal_type: validatedData.goal_type || programData.goal,
          duration_weeks: validatedData.duration_weeks || programData.duration,
          template_id: selectedTemplate,
          mesocycle_data: validatedData.mesocycles,
          program_data: programData,
          research_version: '2024-25',
          last_modified: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      console.log('Saving RP research-based macrocycle data:', validatedData);
      setMacrocycleData(validatedData);

      // 🐛 DEBUG: Log successful save
      debugLog('Save Operation Complete', {
        template: validatedData.template,
        researchVersion: validatedData.researchVersion,
        lastModified: new Date().toISOString()
      }, 'success');

    } catch (error) {
      console.error('Error saving macrocycle:', error);
      debugLog('Save Operation Error', error, 'error');
    }
  };

  // Function to modify phase duration with RP validation
  const modifyPhaseDuration = (phaseId, newDuration) => {
    // 🐛 DEBUG: Log phase modification attempt
    debugLog('Phase Modification Attempt', {
      phaseId,
      newDuration,
      existingPhases: mesocycles.map(m => ({ id: m.id, name: m.name, weeks: m.weeks }))
    }, 'info');

    const phase = mesocycles.find(m => m.id === phaseId);
    if (!phase) {
      debugLog('Phase Modification Error', { phaseId, error: 'Phase not found' }, 'error');
      return;
    }

    // Validate against RP research
    const recommendedDuration = calculatePhaseDuration(
      phase.blockType === 'accumulation' ? 'hypertrophy' :
        phase.blockType === 'intensification' ? 'strength' :
          phase.blockType === 'realization' ? 'peak' : 'foundation',
      programData.trainingAge,
      programData.goal,
      programData.recoveryScore
    );

    // 🐛 DEBUG: Log validation results
    debugLog('Phase Duration Validation', {
      phaseName: phase.name,
      currentDuration: phase.weeks,
      newDuration,
      recommendedDuration,
      deviation: Math.abs(newDuration - recommendedDuration),
      trainingAge: programData.trainingAge,
      goal: programData.goal
    }, 'info');

    if (Math.abs(newDuration - recommendedDuration) > 2) {
      const warning = `Duration ${newDuration} weeks differs significantly from RP research recommendation of ${recommendedDuration} weeks`;
      console.warn(warning);
      debugLog('Phase Modification Warning', {
        warning,
        significantDeviation: true
      }, 'warn');
    }

    // Update the mesocycle data
    const updatedMesocycles = mesocycles.map(m =>
      m.id === phaseId ? { ...m, weeks: newDuration } : m
    );

    const updatedData = { ...macrocycleData, mesocycles: updatedMesocycles };
    saveMacrocycle(updatedData);

    // 🐛 DEBUG: Log successful modification
    debugLog('Phase Modification Complete', {
      phaseId,
      oldDuration: phase.weeks,
      newDuration,
      updatedTotal: updatedMesocycles.reduce((sum, m) => sum + m.weeks, 0)
    }, 'success');
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Drag and drop handler
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(mesocycles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update IDs and recalculate dates
    const updatedMesocycles = items.map((item, index) => ({
      ...item,
      id: index + 1
    }));

    const updatedData = { ...macrocycleData, mesocycles: updatedMesocycles };
    saveMacrocycle(updatedData);

    debugLog('Mesocycles Reordered', {
      from: result.source.index,
      to: result.destination.index,
      newOrder: updatedMesocycles.map(m => m.name)
    }, 'info');
  };

  // Drag and Drop Handler
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = mesocycles.findIndex(m => m.id === active.id);
      const newIndex = mesocycles.findIndex(m => m.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedMesocycles = arrayMove(mesocycles, oldIndex, newIndex);

        // Update the data with the new order
        const updatedData = { ...macrocycleData, mesocycles: reorderedMesocycles };
        saveMacrocycle(updatedData);

        debugLog('Mesocycle Reorder', {
          from: oldIndex,
          to: newIndex,
          movedPhase: mesocycles[oldIndex].name
        }, 'info');
      }
    }
  }

  // Quick Actions Functions
  const logWorkout = () => {
    debugLog('Quick Action', { action: 'Log Workout', currentWeek }, 'info');
    alert(`Logging workout for Week ${currentWeek}. This would integrate with your workout tracking system.`);
  };

  const checkDeload = () => {
    const currentPhase = mesocycles.find(m => m.status === 'current');
    if (currentPhase?.deloadRecommendation) {
      const rec = currentPhase.deloadRecommendation;
      debugLog('Quick Action', { action: 'Check Deload', recommendation: rec }, 'info');

      const message = `Deload Status: ${rec.recommendation}\n\n` +
        `Current Assessment:\n` +
        `- Volume Status: ${rec.volumeStatus || 'Normal'}\n` +
        `- Fatigue Level: ${rec.fatigueLevel || 'Moderate'}\n` +
        `- Weeks Since Last Deload: ${rec.weeksSinceDeload || 'Unknown'}\n\n` +
        (rec.triggers?.length > 0 ? `Triggers:\n${rec.triggers.join('\n')}` : 'No triggers detected');

      alert(message);
    } else {
      alert('No deload data available for current phase.');
    }
  };

  const viewProgress = () => {
    debugLog('Quick Action', { action: 'View Progress', currentWeek }, 'info');
    const currentPhase = mesocycles.find(m => m.status === 'current');
    const completedPhases = mesocycles.filter(m => m.status === 'completed');

    const progressMessage = `Training Progress Summary:\n\n` +
      `Current Phase: ${currentPhase?.name || 'None'}\n` +
      `Week: ${currentWeek}\n` +
      `Phase Progress: ${currentPhase?.progress || 0}%\n\n` +
      `Completed Phases: ${completedPhases.length}\n` +
      `Total Program Progress: ${Math.round((completedPhases.length / mesocycles.length) * 100)}%`;

    alert(progressMessage);
  };

  const exportToPDF = async () => {
    try {
      debugLog('Export Action', { action: 'Export PDF', phases: mesocycles.length }, 'info');

      const pdf = new jsPDF();

      // Title
      pdf.setFontSize(20);
      pdf.text(`${programData.name || 'Macrocycle'} - Training Plan`, 20, 30);

      // Program info
      pdf.setFontSize(12);
      let yPos = 50;
      pdf.text(`Goal: ${programData.goal}`, 20, yPos);
      pdf.text(`Duration: ${programData.duration} weeks`, 20, yPos + 10);
      pdf.text(`Training Age: ${programData.trainingAge}`, 20, yPos + 20);
      pdf.text(`Days/Week: ${programData.availableDays}`, 20, yPos + 30);

      yPos += 50;

      // Phases
      pdf.setFontSize(16);
      pdf.text('Training Phases:', 20, yPos);
      yPos += 20;

      pdf.setFontSize(12);
      mesocycles.forEach((phase, index) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 30;
        }

        pdf.text(`${index + 1}. ${phase.name}`, 20, yPos);
        pdf.text(`   Duration: ${phase.weeks} weeks`, 20, yPos + 10);
        pdf.text(`   Status: ${phase.status}`, 20, yPos + 20);
        pdf.text(`   Progress: ${phase.progress}%`, 20, yPos + 30);
        yPos += 45;
      });

      pdf.save(`${programData.name || 'macrocycle'}-training-plan.pdf`);
      alert('PDF exported successfully!');

    } catch (error) {
      console.error('PDF export error:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  const exportToCalendar = () => {
    try {
      debugLog('Export Action', { action: 'Export Calendar', phases: mesocycles.length }, 'info');

      let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PowerHouse ATX//Macrocycle Calendar//EN\n';

      mesocycles.forEach((phase, index) => {
        const startDate = new Date(phase.startDate);
        const endDate = new Date(phase.endDate);

        const formatDate = (date) => {
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        icsContent += `BEGIN:VEVENT\n`;
        icsContent += `UID:phase-${phase.id}@powerhouseatx.com\n`;
        icsContent += `DTSTART:${formatDate(startDate)}\n`;
        icsContent += `DTEND:${formatDate(endDate)}\n`;
        icsContent += `SUMMARY:${phase.name}\n`;
        icsContent += `DESCRIPTION:Training Phase ${index + 1} - ${phase.weeks} weeks\\n`;
        icsContent += `Status: ${phase.status}\\n`;
        icsContent += `Objectives: ${phase.objectives?.join(', ') || 'N/A'}\n`;
        icsContent += `END:VEVENT\n`;
      });

      icsContent += 'END:VCALENDAR';

      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${programData.name || 'macrocycle'}-calendar.ics`;
      link.click();
      URL.revokeObjectURL(url);

      alert('Calendar file downloaded! Import it into your calendar app.');

    } catch (error) {
      console.error('Calendar export error:', error);
      alert('Error exporting calendar. Please try again.');
    }
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

  // Sortable Timeline Card Component for Drag & Drop
  const SortableTimelineCard = ({ mesocycle, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: mesocycle.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div ref={setNodeRef} style={style} className="relative">
        {/* Connecting Line */}
        {index < mesocycles.length - 1 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-1 h-8 bg-gradient-to-b from-gray-600 to-transparent z-0"></div>
        )}

        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* Drag Handle */}
          <div className="absolute top-2 left-2 bg-gray-700/50 rounded p-1 text-gray-400 hover:text-white transition-colors z-10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </div>

          <TimelineCard mesocycle={mesocycle} />
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

  // Quick Actions Sidebar Component
  const QuickActionsSidebar = () => (
    <div className={`fixed right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 z-50 transform transition-transform duration-300 ${showQuickActions ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Quick Actions</h3>
          <button
            onClick={() => setShowQuickActions(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current Week Info */}
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/10 rounded-lg p-4 mb-6 border border-blue-500/30">
          <h4 className="text-blue-300 font-semibold mb-2">Current Status</h4>
          <p className="text-white">Week {currentWeek}</p>
          <p className="text-gray-300 text-sm">
            {mesocycles.find(m => m.status === 'current')?.name || 'No active phase'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 flex-1">
          <button
            onClick={logWorkout}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold">Log Workout</span>
          </button>

          <button
            onClick={checkDeload}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Check Deload</span>
          </button>

          <button
            onClick={viewProgress}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg"
          >
            <ChartBarIcon className="w-6 h-6" />
            <span className="font-semibold">View Progress</span>
          </button>

          <div className="border-t border-gray-600 pt-4">
            <h5 className="text-gray-300 font-semibold mb-3">Export Options</h5>

            <button
              onClick={exportToPDF}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 mb-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export PDF</span>
            </button>

            <button
              onClick={exportToCalendar}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-3 rounded-lg transition-all duration-200 flex items-center space-x-3"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Export Calendar</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs">
          <p>PowerHouse ATX • RP Research</p>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="min-h-screen bg-black text-white">
          {/* Quick Actions Sidebar */}
          <QuickActionsSidebar />

          {/* Overlay for mobile */}
          {showQuickActions && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowQuickActions(false)}
            />
          )}

          <div className="max-w-7xl mx-auto px-6 py-8 relative">

            {/* Program Design Header */}
            <div className="mb-10 flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-3">Program Design</h1>
                <p className="text-gray-400 text-lg">Build evidence-based training programs using Renaissance Periodization methodology</p>
              </div>
              {/* Quick Actions Toggle */}
              <button
                onClick={() => setShowQuickActions(true)}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className={isMobile ? 'hidden' : ''}>Quick Actions</span>
              </button>
            </div>

            {/* Program Design Navigation Tabs - Mobile Responsive */}
            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'space-x-2'} mb-10 bg-gray-900/80 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50`}>
              {[
                { id: 'overview', label: 'Overview', icon: '🏠' },
                { id: 'builder', label: 'Builder', icon: '🔧' },
                { id: 'calculator', label: 'Calculator', icon: '🧮' },
                { id: 'exercises', label: 'Exercises', icon: '💪' },
                { id: 'templates', label: 'Templates', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    // 🐛 DEBUG: Log tab navigation
                    debugLog('Navigation Tab Click', {
                      clickedTab: tab.id,
                      currentLocation: location.pathname,
                      timestamp: new Date().toISOString()
                    }, 'info');

                    if (tab.id === 'builder') {
                      // Already on builder page, just scroll to top
                      window.scrollTo(0, 0);
                    } else if (tab.id === 'overview') {
                      navigate('/program');
                    } else {
                      // Navigate to other sections when implemented
                      console.log(`Navigate to ${tab.id} tab`);
                      alert(`${tab.label} section coming soon!`);
                    }
                  }}
                  className={`flex items-center ${isMobile ? 'justify-center' : ''} space-x-3 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${tab.id === 'builder'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500'
                    } ${isMobile ? 'w-full' : ''}`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className={isMobile ? 'text-base' : 'text-sm'}>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    // 🐛 DEBUG: Log back navigation
                    debugLog('Back Navigation Click', {
                      from: 'MacrocycleNew',
                      to: '/program',
                      programData: programData,
                      timestamp: new Date().toISOString()
                    }, 'info');
                    navigate('/program');
                  }}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Back to Program Design</span>
                </button>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Program Design &gt; Builder &gt; Macrocycle</div>
                  <h2 className="text-2xl font-bold text-white">Macrocycle Builder</h2>
                </div>
              </div>
              {/* Show program data if available */}
              {programData && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mt-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{programData.name}</h3>
                  <div className="flex items-center space-x-6 text-sm text-gray-300">
                    <span>Goal: <span className="text-red-400 capitalize">{programData.goal}</span></span>
                    <span>Duration: <span className="text-red-400">{programData.duration} weeks</span></span>
                    <span>Training Age: <span className="text-blue-400 capitalize">{programData.trainingAge}</span></span>
                    <span>Days/Week: <span className="text-green-400">{programData.availableDays}</span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8" id="macrocycle-content">
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
                          onChange={(e) => {
                            const newTemplate = e.target.value;
                            // 🐛 DEBUG: Log template switching
                            const switchStart = performance.now();
                            debugLog('Template Switch Start', {
                              oldTemplate: selectedTemplate,
                              newTemplate,
                              switchTime: switchStart
                            }, 'info');

                            setSelectedTemplate(newTemplate);

                            // 🐛 DEBUG: Log template switch completion
                            setTimeout(() => {
                              const switchEnd = performance.now();
                              debugLog('Template Switch Complete', {
                                newTemplate,
                                switchDuration: `${(switchEnd - switchStart).toFixed(2)}ms`,
                                newMesocycleCount: generateMesocycles(newTemplate, programData).length
                              }, 'success');
                            }, 0);
                          }}
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

                  {/* Enhanced Timeline Visualization with Drag & Drop */}
                  <CardWrapper title="🎯 RP-Based Training Timeline" subtitle="Evidence-based phase progression with MEV/MRV calculations • Drag to reorder phases">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={mesocycles.map(m => m.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-8">
                          {mesocycles.map((mesocycle, index) => (
                            <SortableTimelineCard
                              key={mesocycle.id}
                              mesocycle={mesocycle}
                              index={index}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
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
            </div> {/* End content container */}

            {/* Navigation and Actions */}
            <div className="mt-12 px-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate('/program')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500"
                >
                  <span>← Back to Program Design</span>
                </button>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      debugLog('Save Progress', { template: selectedTemplate, currentWeek });
                      const updatedData = {
                        template: selectedTemplate,
                        mesocycles,
                        currentWeek,
                        lastSaved: new Date().toISOString()
                      };
                      saveMacrocycle(updatedData);
                      alert('Macrocycle configuration saved successfully!');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg"
                  >
                    💾 Save Progress
                  </button>

                  <button
                    onClick={() => {
                      debugLog('Navigate to Mesocycle Builder', { fromMacrocycle: true });
                      navigate('/mesocycle', {
                        state: {
                          fromMacrocycle: true,
                          programData,
                          selectedTemplate,
                          currentWeek
                        }
                      });
                    }}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg transition-all duration-200 font-bold shadow-lg"
                  >
                    <span>Continue to Mesocycle Builder</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

          </div> {/* End max-width container */}
        </div> {/* End full-screen container */}
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
