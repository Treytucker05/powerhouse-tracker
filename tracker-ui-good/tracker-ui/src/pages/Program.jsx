import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { supabase } from '../lib/api/supabaseClient';
import { loadAllMacrocycles, deleteMacrocycle } from '../lib/storage';
import ContextAwareBuilder from '../components/builder/ContextAwareBuilder.jsx';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import {
  BASE_VOLUME_LANDMARKS,
  RIR_SCHEMES,
  MACROCYCLE_TEMPLATES,
  HIGH_SFR_EXERCISES,
  GOAL_TYPES,
  PHASE_FOCUS_MAPPING,
  calculateVolumeProgression
} from '../constants/rpConstants';

// Stable, memoized input component that survives parent re-renders
const ProgramNameInput = memo(function ProgramNameInput({ value, onChange, className, placeholder }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
    />
  );
});

// Separate memoized form component to prevent re-rendering
const ProgramForm = memo(({ programData, setProgramData, selectedLevel, error, setError, isLoading, saveProgram, setActiveTab }) => {
  // TEST: Use setProgramData directly instead of handleSetProgramData
  const handleNameChange = useCallback((e) => {
    setProgramData(prev => ({ ...prev, name: e.target.value }));
  }, [setProgramData]);

  const handleGoalChange = useCallback((e) => {
    setProgramData(prev => ({ ...prev, goal: e.target.value }));
  }, [setProgramData]);

  const handleDurationChange = useCallback((e) => {
    setProgramData(prev => ({ ...prev, duration: parseInt(e.target.value) }));
  }, [setProgramData]);

  const handleTrainingDaysChange = useCallback((e) => {
    setProgramData(prev => ({ ...prev, trainingDays: parseInt(e.target.value) }));
  }, [setProgramData]);

  // Consistent input/select styling
  const inputSelectClassName = "w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none appearance-none";

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Program Details</h3>
        {selectedLevel && (
          <div className="bg-red-600 text-white px-3 py-1 rounded text-sm">
            {selectedLevel.toUpperCase()} DESIGN
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Program Name
          </label>
          <ProgramNameInput
            value={programData.name}
            onChange={handleNameChange}
            className={inputSelectClassName}
            placeholder="Enter program name..."
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Primary Goal
          </label>
          <select
            value={programData.goal}
            onChange={handleGoalChange}
            className={inputSelectClassName}
          >
            {GOAL_TYPES.map(goal => (
              <option key={goal.value} value={goal.value}>{goal.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Duration (weeks)
          </label>
          <input
            key="program-duration-field"
            type="number"
            value={programData.duration}
            onChange={handleDurationChange}
            className={inputSelectClassName}
            min="4"
            max="52"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Training Days per Week
          </label>
          <select
            key="program-training-days-field"
            value={programData.trainingDays}
            onChange={handleTrainingDaysChange}
            className={inputSelectClassName}
          >
            <option value="3">3 Days</option>
            <option value="4">4 Days</option>
            <option value="5">5 Days</option>
            <option value="6">6 Days</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 mt-6">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 ml-4"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => saveProgram(programData)}
          disabled={!programData.name.trim() || isLoading || !selectedLevel}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : selectedLevel ? `Continue to ${selectedLevel.toUpperCase()} Design` : 'Select a Planning Level First'}
        </button>
        <button
          onClick={() => {
            setProgramData({ name: '', goal: 'hypertrophy', duration: 12, trainingDays: 4, selectedTemplate: null });
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Clear Form
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Browse Templates
        </button>
      </div>
      {!programData.name.trim() && (
        <p className="text-red-400 text-sm mt-2">Program name is required</p>
      )}
    </div>
  );
});

ProgramForm.displayName = 'ProgramForm';

// Move ProgramBuilder outside Program component to prevent re-creation
const ProgramBuilder = memo(({
  programData, setProgramData, selectedLevel, error, setError, isLoading,
  saveProgram, setActiveTab
}) => {
  return (
    <ContextAwareBuilder
      context={selectedLevel}
      onBack={() => setActiveTab('overview')}
      programData={programData}
      setProgramData={setProgramData}
      selectedLevel={selectedLevel}
      error={error}
      setError={setError}
      isLoading={isLoading}
      saveProgram={saveProgram}
    />
  );
});

ProgramBuilder.displayName = 'ProgramBuilder';

// Helper function for training model recommendations
const getRecommendedModel = (primaryGoal) => {
  const modelMap = {
    'Hypertrophy': 'Block',
    'Strength': 'Linear',
    'Power/Sport': 'Conjugate',
    'Hybrid': 'Undulating'
  };
  return modelMap[primaryGoal] || 'Linear';
};

// Sortable Block Component for drag-and-drop
const SortableBlock = memo(({ id, name, description, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-700 border border-gray-600 rounded-lg p-4 flex items-center space-x-3 ${isDragging ? 'z-50' : ''
        }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-600 rounded"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium">{name}</h4>
          <span className="text-gray-400 text-sm">#{index + 1}</span>
        </div>
        <p className="text-gray-300 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
});

SortableBlock.displayName = 'SortableBlock';

const Program = memo(() => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [recentPrograms, setRecentPrograms] = useState([]);
  const [recentMacrocycles, setRecentMacrocycles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [isLoadingMacrocycles, setIsLoadingMacrocycles] = useState(true);
  const [error, setError] = useState(null);
  const [programData, setProgramData] = useState({
    name: '',
    goal: 'hypertrophy',
    duration: 12,
    trainingDays: 4,
    selectedTemplate: null
  });

  // State persistence for tab switching
  const [savedBuilderState, setSavedBuilderState] = useState({
    macro: null,
    meso: null,
    micro: null
  });

  // Assessment data state
  const [assessmentData, setAssessmentData] = useState(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(true);
  const [assessmentError, setAssessmentError] = useState(null);

  // Training model state
  const [selectedTrainingModel, setSelectedTrainingModel] = useState('');

  // Block sequencing state
  const [blockSequence, setBlockSequence] = useState([
    {
      id: 'accumulation',
      name: 'Accumulation',
      description: 'High volume, lower intensity phase for building work capacity'
    },
    {
      id: 'intensification',
      name: 'Intensification',
      description: 'Moderate volume, higher intensity phase for strength development'
    },
    {
      id: 'realization',
      name: 'Realization',
      description: 'Low volume, peak intensity phase for expressing adaptations'
    },
    {
      id: 'deload',
      name: 'Deload',
      description: 'Recovery phase with reduced volume and intensity'
    }
  ]);

  // Loading parameters calculator state
  const [oneRM, setOneRM] = useState('');
  const [intensity, setIntensity] = useState(80);
  const [targetRIR, setTargetRIR] = useState(2);
  const [loadingResults, setLoadingResults] = useState(null);

  // Movement parameters state
  const [selectedExercise, setSelectedExercise] = useState('');
  const [tempo, setTempo] = useState('');
  const [rom, setRom] = useState('');

  // Training methods state
  const [selectedTrainingMethod, setSelectedTrainingMethod] = useState('');
  const [methodSFR, setMethodSFR] = useState('');

  // Energy systems state
  const [selectedEnergySystem, setSelectedEnergySystem] = useState('');
  const [energySystemNote, setEnergySystemNote] = useState('');

  // Recovery & adaptation state
  const [selectedDeloadType, setSelectedDeloadType] = useState('');
  const [deloadProtocol, setDeloadProtocol] = useState('');

  // Individual considerations state
  const [trainingAge, setTrainingAge] = useState('');
  const [chronotype, setChronotype] = useState('');
  const [chronotypeNote, setChronotypeNote] = useState('');

  // Emerging trends & tech state
  const [selectedTechIntegration, setSelectedTechIntegration] = useState('');
  const [techNote, setTechNote] = useState('');

  // Program preview state
  const [showPreview, setShowPreview] = useState(false);
  const [generatedProgram, setGeneratedProgram] = useState(null);

  const handleSetError = useCallback((error) => {
    setError(error);
  }, []);

  const handleSetActiveTab = useCallback((tab) => {
    // Save current builder state before switching tabs
    if (activeTab === 'builder' && selectedLevel) {
      setSavedBuilderState(prev => ({
        ...prev,
        [selectedLevel]: {
          programData,
          selectedLevel,
          timestamp: Date.now()
        }
      }));
    }
    setActiveTab(tab);
  }, [activeTab, selectedLevel, programData]);

  // Context handlers for different program types
  const handleStartMacrocycle = useCallback(() => {
    // Restore saved state if available
    const savedState = savedBuilderState.macro;
    if (savedState && Date.now() - savedState.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
      setProgramData(savedState.programData);
    }
    setSelectedLevel('macro');
    setActiveTab('builder');
  }, [savedBuilderState]);

  const handleStartMesocycle = useCallback(() => {
    // Restore saved state if available
    const savedState = savedBuilderState.meso;
    if (savedState && Date.now() - savedState.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
      setProgramData(savedState.programData);
    }
    setSelectedLevel('meso');
    setActiveTab('builder');
  }, [savedBuilderState]);

  const handleStartMicrocycle = useCallback(() => {
    // Restore saved state if available
    const savedState = savedBuilderState.micro;
    if (savedState && Date.now() - savedState.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
      setProgramData(savedState.programData);
    }
    setSelectedLevel('micro');
    setActiveTab('builder');
  }, [savedBuilderState]);

  // Load recent programs
  useEffect(() => {
    const loadRecentPrograms = async () => {
      setIsLoadingPrograms(true);
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentPrograms(data || []);
      } catch (error) {
        console.error('Error loading programs:', error);
      } finally {
        setIsLoadingPrograms(false);
      }
    };

    loadRecentPrograms();
  }, []);

  // Load recent macrocycles
  useEffect(() => {
    const loadRecentMacrocyclesData = async () => {
      setIsLoadingMacrocycles(true);
      try {
        const macrocycles = await loadAllMacrocycles();
        const sortedMacrocycles = macrocycles
          .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
          .slice(0, 5); // Show only the 5 most recent
        setRecentMacrocycles(sortedMacrocycles);
      } catch (error) {
        console.error('Error loading macrocycles:', error);
        toast.error('Failed to load recent macrocycles');
      } finally {
        setIsLoadingMacrocycles(false);
      }
    };

    loadRecentMacrocyclesData();
  }, []);

  // Load assessment data
  useEffect(() => {
    const loadAssessmentData = async () => {
      setIsLoadingAssessment(true);
      setAssessmentError(null);

      try {
        // First, check localStorage for existing data
        const localAssessmentData = localStorage.getItem('userProfile');
        let localData = null;

        if (localAssessmentData) {
          localData = JSON.parse(localAssessmentData);
        }

        // Check if user is authenticated and fetch from Supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (!authError && user) {
          // User is authenticated, fetch latest assessment from Supabase
          const { data: supabaseData, error: fetchError } = await supabase
            .from('user_assessments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (!fetchError && supabaseData && supabaseData.length > 0) {
            const latestAssessment = supabaseData[0];

            // Convert Supabase data to local format
            const formattedData = {
              name: latestAssessment.name,
              primaryGoal: latestAssessment.primary_goal,
              trainingAge: latestAssessment.training_age,
              mainPriority: latestAssessment.main_priority,
              energyFocus: latestAssessment.energy_spent,
              organizedArea: latestAssessment.most_organized,
              trainingConstraint: latestAssessment.main_constraint,
              createdAt: latestAssessment.created_at
            };

            // Check if Supabase data is newer than local data
            const shouldUpdateLocal = !localData ||
              !localData.createdAt ||
              new Date(latestAssessment.created_at) > new Date(localData.createdAt);

            if (shouldUpdateLocal) {
              // Update localStorage with newer Supabase data
              localStorage.setItem('userProfile', JSON.stringify(formattedData));
              setAssessmentData(formattedData);
            } else {
              // Use local data if it's newer or same
              setAssessmentData(localData);
            }
          } else {
            // No Supabase data, use local data if available
            setAssessmentData(localData);
          }
        } else {
          // User not authenticated, use local data only
          setAssessmentData(localData);
        }
      } catch (error) {
        console.error('Error loading assessment data:', error);
        setAssessmentError('Failed to load assessment data');

        // Fallback to local data if available
        const localAssessmentData = localStorage.getItem('userProfile');
        if (localAssessmentData) {
          try {
            setAssessmentData(JSON.parse(localAssessmentData));
          } catch (parseError) {
            console.error('Error parsing local assessment data:', parseError);
          }
        }
      } finally {
        setIsLoadingAssessment(false);
      }
    };

    loadAssessmentData();
  }, []);

  // Update selected training model when assessment data changes
  useEffect(() => {
    if (assessmentData && assessmentData.primaryGoal) {
      const recommendedModel = getRecommendedModel(assessmentData.primaryGoal);
      setSelectedTrainingModel(recommendedModel);
    }
  }, [assessmentData]);

  // Set default training age from assessment data
  useEffect(() => {
    if (assessmentData && assessmentData.trainingAge && !trainingAge) {
      setTrainingAge(assessmentData.trainingAge.toString());
    }
  }, [assessmentData, trainingAge]);

  // Handle training model application
  const handleApplyModel = useCallback(() => {
    console.log('Selected Training Model:', selectedTrainingModel);
    console.log('Assessment Data:', assessmentData);
    // Future: Add logic to apply the training model to program creation
  }, [selectedTrainingModel, assessmentData]);

  // Handle block sequencing drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setBlockSequence((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newSequence = arrayMove(items, oldIndex, newIndex);
        console.log('Block sequence updated:', newSequence.map(block => block.name));
        return newSequence;
      });
    }
  }, []);

  // Handle save sequence
  const handleSaveSequence = useCallback(() => {
    console.log('Saving block sequence:', blockSequence.map(block => block.name));
    toast.success('Block sequence saved successfully!');
    // Future: Save to Supabase or localStorage
  }, [blockSequence]);

  // Handle loading calculation
  const handleCalculateLoading = useCallback(() => {
    if (!oneRM || oneRM <= 0) {
      toast.error('Please enter a valid 1RM weight');
      return;
    }

    const weight = parseFloat(oneRM);
    const loadWeight = Math.round((weight * intensity) / 100);

    // Estimate reps based on intensity (%1RM)
    let estimatedReps;
    if (intensity >= 95) estimatedReps = '1-2';
    else if (intensity >= 90) estimatedReps = '2-3';
    else if (intensity >= 85) estimatedReps = '3-5';
    else if (intensity >= 80) estimatedReps = '5-7';
    else if (intensity >= 75) estimatedReps = '6-8';
    else if (intensity >= 70) estimatedReps = '8-10';
    else if (intensity >= 65) estimatedReps = '10-12';
    else estimatedReps = '12-15';

    // Calculate sets based on RIR and intensity
    let recommendedSets;
    if (targetRIR <= 1 && intensity >= 85) recommendedSets = '3-4';
    else if (targetRIR <= 2 && intensity >= 75) recommendedSets = '3-5';
    else recommendedSets = '4-6';

    // Calculate volume (using mid-point of rep range for calculation)
    const repMidpoint = estimatedReps.includes('-')
      ? (parseInt(estimatedReps.split('-')[0]) + parseInt(estimatedReps.split('-')[1])) / 2
      : parseInt(estimatedReps);
    const setMidpoint = recommendedSets.includes('-')
      ? (parseInt(recommendedSets.split('-')[0]) + parseInt(recommendedSets.split('-')[1])) / 2
      : parseInt(recommendedSets);

    const totalVolume = Math.round(setMidpoint * repMidpoint * loadWeight);

    // Get volume landmarks for context (using chest as default)
    const landmarks = BASE_VOLUME_LANDMARKS.chest || { mev: 10, mrv: 20 };

    const results = {
      loadWeight,
      estimatedReps,
      recommendedSets,
      totalVolume,
      landmarks,
      intensity,
      targetRIR
    };

    setLoadingResults(results);

    // Log calculations to console
    console.log('Loading Parameters Calculation:', {
      oneRM: weight,
      intensity: intensity + '%',
      targetRIR,
      loadWeight: loadWeight + ' lbs',
      estimatedReps,
      recommendedSets,
      totalVolume: totalVolume + ' lbs',
      volumeLandmarks: `MEV: ${landmarks.mev} sets, MRV: ${landmarks.mrv} sets`
    });
  }, [oneRM, intensity, targetRIR]);

  // Handle adding movement
  const handleAddMovement = useCallback(() => {
    if (!selectedExercise) {
      toast.error('Please select an exercise');
      return;
    }
    if (!tempo) {
      toast.error('Please enter a tempo');
      return;
    }
    if (!rom) {
      toast.error('Please select a ROM');
      return;
    }

    // Validate tempo format (should be 4 digits)
    if (!/^\d{4}$/.test(tempo)) {
      toast.error('Tempo must be 4 digits (e.g., 3010)');
      return;
    }

    // Log movement parameters to console
    console.log('Movement Parameters Added:', {
      exercise: selectedExercise,
      tempo: tempo,
      rom: rom,
      tempoBreakdown: {
        eccentric: tempo[0] + 's',
        pause1: tempo[1] + 's',
        concentric: tempo[2] + 's',
        pause2: tempo[3] + 's'
      }
    });

    toast.success(`Added ${selectedExercise} with tempo ${tempo} and ${rom} ROM`);

    // Reset form
    setSelectedExercise('');
    setTempo('');
    setRom('');
  }, [selectedExercise, tempo, rom]);

  // Get SFR rating based on training method
  const getSFRRating = useCallback((method) => {
    const sfrMap = {
      'Straight Sets': 'High',
      'Supersets': 'Very High',
      'Cluster Sets': 'Medium',
      'Drop Sets': 'High',
      'French Contrast': 'Very High',
      'Myoreps': 'Medium'
    };
    return sfrMap[method] || '';
  }, []);

  // Handle training method selection
  const handleTrainingMethodChange = useCallback((e) => {
    const method = e.target.value;
    setSelectedTrainingMethod(method);
    setMethodSFR(getSFRRating(method));
  }, [getSFRRating]);

  // Handle apply training method
  const handleApplyMethod = useCallback(() => {
    if (!selectedTrainingMethod) {
      toast.error('Please select a training method');
      return;
    }

    console.log('Applied Training Method:', {
      method: selectedTrainingMethod,
      sfr: methodSFR,
      timestamp: new Date().toISOString()
    });

    toast.success(`Applied ${selectedTrainingMethod} with SFR: ${methodSFR}`);
  }, [selectedTrainingMethod, methodSFR]);

  // Get energy system note based on selection
  const getEnergySystemNote = useCallback((system) => {
    const noteMap = {
      'Aerobic Base': 'Work:Rest 1:1, 20+ min @60-70% HRmax',
      'Anaerobic Capacity': 'Work:Rest 1:3-5, 30s-2min @85-95% HRmax',
      'Hybrid/Concurrent': 'Warning: Potential interference - separate by 6+ hours',
      'Minimize (Hypertrophy Focus)': 'Minimal cardio - 5-10min warm-up only'
    };
    return noteMap[system] || '';
  }, []);

  // Handle energy system selection
  const handleEnergySystemChange = useCallback((e) => {
    const system = e.target.value;
    setSelectedEnergySystem(system);
    setEnergySystemNote(getEnergySystemNote(system));
  }, [getEnergySystemNote]);

  // Handle apply energy system
  const handleApplyEnergySystem = useCallback(() => {
    if (!selectedEnergySystem) {
      toast.error('Please select an energy system focus');
      return;
    }

    console.log('Applied Energy System:', {
      system: selectedEnergySystem,
      workRestRatio: energySystemNote,
      timestamp: new Date().toISOString()
    });

    toast.success(`Applied ${selectedEnergySystem} focus`);
  }, [selectedEnergySystem, energySystemNote]);

  // Get deload protocol based on selection
  const getDeloadProtocol = useCallback((type) => {
    const protocolMap = {
      'Scheduled (RP Style)': 'Every 4-8 weeks at MRV: Drop to MV for 1 week',
      'Earned (OPEX Style)': 'Based on readiness scores: Reduce volume 30-50% when needed',
      'Technical (Bryant Style)': 'Every 3-6 weeks: 60-70% volume, maintain intensity',
      'None': 'No structured deload - push through fatigue'
    };
    return protocolMap[type] || '';
  }, []);

  // Handle deload type selection
  const handleDeloadTypeChange = useCallback((e) => {
    const type = e.target.value;
    setSelectedDeloadType(type);
    setDeloadProtocol(getDeloadProtocol(type));
  }, [getDeloadProtocol]);

  // Handle apply deload
  const handleApplyDeload = useCallback(() => {
    if (!selectedDeloadType) {
      toast.error('Please select a deload approach');
      return;
    }

    console.log('Applied Deload Strategy:', {
      type: selectedDeloadType,
      protocol: deloadProtocol,
      timestamp: new Date().toISOString()
    });

    toast.success(`Applied ${selectedDeloadType} deload strategy`);
  }, [selectedDeloadType, deloadProtocol]);

  // Get chronotype modification note
  const getChronotypeNote = useCallback((type) => {
    const notes = {
      'Lion (Early)': 'Recommend morning sessions for peak performance',
      'Bear (Middle)': 'Mid-morning to afternoon sessions work best',
      'Wolf (Late)': 'Afternoon to evening sessions for optimal performance'
    };
    return notes[type] || '';
  }, []);

  // Handle chronotype selection
  const handleChronotypeChange = useCallback((e) => {
    const type = e.target.value;
    setChronotype(type);
    setChronotypeNote(getChronotypeNote(type));
  }, [getChronotypeNote]);

  // Handle save individual considerations
  const handleSaveConsiderations = useCallback(() => {
    if (!trainingAge || !chronotype) {
      toast.error('Please fill in all individual considerations');
      return;
    }

    console.log('Individual Considerations Saved:', {
      trainingAge: parseFloat(trainingAge),
      chronotype: chronotype,
      modificationNote: chronotypeNote,
      timestamp: new Date().toISOString()
    });

    toast.success('Individual considerations saved successfully');
  }, [trainingAge, chronotype, chronotypeNote]);

  // Get tech integration note
  const getTechNote = useCallback((tech) => {
    const notes = {
      'VBT (Velocity Tracking)': 'Track bar speed for autoregulation - input thresholds like >1.0 m/s for power',
      'AI Optimization': 'Machine learning algorithms analyze training data to suggest optimal loads and recovery',
      'Wearables (HRV/Sleep)': 'Heart rate variability and sleep quality tracking for readiness assessment',
      'Digital Twin': 'Virtual model of athlete physiology for predictive training adaptations',
      'None': 'Traditional training approach without technological integration'
    };
    return notes[tech] || '';
  }, []);

  // Handle tech integration selection
  const handleTechIntegrationChange = useCallback((e) => {
    const tech = e.target.value;
    setSelectedTechIntegration(tech);
    setTechNote(getTechNote(tech));
  }, [getTechNote]);

  // Handle apply tech
  const handleApplyTech = useCallback(() => {
    if (!selectedTechIntegration) {
      toast.error('Please select a tech integration option');
      return;
    }

    console.log('Tech Integration Applied:', {
      techIntegration: selectedTechIntegration,
      description: techNote,
      timestamp: new Date().toISOString()
    });

    toast.success(`Applied ${selectedTechIntegration} integration`);
  }, [selectedTechIntegration, techNote]);

  // Generate program structure based on all parameters
  const generateProgramStructure = useCallback(() => {
    if (!assessmentData || !selectedTrainingModel) return null;

    const duration = programData.duration || 12; // weeks
    const trainingDays = programData.trainingDays || 4;

    // Generate phases based on training model
    let phases = [];
    if (selectedTrainingModel === 'Linear') {
      phases = [
        { name: 'Hypertrophy', weeks: Math.ceil(duration * 0.4), focus: 'Volume/Muscle Building' },
        { name: 'Strength', weeks: Math.ceil(duration * 0.4), focus: 'Strength Development' },
        { name: 'Peaking', weeks: Math.floor(duration * 0.2), focus: 'Peak Performance' }
      ];
    } else if (selectedTrainingModel === 'Block') {
      const blockLength = 4;
      const numBlocks = Math.floor(duration / blockLength);
      phases = blockSequence.slice(0, numBlocks).map((block, index) => ({
        name: block.name,
        weeks: blockLength,
        focus: block.focus || `${block.name} Development`
      }));
    } else if (selectedTrainingModel === 'Conjugate') {
      phases = [
        { name: 'Max Effort Development', weeks: duration, focus: 'Concurrent Training' }
      ];
    } else {
      phases = [
        { name: 'Foundation', weeks: Math.ceil(duration * 0.3), focus: 'Base Building' },
        { name: 'Development', weeks: Math.ceil(duration * 0.5), focus: 'Progressive Overload' },
        { name: 'Realization', weeks: Math.floor(duration * 0.2), focus: 'Goal Achievement' }
      ];
    }

    // Generate weekly outline
    const weeklyOutline = [];
    let currentWeek = 1;

    phases.forEach(phase => {
      for (let week = 0; week < phase.weeks; week++) {
        weeklyOutline.push({
          week: currentWeek,
          phase: phase.name,
          focus: phase.focus,
          trainingDays: trainingDays,
          deloadWeek: selectedDeloadType === 'Scheduled (RP Style)' && currentWeek % 4 === 0,
          energySystemFocus: selectedEnergySystem || 'Mixed',
          techIntegration: selectedTechIntegration || 'None'
        });
        currentWeek++;
      }
    });

    return {
      overview: {
        name: programData.name || 'Custom Training Program',
        goal: programData.goal,
        duration: duration,
        trainingModel: selectedTrainingModel,
        trainingDays: trainingDays,
        trainingAge: trainingAge,
        chronotype: chronotype
      },
      phases: phases,
      weeklyOutline: weeklyOutline.slice(0, duration),
      parameters: {
        movement: { exercise: selectedExercise, tempo: tempo, rom: rom },
        method: { type: selectedTrainingMethod, sfr: methodSFR },
        energySystem: { focus: selectedEnergySystem, note: energySystemNote },
        recovery: { strategy: selectedDeloadType, protocol: deloadProtocol },
        tech: { integration: selectedTechIntegration, description: techNote }
      }
    };
  }, [
    assessmentData, selectedTrainingModel, programData, blockSequence,
    selectedExercise, tempo, rom, selectedTrainingMethod, methodSFR,
    selectedEnergySystem, energySystemNote, selectedDeloadType, deloadProtocol,
    trainingAge, chronotype, selectedTechIntegration, techNote
  ]);

  // Handle preview generation
  const handleGeneratePreview = useCallback(() => {
    const program = generateProgramStructure();
    if (program) {
      setGeneratedProgram(program);
      setShowPreview(true);
      toast.success('Program preview generated!');
    } else {
      toast.error('Please complete assessment and select training model first');
    }
  }, [generateProgramStructure]);

  // Handle save program
  const handleSaveProgram = useCallback(async () => {
    if (!generatedProgram) {
      toast.error('Please generate program preview first');
      return;
    }

    try {
      // Save to localStorage
      const savedPrograms = JSON.parse(localStorage.getItem('savedPrograms') || '[]');
      const newProgram = {
        id: Date.now().toString(),
        ...generatedProgram,
        createdAt: new Date().toISOString(),
        userId: assessmentData?.userId || 'anonymous'
      };

      savedPrograms.push(newProgram);
      localStorage.setItem('savedPrograms', JSON.stringify(savedPrograms));

      // TODO: Save to Supabase if needed
      console.log('Program saved to localStorage:', newProgram);

      toast.success('Program saved successfully!');
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Failed to save program');
    }
  }, [generatedProgram, assessmentData]);

  // Handle export program
  const handleExportProgram = useCallback(() => {
    if (!generatedProgram) {
      toast.error('Please generate program preview first');
      return;
    }

    const exportData = {
      ...generatedProgram,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedProgram.overview.name.replace(/\s+/g, '_')}_program.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Program exported successfully!');
  }, [generatedProgram]);

  // Handle generate full program
  const handleGenerateFullProgram = useCallback(() => {
    const program = generateProgramStructure();

    console.log('Generating macrocycle with all data:', {
      assessment: assessmentData,
      trainingModel: selectedTrainingModel,
      blockSequence: blockSequence,
      loadingResults: loadingResults,
      movement: {
        exercise: selectedExercise,
        tempo: tempo,
        rom: rom
      },
      trainingMethod: {
        method: selectedTrainingMethod,
        sfr: methodSFR
      },
      energySystem: {
        system: selectedEnergySystem,
        workRestRatio: energySystemNote
      },
      deloadStrategy: {
        type: selectedDeloadType,
        protocol: deloadProtocol
      },
      individualConsiderations: {
        trainingAge: trainingAge,
        chronotype: chronotype,
        note: chronotypeNote
      },
      techIntegration: {
        selection: selectedTechIntegration,
        description: techNote
      },
      programData: programData,
      generatedProgram: program,
      timestamp: new Date().toISOString()
    });

    if (program) {
      setGeneratedProgram(program);
      setShowPreview(true);
    }

    toast.success('Program Generated Successfully!');
  }, [
    generateProgramStructure,
    assessmentData,
    selectedTrainingModel,
    blockSequence,
    loadingResults,
    selectedExercise,
    tempo,
    rom,
    selectedTrainingMethod,
    methodSFR,
    selectedEnergySystem,
    energySystemNote,
    selectedDeloadType,
    deloadProtocol,
    trainingAge,
    chronotype,
    chronotypeNote,
    selectedTechIntegration,
    techNote,
    programData
  ]);

  // Save program to Supabase - memoize this function!
  const saveProgram = useCallback(async (programData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('You must be logged in to create a program');
      }

      // Step 1: Create the program record
      const { data: program, error: programError } = await supabase
        .from('programs')
        .insert({
          name: programData.name,
          goal_type: programData.goal,
          duration_weeks: programData.duration,
          training_days_per_week: programData.trainingDays,
          user_id: user.id,
          is_active: true
        })
        .select()
        .single();

      if (programError) throw programError;

      // Step 2: Create program blocks if a template is selected
      if (programData.selectedTemplate && MACROCYCLE_TEMPLATES[programData.selectedTemplate]) {
        const template = MACROCYCLE_TEMPLATES[programData.selectedTemplate];
        const programBlocks = template.blocks.map((block, index) => ({
          program_id: program.id,
          name: `${block.block_type} ${index + 1}`,
          block_type: block.block_type,
          duration_weeks: block.duration_weeks,
          focus: PHASE_FOCUS_MAPPING[block.focus] || block.focus,
          order_index: index,
          is_active: index === 0 // First block is active
        }));

        const { error: blocksError } = await supabase
          .from('program_blocks')
          .insert(programBlocks);

        if (blocksError) {
          console.error('Error creating program blocks:', blocksError);
          // Don't throw here - program was created successfully
          // Just log the error and continue
        }
      }

      // Step 3: Navigate to the appropriate phase designer
      if (selectedLevel === 'macro') {
        navigate('/macrocycle', {
          state: {
            programId: program.id,
            selectedTemplate: programData.selectedTemplate,
            programData: programData
          }
        });
      } else if (selectedLevel === 'meso') {
        navigate('/mesocycle', { state: { programId: program.id } });
      } else {
        navigate('/microcycle', { state: { programId: program.id } });
      }
    } catch (error) {
      console.error('Error saving program:', error);
      setError(`Failed to create program: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, selectedLevel]); // Add dependencies

  // Continue with existing program
  const handleContinueProgram = useCallback(async (program) => {
    try {
      // Navigate based on program type or default to macrocycle
      navigate('/macrocycle', {
        state: {
          programId: program.id,
          programData: {
            name: program.name,
            goal: program.goal_type,
            duration: program.duration_weeks,
            trainingDays: program.training_days_per_week
          }
        }
      });
    } catch (error) {
      console.error('Error continuing program:', error);
      setError(`Failed to continue program: ${error.message}`);
    }
  }, [navigate]);

  // Duplicate existing program
  const handleDuplicateProgram = useCallback(async (program) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('You must be logged in to duplicate a program');
      }

      // Create a copy of the program with a new name
      const { data: duplicatedProgram, error: duplicateError } = await supabase
        .from('programs')
        .insert({
          name: `${program.name} (Copy)`,
          goal_type: program.goal_type,
          duration_weeks: program.duration_weeks,
          training_days_per_week: program.training_days_per_week,
          user_id: user.id,
          is_active: true
        })
        .select()
        .single();

      if (duplicateError) throw duplicateError;

      // Copy program blocks if they exist
      const { data: existingBlocks, error: blocksError } = await supabase
        .from('program_blocks')
        .select('*')
        .eq('program_id', program.id);

      if (!blocksError && existingBlocks && existingBlocks.length > 0) {
        const duplicatedBlocks = existingBlocks.map(block => ({
          program_id: duplicatedProgram.id,
          name: block.name,
          block_type: block.block_type,
          duration_weeks: block.duration_weeks,
          focus: block.focus,
          order_index: block.order_index,
          is_active: block.is_active
        }));

        await supabase
          .from('program_blocks')
          .insert(duplicatedBlocks);
      }

      // Refresh the programs list
      const { data: updatedPrograms, error: refreshError } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!refreshError) {
        setRecentPrograms(updatedPrograms || []);
      }

      setError(null);
      // Optionally show success message
      console.log('Program duplicated successfully');
    } catch (error) {
      console.error('Error duplicating program:', error);
      setError(`Failed to duplicate program: ${error.message}`);
    }
  }, []);

  // Delete existing program
  const handleDeleteProgram = useCallback(async (program) => {
    if (!window.confirm(`Are you sure you want to delete "${program.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('You must be logged in to delete a program');
      }

      // Delete program blocks first (foreign key constraint)
      await supabase
        .from('program_blocks')
        .delete()
        .eq('program_id', program.id);

      // Delete the program
      const { error: deleteError } = await supabase
        .from('programs')
        .delete()
        .eq('id', program.id)
        .eq('user_id', user.id); // Ensure user can only delete their own programs

      if (deleteError) throw deleteError;

      // Refresh the programs list
      const { data: updatedPrograms, error: refreshError } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!refreshError) {
        setRecentPrograms(updatedPrograms || []);
      }

      setError(null);
      // Optionally show success message
      console.log('Program deleted successfully');
    } catch (error) {
      console.error('Error deleting program:', error);
      setError(`Failed to delete program: ${error.message}`);
    }
  }, []);

  // Macrocycle handlers
  const handleContinueMacrocycle = useCallback((macrocycle) => {
    navigate(`/macrocycle/${macrocycle.id}`, {
      state: { macrocycleData: macrocycle }
    });
  }, [navigate]);

  const handleDeleteMacrocycle = useCallback(async (macrocycle) => {
    if (!window.confirm(`Are you sure you want to delete "${macrocycle.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteMacrocycle(macrocycle.id);

      // Refresh the macrocycles list
      const updatedMacrocycles = await loadAllMacrocycles();
      const sortedMacrocycles = updatedMacrocycles
        .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
        .slice(0, 5);
      setRecentMacrocycles(sortedMacrocycles);

      toast.success('Macrocycle deleted successfully');
    } catch (error) {
      console.error('Error deleting macrocycle:', error);
      toast.error('Failed to delete macrocycle');
    }
  }, []);

  const ProgramOverview = ({
    onStartMacrocycle,
    onStartMesocycle,
    onStartMicrocycle,
    assessmentData,
    isLoadingAssessment,
    assessmentError,
    selectedTrainingModel,
    setSelectedTrainingModel,
    handleApplyModel
  }) => (
    <div className="space-y-6 md:space-y-8">
      {/* Assessment Summary */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Your Assessment</h2>
        {isLoadingAssessment ? (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-gray-400">Loading assessment data...</span>
            </div>
          </div>
        ) : assessmentError ? (
          <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg">
            <div className="text-center">
              <div className="text-red-400 mb-2">⚠️ Error loading assessment</div>
              <p className="text-red-200 mb-4">{assessmentError}</p>
              <Link
                to="/assessment"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
              >
                Complete Assessment
              </Link>
            </div>
          </div>
        ) : assessmentData ? (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Assessment Complete ✅</h3>
              <Link
                to="/assessment"
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Update Assessment
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-400 text-sm font-bold">Name:</span>
                <p className="text-white">{assessmentData.name}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold">Primary Goal:</span>
                <p className="text-white">{assessmentData.primaryGoal}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold">Training Age:</span>
                <p className="text-white">{assessmentData.trainingAge} years</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold">Main Priority:</span>
                <p className="text-white">{assessmentData.mainPriority}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold">Energy Spent:</span>
                <p className="text-white">{assessmentData.energyFocus}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold">Most Organized:</span>
                <p className="text-white">{assessmentData.organizedArea}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold">Main Constraint:</span>
                <p className="text-white">{assessmentData.trainingConstraint}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm font-bold">Completed:</span>
                <p className="text-white">
                  {assessmentData.createdAt ? new Date(assessmentData.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-900/30 border border-green-600 rounded-lg">
              <p className="text-green-400 text-sm">
                <span className="font-bold">Ready for personalized training!</span> Your assessment data will help create programs tailored to your goals and constraints.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-white mb-2">Complete your assessment to personalize your program</h3>
              <p className="text-gray-400 mb-6">
                Tell us about your training goals, experience, and lifestyle to get personalized program recommendations.
              </p>
              <Link
                to="/assessment"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors inline-block font-medium"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Training Model Selection - Only show if assessment is complete */}
      {assessmentData && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Training Model</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Select your base training model
                </label>
                <p className="text-gray-400 text-xs mb-3">
                  Recommended for {assessmentData.primaryGoal}: <span className="text-blue-400 font-medium">{getRecommendedModel(assessmentData.primaryGoal)}</span>
                </p>
                <select
                  value={selectedTrainingModel}
                  onChange={(e) => setSelectedTrainingModel(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Choose a training model...</option>
                  <option value="Linear">Linear - Progressive overload with gradual increases</option>
                  <option value="Undulating">Undulating - Varied intensity and volume patterns</option>
                  <option value="Block">Block - Specialized training phases</option>
                  <option value="Conjugate">Conjugate - Multiple training methods simultaneously</option>
                  <option value="Hybrid">Hybrid - Combination of multiple approaches</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {selectedTrainingModel && (
                    <span>Selected: <span className="text-white font-medium">{selectedTrainingModel}</span></span>
                  )}
                </div>
                <button
                  onClick={handleApplyModel}
                  disabled={!selectedTrainingModel}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  Apply Model
                </button>
              </div>
            </div>

            {/* Model descriptions */}
            {selectedTrainingModel && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">{selectedTrainingModel} Training Model</h4>
                <p className="text-gray-300 text-sm">
                  {selectedTrainingModel === 'Linear' && 'Focuses on steady progression with gradual increases in weight, volume, or intensity over time. Best for beginners and strength-focused goals.'}
                  {selectedTrainingModel === 'Undulating' && 'Varies training variables (intensity, volume, exercise selection) within short periods. Good for intermediate trainees and preventing plateaus.'}
                  {selectedTrainingModel === 'Block' && 'Divides training into specific blocks focusing on different adaptations (hypertrophy, strength, power). Excellent for hypertrophy and advanced trainees.'}
                  {selectedTrainingModel === 'Conjugate' && 'Trains multiple qualities simultaneously using different methods on different days. Popular for powerlifting and sport-specific training.'}
                  {selectedTrainingModel === 'Hybrid' && 'Combines elements from multiple training models to address various goals simultaneously. Flexible approach for diverse objectives.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Block Sequencing - Only show if training model is selected and it's Block or Hybrid */}
      {assessmentData && selectedTrainingModel && (selectedTrainingModel === 'Block' || selectedTrainingModel === 'Hybrid') && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Block Sequencing</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Arrange your training blocks in the optimal sequence for your {selectedTrainingModel.toLowerCase()} training model.
              </p>
              <p className="text-gray-400 text-sm">
                Drag and drop the blocks below to customize your training sequence.
              </p>
            </div>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blockSequence.map(block => block.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 mb-6">
                  {blockSequence.map((block, index) => (
                    <SortableBlock
                      key={block.id}
                      id={block.id}
                      name={block.name}
                      description={block.description}
                      index={index}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600">
              <div className="text-sm text-gray-400">
                <span>Current sequence: </span>
                <span className="text-white font-medium">
                  {blockSequence.map(block => block.name).join(' → ')}
                </span>
              </div>
              <button
                onClick={handleSaveSequence}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Save Sequence
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600 rounded-lg">
              <p className="text-blue-400 text-sm">
                <span className="font-bold">Tip:</span> For {selectedTrainingModel.toLowerCase()} training, consider starting with accumulation phases to build a foundation before progressing to higher intensities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Parameters Calculator - Only show if training model is selected */}
      {assessmentData && selectedTrainingModel && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Loading Parameters Calculator</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Calculate training loads based on your 1RM and desired intensity for your {selectedTrainingModel.toLowerCase()} training model.
              </p>
              <p className="text-gray-400 text-sm">
                Enter your one-rep max and select your target intensity to get rep, set, and volume recommendations.
              </p>
            </div>

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Enter 1RM (lbs)
                </label>
                <input
                  type="number"
                  value={oneRM}
                  onChange={(e) => setOneRM(e.target.value)}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 225"
                  min="1"
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Intensity (%1RM)
                </label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value={60}>60% - Light</option>
                  <option value={70}>70% - Moderate</option>
                  <option value={80}>80% - Heavy</option>
                  <option value={90}>90% - Very Heavy</option>
                  <option value={100}>100% - Maximum</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Target RIR (0-5)
                </label>
                <input
                  type="number"
                  value={targetRIR}
                  onChange={(e) => setTargetRIR(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                  min="0"
                  max="5"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mb-6">
              <button
                onClick={handleCalculateLoading}
                disabled={!oneRM || oneRM <= 0}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Calculate Loading
              </button>
            </div>

            {/* Results Display */}
            {loadingResults && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <h4 className="text-white font-medium mb-4">Loading Recommendations</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Working Weight</div>
                    <div className="text-blue-400 text-xl font-bold">{loadingResults.loadWeight} lbs</div>
                    <div className="text-gray-500 text-xs">{loadingResults.intensity}% of 1RM</div>
                  </div>

                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Estimated Reps</div>
                    <div className="text-green-400 text-xl font-bold">{loadingResults.estimatedReps}</div>
                    <div className="text-gray-500 text-xs">@ RIR {loadingResults.targetRIR}</div>
                  </div>

                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Recommended Sets</div>
                    <div className="text-yellow-400 text-xl font-bold">{loadingResults.recommendedSets}</div>
                    <div className="text-gray-500 text-xs">per exercise</div>
                  </div>

                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Total Volume</div>
                    <div className="text-purple-400 text-xl font-bold">{loadingResults.totalVolume.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">lbs (sets × reps × weight)</div>
                  </div>
                </div>

                {/* Volume Landmarks Note */}
                <div className="p-3 bg-gray-700 rounded-lg">
                  <h5 className="text-white font-medium mb-2">Volume Landmarks Reference</h5>
                  <p className="text-gray-300 text-sm">
                    <span className="text-green-400 font-medium">MEV:</span> {loadingResults.landmarks.mev} sets per week •
                    <span className="text-red-400 font-medium ml-2">MRV:</span> {loadingResults.landmarks.mrv} sets per week
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    These are general guidelines for chest. Adjust based on your specific muscle group and recovery capacity.
                  </p>
                </div>

                {/* Training Tips */}
                <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    <span className="font-bold">Training Tip:</span>
                    {loadingResults.intensity >= 85 && ' Focus on perfect form and adequate rest between sets (3-5 minutes).'}
                    {loadingResults.intensity >= 70 && loadingResults.intensity < 85 && ' Great intensity for hypertrophy. Rest 2-3 minutes between sets.'}
                    {loadingResults.intensity < 70 && ' Perfect for high volume work. Rest 1-2 minutes between sets.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Movement Parameters - Only show if training model is selected */}
      {assessmentData && selectedTrainingModel && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Movement Parameters</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Configure exercise-specific parameters for your {selectedTrainingModel.toLowerCase()} training model.
              </p>
              <p className="text-gray-400 text-sm">
                Define tempo, range of motion, and other movement variables for precise exercise execution.
              </p>
            </div>

            {/* Movement Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Exercise
                </label>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select an exercise...</option>
                  <option value="Bench Press">Bench Press</option>
                  <option value="Squat">Squat</option>
                  <option value="Deadlift">Deadlift</option>
                  <option value="Overhead Press">Overhead Press</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Tempo (4-digit: ecc/pause/con/pause)
                </label>
                <input
                  type="text"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 3010"
                  maxLength="4"
                  pattern="[0-9]{4}"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Format: Eccentric-Pause-Concentric-Pause (seconds)
                </p>
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  ROM (Range of Motion)
                </label>
                <select
                  value={rom}
                  onChange={(e) => setRom(e.target.value)}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select ROM...</option>
                  <option value="Full">Full - Complete range of motion</option>
                  <option value="Partial">Partial - Limited range of motion</option>
                  <option value="Stretch Emphasis">Stretch Emphasis - Emphasized stretch position</option>
                </select>
              </div>
            </div>

            {/* Add Movement Button */}
            <div className="mt-4">
              <button
                onClick={handleAddMovement}
                disabled={!selectedExercise || !tempo || !rom}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Add Movement
              </button>
            </div>

            {/* Movement Guide */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-white font-medium mb-3">Movement Parameter Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="text-gray-300 font-medium mb-2">Tempo Examples:</h5>
                  <ul className="text-gray-400 space-y-1">
                    <li><span className="text-white">3010</span> - 3s down, 0s pause, 1s up, 0s pause</li>
                    <li><span className="text-white">4020</span> - 4s down, 0s pause, 2s up, 0s pause</li>
                    <li><span className="text-white">3110</span> - 3s down, 1s pause, 1s up, 0s pause</li>
                    <li><span className="text-white">2210</span> - 2s down, 2s pause, 1s up, 0s pause</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-gray-300 font-medium mb-2">ROM Applications:</h5>
                  <ul className="text-gray-400 space-y-1">
                    <li><span className="text-white">Full:</span> Standard complete range</li>
                    <li><span className="text-white">Partial:</span> Strength curves, sticking points</li>
                    <li><span className="text-white">Stretch Emphasis:</span> Hypertrophy focus</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-orange-900/30 border border-orange-600 rounded-lg">
              <p className="text-orange-400 text-sm">
                <span className="font-bold">Pro Tip:</span> Slower tempos (3-4s eccentric) increase time under tension for hypertrophy, while faster tempos (1-2s) are better for power development.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Training Methods - Only show if training model is selected */}
      {assessmentData && selectedTrainingModel && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Training Methods</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Select a method for this block using your {selectedTrainingModel.toLowerCase()} training model.
              </p>
              <p className="text-gray-400 text-sm">
                Each method has a different Stimulus-to-Fatigue Ratio (SFR) that affects recovery demands.
              </p>
            </div>

            {/* Training Method Selection */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Select a method for this block
                </label>
                <select
                  value={selectedTrainingMethod}
                  onChange={handleTrainingMethodChange}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Choose a training method...</option>
                  <option value="Straight Sets">Straight Sets</option>
                  <option value="Supersets">Supersets</option>
                  <option value="Cluster Sets">Cluster Sets</option>
                  <option value="Drop Sets">Drop Sets</option>
                  <option value="French Contrast">French Contrast</option>
                  <option value="Myoreps">Myoreps</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  SFR Rating
                </label>
                <div className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-lg flex items-center">
                  {methodSFR ? (
                    <span className="font-medium">SFR: {methodSFR}</span>
                  ) : (
                    <span className="text-gray-400">Select a method first</span>
                  )}
                </div>
              </div>
            </div>

            {/* Apply Method Button */}
            <div className="mt-4">
              <button
                onClick={handleApplyMethod}
                disabled={!selectedTrainingMethod}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Apply Method
              </button>
            </div>

            {/* Method Description */}
            {selectedTrainingMethod && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">{selectedTrainingMethod} Method</h4>
                <div className="text-gray-300 text-sm">
                  {selectedTrainingMethod === 'Straight Sets' && (
                    <p>Standard sets with complete rest between each set. High stimulus with manageable fatigue. Perfect for strength and hypertrophy.</p>
                  )}
                  {selectedTrainingMethod === 'Supersets' && (
                    <p>Two exercises performed back-to-back with minimal rest. Very high fatigue but time-efficient. Great for hypertrophy and conditioning.</p>
                  )}
                  {selectedTrainingMethod === 'Cluster Sets' && (
                    <p>Sets broken into smaller clusters with short rest periods. Medium fatigue with high quality reps. Excellent for strength and power.</p>
                  )}
                  {selectedTrainingMethod === 'Drop Sets' && (
                    <p>Continue with reduced weight after reaching failure. High fatigue and metabolic stress. Best for hypertrophy and muscle endurance.</p>
                  )}
                  {selectedTrainingMethod === 'French Contrast' && (
                    <p>Sequence of heavy, explosive, plyometric, and speed exercises. Very high fatigue but develops multiple qualities simultaneously.</p>
                  )}
                  {selectedTrainingMethod === 'Myoreps' && (
                    <p>Activation set followed by short rest periods and mini-sets. Medium fatigue with high metabolic stress. Excellent for hypertrophy.</p>
                  )}
                </div>
                <div className="mt-3 p-2 bg-gray-600 rounded">
                  <span className="text-gray-300 text-xs font-medium">SFR Rating: </span>
                  <span className={`text-xs font-bold ${methodSFR === 'Very High' ? 'text-red-400' :
                    methodSFR === 'High' ? 'text-orange-400' :
                      methodSFR === 'Medium' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                    {methodSFR}
                  </span>
                  <span className="text-gray-400 text-xs ml-2">
                    ({methodSFR === 'Very High' ? 'High recovery demands' :
                      methodSFR === 'High' ? 'Moderate recovery demands' :
                        methodSFR === 'Medium' ? 'Manageable recovery demands' : ''})
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600 rounded-lg">
              <p className="text-blue-400 text-sm">
                <span className="font-bold">Training Tip:</span> Consider your recovery capacity and training phase when selecting methods. Higher SFR methods require more recovery time between sessions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Energy Systems Development - Only show if training model is selected */}
      {assessmentData && selectedTrainingModel && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Energy Systems Development</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Configure energy system emphasis for your {selectedTrainingModel.toLowerCase()} training model.
              </p>
              <p className="text-gray-400 text-sm">
                Select your primary energy system focus to optimize work-to-rest ratios and training intensity.
              </p>
            </div>

            {/* Energy System Selection */}
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Select energy system emphasis
                </label>
                <select
                  value={selectedEnergySystem}
                  onChange={handleEnergySystemChange}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Choose an energy system focus...</option>
                  <option value="Aerobic Base">Aerobic Base</option>
                  <option value="Anaerobic Capacity">Anaerobic Capacity</option>
                  <option value="Hybrid/Concurrent">Hybrid/Concurrent</option>
                  <option value="Minimize (Hypertrophy Focus)">Minimize (Hypertrophy Focus)</option>
                </select>
              </div>

              {/* Energy System Note */}
              {energySystemNote && (
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-gray-300">Recommendation: </span>
                    {energySystemNote}
                  </p>
                </div>
              )}
            </div>

            {/* Apply Energy System Button */}
            <div className="mt-4">
              <button
                onClick={handleApplyEnergySystem}
                disabled={!selectedEnergySystem}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Apply Energy System
              </button>
            </div>

            {/* Energy System Description */}
            {selectedEnergySystem && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">{selectedEnergySystem} Focus</h4>
                <div className="text-gray-300 text-sm">
                  {selectedEnergySystem === 'Aerobic Base' && (
                    <p>Develops aerobic capacity and fat oxidation. Low-intensity, high-volume training that builds endurance foundation and enhances recovery between sessions.</p>
                  )}
                  {selectedEnergySystem === 'Anaerobic Capacity' && (
                    <p>Targets anaerobic power and lactate tolerance. High-intensity intervals that improve performance in short, intense efforts. Requires significant recovery.</p>
                  )}
                  {selectedEnergySystem === 'Hybrid/Concurrent' && (
                    <p>Combines aerobic and anaerobic training. Can lead to interference effects where strength gains may be compromised. Careful programming and timing essential.</p>
                  )}
                  {selectedEnergySystem === 'Minimize (Hypertrophy Focus)' && (
                    <p>Prioritizes muscle growth by minimizing cardio interference. Limited to warm-up and light recovery work to preserve energy for strength training.</p>
                  )}
                </div>

                {/* Special warning for Hybrid/Concurrent */}
                {selectedEnergySystem === 'Hybrid/Concurrent' && (
                  <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-600 rounded">
                    <p className="text-yellow-400 text-xs font-medium">
                      ⚠️ Interference Alert: Separate strength and endurance sessions by at least 6 hours to minimize negative adaptations.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600 rounded-lg">
              <p className="text-purple-400 text-sm">
                <span className="font-bold">Energy Tip:</span> Your energy system focus should align with your primary training goals and the current phase of your program.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recovery & Adaptation - Only show if training model is selected */}
      {assessmentData && selectedTrainingModel && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Recovery & Adaptation</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Configure deload strategy for your {selectedTrainingModel.toLowerCase()} training model.
              </p>
              <p className="text-gray-400 text-sm">
                Select your deload approach to optimize recovery and prevent overreaching.
              </p>
            </div>

            {/* Deload Type Selection */}
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Select deload approach
                </label>
                <select
                  value={selectedDeloadType}
                  onChange={handleDeloadTypeChange}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Choose a deload type...</option>
                  <option value="Scheduled (RP Style)">Scheduled (RP Style)</option>
                  <option value="Earned (OPEX Style)">Earned (OPEX Style)</option>
                  <option value="Technical (Bryant Style)">Technical (Bryant Style)</option>
                  <option value="None">None</option>
                </select>
              </div>

              {/* Deload Protocol Note */}
              {deloadProtocol && (
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-gray-300">Protocol: </span>
                    {deloadProtocol}
                  </p>
                </div>
              )}
            </div>

            {/* Apply Deload Button */}
            <div className="mt-4">
              <button
                onClick={handleApplyDeload}
                disabled={!selectedDeloadType}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Apply Deload
              </button>
            </div>

            {/* Deload Strategy Description */}
            {selectedDeloadType && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">{selectedDeloadType} Strategy</h4>
                <div className="text-gray-300 text-sm">
                  {selectedDeloadType === 'Scheduled (RP Style)' && (
                    <p>Predetermined deloads based on Renaissance Periodization guidelines. MRV (Maximum Recoverable Volume) triggers a mandatory deload week at MV (Maintenance Volume) to restore recovery capacity.</p>
                  )}
                  {selectedDeloadType === 'Earned (OPEX Style)' && (
                    <p>Individualized deloads based on readiness markers and subjective feedback. Only deload when biomarkers indicate accumulated fatigue, allowing for auto-regulation and optimal adaptation.</p>
                  )}
                  {selectedDeloadType === 'Technical (Bryant Style)' && (
                    <p>Technique-focused deloads maintaining intensity while reducing volume. Emphasizes movement quality and skill refinement while allowing physiological recovery.</p>
                  )}
                  {selectedDeloadType === 'None' && (
                    <p>No structured deload protocol. Relies on program completion or external factors to dictate recovery. Higher risk of overreaching but potentially faster adaptation in some individuals.</p>
                  )}
                </div>

                {/* Special considerations for each type */}
                {selectedDeloadType === 'Earned (OPEX Style)' && (
                  <div className="mt-3 p-2 bg-green-900/30 border border-green-600 rounded">
                    <p className="text-green-400 text-xs font-medium">
                      💡 Requires consistent tracking: HRV, sleep quality, motivation, and performance metrics
                    </p>
                  </div>
                )}

                {selectedDeloadType === 'None' && (
                  <div className="mt-3 p-2 bg-red-900/30 border border-red-600 rounded">
                    <p className="text-red-400 text-xs font-medium">
                      ⚠️ Warning: Monitor closely for signs of overreaching, poor recovery, or decreased performance
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 p-3 bg-orange-900/30 border border-orange-600 rounded-lg">
              <p className="text-orange-400 text-sm">
                <span className="font-bold">Recovery Tip:</span> Your deload strategy should match your training experience, recovery capacity, and lifestyle factors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Individual Considerations - Only show if training model is selected */}
      {assessmentData && selectedTrainingModel && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Individual Considerations</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Personalize your program based on individual factors and preferences.
              </p>
              <p className="text-gray-400 text-sm">
                These considerations help optimize training timing and adaptation strategies.
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              {/* Training Age Input */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Training Age (years)
                </label>
                <input
                  type="number"
                  value={trainingAge}
                  onChange={(e) => setTrainingAge(e.target.value)}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter years of training experience..."
                  min="0"
                  step="0.5"
                />
              </div>

              {/* Chronotype Selection */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Chronotype
                </label>
                <select
                  value={chronotype}
                  onChange={handleChronotypeChange}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Select your chronotype...</option>
                  <option value="Lion (Early)">Lion (Early)</option>
                  <option value="Bear (Middle)">Bear (Middle)</option>
                  <option value="Wolf (Late)">Wolf (Late)</option>
                </select>
              </div>

              {/* Chronotype Note */}
              {chronotypeNote && (
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-gray-300">Timing Recommendation: </span>
                    {chronotypeNote}
                  </p>
                </div>
              )}
            </div>

            {/* Save Considerations Button */}
            <div className="mt-4">
              <button
                onClick={handleSaveConsiderations}
                disabled={!trainingAge || !chronotype}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Save Considerations
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600 rounded-lg">
              <p className="text-blue-400 text-sm">
                <span className="font-bold">Personalization Tip:</span> Training age and chronotype influence program periodization and optimal training times.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Emerging Trends & Tech - Only show if training model is selected */}
      {assessmentData && selectedTrainingModel && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Emerging Trends & Tech</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Integrate cutting-edge technology to enhance training effectiveness and monitoring.
              </p>
              <p className="text-gray-400 text-sm">
                Select advanced technologies to incorporate into your training program.
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              {/* Tech Integration Selection */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Select tech feature to add
                </label>
                <select
                  value={selectedTechIntegration}
                  onChange={handleTechIntegrationChange}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
                >
                  <option value="">Choose a tech integration...</option>
                  <option value="VBT (Velocity Tracking)">VBT (Velocity Tracking)</option>
                  <option value="AI Optimization">AI Optimization</option>
                  <option value="Wearables (HRV/Sleep)">Wearables (HRV/Sleep)</option>
                  <option value="Digital Twin">Digital Twin</option>
                  <option value="None">None</option>
                </select>
              </div>

              {/* Tech Note */}
              {techNote && (
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-gray-300">Implementation: </span>
                    {techNote}
                  </p>
                </div>
              )}
            </div>

            {/* Apply Tech Button */}
            <div className="mt-4">
              <button
                onClick={handleApplyTech}
                disabled={!selectedTechIntegration}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Apply Tech
              </button>
            </div>

            <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600 rounded-lg">
              <p className="text-purple-400 text-sm">
                <span className="font-bold">Innovation Tip:</span> Technology integration should enhance, not complicate, your training approach.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Program Preview Section - Only show if assessment and training model are selected */}
      {assessmentData && selectedTrainingModel && (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Program Preview</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            {!showPreview ? (
              <div className="text-center">
                <div className="mb-4">
                  <p className="text-gray-300 mb-2">
                    Generate a preview of your complete training program based on all your selections.
                  </p>
                  <p className="text-gray-400 text-sm">
                    This will create a structured program with phases, weekly breakdown, and all parameters.
                  </p>
                </div>
                <button
                  onClick={handleGeneratePreview}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                >
                  Generate Preview
                </button>
              </div>
            ) : generatedProgram && (
              <div className="space-y-6">
                {/* Program Overview */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-3">Program Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white ml-2">{generatedProgram.overview.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Goal:</span>
                      <span className="text-white ml-2">{generatedProgram.overview.goal}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white ml-2">{generatedProgram.overview.duration} weeks</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Training Model:</span>
                      <span className="text-white ml-2">{generatedProgram.overview.trainingModel}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Training Days:</span>
                      <span className="text-white ml-2">{generatedProgram.overview.trainingDays} per week</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Chronotype:</span>
                      <span className="text-white ml-2">{generatedProgram.overview.chronotype || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Program Phases */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-3">Training Phases</h3>
                  <div className="space-y-2">
                    {generatedProgram.phases.map((phase, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-600 p-3 rounded">
                        <div>
                          <span className="text-white font-medium">{phase.name}</span>
                          <span className="text-gray-400 ml-2">- {phase.focus}</span>
                        </div>
                        <span className="text-blue-400">{phase.weeks} weeks</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Overview */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-3">Weekly Breakdown</h3>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {generatedProgram.weeklyOutline.slice(0, 8).map((week) => (
                      <div key={week.week} className="flex justify-between items-center bg-gray-600 p-2 rounded text-sm">
                        <span className="text-white">Week {week.week}</span>
                        <span className="text-gray-300">{week.phase}</span>
                        <span className="text-gray-400">{week.focus}</span>
                        {week.deloadWeek && <span className="text-yellow-400 text-xs">DELOAD</span>}
                      </div>
                    ))}
                    {generatedProgram.weeklyOutline.length > 8 && (
                      <div className="text-center text-gray-400 text-sm pt-2">
                        ... and {generatedProgram.weeklyOutline.length - 8} more weeks
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Parameters */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-3">Key Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Exercise Focus:</span>
                      <span className="text-white ml-2">{generatedProgram.parameters.movement.exercise || 'Various'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Training Method:</span>
                      <span className="text-white ml-2">{generatedProgram.parameters.method.type || 'Standard Sets'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Energy System:</span>
                      <span className="text-white ml-2">{generatedProgram.parameters.energySystem.focus || 'Mixed'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Recovery Strategy:</span>
                      <span className="text-white ml-2">{generatedProgram.parameters.recovery.strategy || 'Standard'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Tech Integration:</span>
                      <span className="text-white ml-2">{generatedProgram.parameters.tech.integration || 'None'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-600">
                  <button
                    onClick={handleSaveProgram}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex-1"
                  >
                    💾 Save Program
                  </button>
                  <button
                    onClick={handleExportProgram}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex-1"
                  >
                    📤 Export JSON
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    🔄 Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Full Program - Only show if assessment and training model are selected */}
      {assessmentData && selectedTrainingModel && (
        <div className="max-w-md mx-auto px-4">
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700 text-center">
            <div className="mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Ready to Generate?</h3>
              <p className="text-gray-300 text-sm">
                All parameters configured. Generate your complete macrocycle program with all specified settings.
              </p>
            </div>

            <button
              onClick={handleGenerateFullProgram}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 Generate Full Program
            </button>

            <p className="text-gray-400 text-xs mt-3">
              This will compile all your selections into a comprehensive training program
            </p>
          </div>
        </div>
      )}

      {/* Planning Level Selection */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Choose Your Planning Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'macro',
              title: 'MACROCYCLE',
              subtitle: '3-12 months',
              description: 'Long-term periodization with Renaissance Periodization',
              icon: '📅',
              handler: onStartMacrocycle
            },
            {
              id: 'meso',
              title: 'MESOCYCLE',
              subtitle: '4-6 weeks',
              description: 'Training blocks and phases',
              icon: '📊',
              handler: onStartMesocycle
            },
            {
              id: 'micro',
              title: 'MICROCYCLE',
              subtitle: '1 week',
              description: 'Daily workout planning',
              icon: '📋',
              handler: onStartMicrocycle
            }
          ].map((level) => (
            <div
              key={level.id}
              className={`bg-gray-800 rounded-lg p-6 border-2 cursor-pointer transition-all ${selectedLevel === level.id
                ? 'border-red-500 bg-gray-700'
                : 'border-gray-600 hover:border-gray-500'
                }`}
              onClick={() => setSelectedLevel(level.id)}
            >
              <div className="text-3xl mb-3">{level.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{level.title}</h3>
              <p className="text-red-400 text-sm mb-2">{level.subtitle}</p>
              <p className="text-gray-300 text-sm mb-4">{level.description}</p>
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLevel(level.id);
                    level.handler();
                  }}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  START NEW
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('templates');
                  }}
                  className="w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  TEMPLATES
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('calculator')}
            className="bg-red-600 text-white p-4 rounded hover:bg-red-700 transition-colors"
          >
            <div className="text-2xl mb-2">🧮</div>
            <div className="text-sm font-medium">Volume Calculator</div>
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className="bg-red-600 text-white p-4 rounded hover:bg-red-700 transition-colors"
          >
            <div className="text-2xl mb-2">💪</div>
            <div className="text-sm font-medium">Exercise Database</div>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className="bg-red-600 text-white p-4 rounded hover:bg-red-700 transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium">Program Templates</div>
          </button>
          <button className="bg-red-600 text-white p-4 rounded hover:bg-red-700 transition-colors">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-sm font-medium">RP Guidelines</div>
          </button>
        </div>
      </div>

      {/* Recent Programs */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Programs</h3>
        {isLoadingPrograms ? (
          <div className="text-gray-400 text-center py-8">Loading programs...</div>
        ) : recentPrograms.length > 0 ? (
          <div className="space-y-3">
            {recentPrograms.map((program) => (
              <div
                key={program.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div>
                  <h4 className="text-white font-medium">{program.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {program.goal_type} • {program.duration_weeks} weeks • {program.training_days_per_week} days/week
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Created: {new Date(program.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleContinueProgram(program)}
                    className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    title="Continue working on this program"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => handleDuplicateProgram(program)}
                    className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    title="Create a copy of this program"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDeleteProgram(program)}
                    className="bg-red-600 text-black px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    title="Delete this program permanently"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            No recent programs. Create your first program above!
          </div>
        )}
      </div>

      {/* Recent Macrocycles */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Macrocycles</h3>
        {isLoadingMacrocycles ? (
          <div className="text-gray-400 text-center py-8">Loading macrocycles...</div>
        ) : recentMacrocycles.length > 0 ? (
          <div className="space-y-3">
            {recentMacrocycles.map((macrocycle) => (
              <div
                key={macrocycle.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div>
                  <h4 className="text-white font-medium">{macrocycle.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {macrocycle.blocks?.length || 0} blocks • {macrocycle.selectedTemplate || 'Custom'}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {macrocycle.updatedAt
                      ? `Updated: ${new Date(macrocycle.updatedAt).toLocaleDateString()}`
                      : macrocycle.createdAt
                        ? `Created: ${new Date(macrocycle.createdAt).toLocaleDateString()}`
                        : 'No date'
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleContinueMacrocycle(macrocycle)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    title="Continue working on this macrocycle"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => handleDeleteMacrocycle(macrocycle)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    title="Delete this macrocycle permanently"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            No saved macrocycles. Create your first macrocycle above!
          </div>
        )}
      </div>
    </div>
  );

  const VolumeCalculator = () => {
    const [muscleGroup, setMuscleGroup] = useState('chest');
    const [trainingAge, setTrainingAge] = useState('intermediate');
    const [weeks, setWeeks] = useState(4);

    const { landmarks, progression } = calculateVolumeProgression(muscleGroup, weeks, trainingAge);

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Overview
          </button>
          <h2 className="text-2xl font-semibold text-white">RP Volume Calculator</h2>
        </div>

        {/* Interactive Calculator */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Custom Volume Calculation</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Muscle Group</label>
              <select
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                className="w-full bg-white border border-gray-600 text-black px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none"
              >
                {Object.keys(BASE_VOLUME_LANDMARKS).map(muscle => (
                  <option key={muscle} value={muscle} className="capitalize">{muscle}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Training Age</label>
              <select
                value={trainingAge}
                onChange={(e) => setTrainingAge(e.target.value)}
                className="w-full bg-white border border-gray-600 text-black px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="advanced">Advanced (5+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Block Duration</label>
              <input
                type="number"
                value={weeks}
                onChange={(e) => setWeeks(parseInt(e.target.value) || 4)}
                className="w-full bg-white border border-gray-600 text-black px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none"
                min="2"
                max="12"
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h4 className="text-white font-medium mb-3 capitalize">{muscleGroup} Volume Progression</h4>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">MEV</div>
                <div className="text-green-400 text-xl font-bold">{baseLandmarks.mev}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">MRV</div>
                <div className="text-red-400 text-xl font-bold">{baseLandmarks.mrv}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">Week {weeks}</div>
                <div className="text-blue-400 text-xl font-bold">{progression[progression.length - 1]}</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-gray-400">Weekly progression:</span>
              <span className="text-white">{progression.join(' → ')}</span>
            </div>
          </div>
        </div>

        {/* Volume Landmarks Reference Table */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Volume Landmarks Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-300 p-3">Muscle Group</th>
                  <th className="text-center text-gray-300 p-3">MV</th>
                  <th className="text-center text-gray-300 p-3">MEV</th>
                  <th className="text-center text-gray-300 p-3">MRV</th>
                  <th className="text-center text-gray-300 p-3">Example 4-Week</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(BASE_VOLUME_LANDMARKS).map(([muscle, baseLandmarks]) => {
                  const { progression: exampleProgression } = calculateVolumeProgression(muscle, 4);
                  return (
                    <tr key={muscle} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="text-white p-3 capitalize">{muscle}</td>
                      <td className="text-center text-gray-300 p-3">{baseLandmarks.mv}</td>
                      <td className="text-center text-green-400 p-3">{baseLandmarks.mev}</td>
                      <td className="text-center text-red-400 p-3">{baseLandmarks.mrv}</td>
                      <td className="text-center text-gray-300 p-3">
                        {exampleProgression.join(' → ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Volume Landmarks Explained</h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-blue-400 font-medium">MV (Maintenance Volume):</span> <span className="text-gray-300">Minimum volume to maintain current muscle mass</span></p>
            <p><span className="text-green-400 font-medium">MEV (Minimum Effective Volume):</span> <span className="text-gray-300">Minimum volume needed for muscle growth</span></p>
            <p><span className="text-red-400 font-medium">MRV (Maximum Recoverable Volume):</span> <span className="text-gray-300">Maximum volume you can recover from</span></p>
            <p className="text-gray-400 text-xs mt-3">
              <strong>Formula:</strong> Weekly Sets = MEV + (MRV - MEV) × (current_week - 1) / (total_weeks - 1)
            </p>
          </div>
        </div>
      </div>
    );
  };

  const ExerciseDatabase = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setActiveTab('overview')}
          className="text-gray-400 hover:text-white"
        >
          ← Back to Overview
        </button>
        <h2 className="text-2xl font-semibold text-white">High SFR Exercise Database</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(HIGH_SFR_EXERCISES).map(([muscle, exercises]) => (
          <div key={muscle} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 capitalize">{muscle}</h3>
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white text-sm font-medium">{exercise.name}</h4>
                    <span className="text-green-400 text-xs">SFR: {exercise.sfr}</span>
                  </div>
                  <p className="text-gray-400 text-xs capitalize">{exercise.plane} plane</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Templates = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setActiveTab('overview')}
          className="text-gray-400 hover:text-white"
        >
          ← Back to Overview
        </button>
        <h2 className="text-2xl font-semibold text-white">Program Templates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(MACROCYCLE_TEMPLATES).map(([key, template]) => (
          <div key={key} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">{template.name}</h3>
            <p className="text-gray-400 mb-4">{template.duration_weeks} weeks total</p>

            <div className="space-y-2 mb-4">
              {template.blocks.map((block, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded text-sm">
                  <span className="text-white capitalize">{block.block_type}</span>
                  <span className="text-gray-400">{block.duration_weeks}w</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-gray-400 text-sm">
                {template.blocks.length} blocks
              </div>
              <button
                onClick={() => {
                  setProgramData(prev => ({ ...prev, selectedTemplate: key }));
                  setActiveTab('overview');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Program Design</h1>
            <p className="text-gray-400">Create and manage your training programs</p>
          </div>
          <Link
            to="/dashboard"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors w-fit"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-lg p-1 mb-8 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'builder', label: 'Builder' },
            { id: 'templates', label: 'Templates' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSetActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <ProgramOverview
            onStartMacrocycle={handleStartMacrocycle}
            onStartMesocycle={handleStartMesocycle}
            onStartMicrocycle={handleStartMicrocycle}
            assessmentData={assessmentData}
            isLoadingAssessment={isLoadingAssessment}
            assessmentError={assessmentError}
            selectedTrainingModel={selectedTrainingModel}
            setSelectedTrainingModel={setSelectedTrainingModel}
            handleApplyModel={handleApplyModel}
          />
        )}

        {activeTab === 'builder' && (
          <ProgramBuilder
            programData={programData}
            setProgramData={setProgramData}
            selectedLevel={selectedLevel}
            error={error}
            setError={handleSetError}
            isLoading={isLoading}
            saveProgram={saveProgram}
            setActiveTab={handleSetActiveTab}
          />
        )}

        {activeTab === 'templates' && <Templates />}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 ml-4"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
});

Program.displayName = 'Program';

export default Program;