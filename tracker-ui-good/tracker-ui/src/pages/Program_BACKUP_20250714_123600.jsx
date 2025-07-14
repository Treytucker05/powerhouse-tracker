import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { supabase } from '../lib/api/supabaseClient';
import { loadAllMacrocycles, deleteMacrocycle } from '../lib/storage';
import { programService } from '../services/api';
import ContextAwareBuilder from '../components/builder/ContextAwareBuilder.jsx';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Calendar, List, Plus, Minus } from 'lucide-react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';
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
  programData, setProgramData, selectedLevel, setSelectedLevel, error, setError, isLoading,
  saveProgram, setActiveTab, onStartMacrocycle, onStartMesocycle, onStartMicrocycle
}) => {
  return (
    <ContextAwareBuilder
      context={selectedLevel}
      onBack={() => setActiveTab('overview')}
      programData={programData}
      setProgramData={setProgramData}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      error={error}
      setError={setError}
      isLoading={isLoading}
      saveProgram={saveProgram}
      setActiveTab={setActiveTab}
      onStartMacrocycle={onStartMacrocycle}
      onStartMesocycle={onStartMesocycle}
      onStartMicrocycle={onStartMicrocycle}
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

// Block Palette Component for dragging to calendar
const BlockPalette = memo(({ blockSequence, blockTypeConfig, draggedBlock, setDraggedBlock, selectedTrainingModel }) => {
  // Filter blocks based on training model
  const getFilteredBlocks = () => {
    if (selectedTrainingModel === 'Block') {
      return blockSequence.filter(block => ['accumulation', 'intensification', 'realization', 'deload'].includes(block.id));
    } else if (selectedTrainingModel === 'Hybrid') {
      return blockSequence; // All blocks available
    }
    return blockSequence;
  };

  const filteredBlocks = getFilteredBlocks();

  return (
    <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
      <h4 className="text-white font-medium mb-3 flex items-center">
        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
        Training Block Palette
      </h4>
      <p className="text-gray-400 text-xs mb-3">
        Click a block, then click on the calendar to place it
      </p>
      <div className="grid grid-cols-2 gap-2">
        {filteredBlocks.map((block) => {
          const config = blockTypeConfig[block.id] || { color: '#6B7280', textColor: '#FFFFFF' };
          return (
            <button
              key={block.id}
              onClick={() => setDraggedBlock(draggedBlock?.id === block.id ? null : block)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${draggedBlock?.id === block.id
                ? 'ring-2 ring-white ring-opacity-50 scale-105'
                : 'hover:shadow-lg'
                }`}
              style={{
                backgroundColor: config.color,
                color: config.textColor,
                border: draggedBlock?.id === block.id ? '2px solid #FFFFFF' : 'none'
              }}
              title={`${block.name} - ${block.description}`}
            >
              <div className="font-semibold">{block.name}</div>
              <div className="text-xs opacity-80 mt-1">{config.focus}</div>
            </button>
          );
        })}
      </div>
      {draggedBlock && (
        <div className="mt-3 p-2 bg-blue-900/30 border border-blue-600 rounded text-xs text-blue-300">
          <strong>{draggedBlock.name}</strong> selected. Click on calendar to place.
        </div>
      )}
    </div>
  );
});

BlockPalette.displayName = 'BlockPalette';

// Calendar Event Component
const CalendarEvent = memo(({ event, blockTypeConfig, updateEventWeeks, addDeloadToEvent, handleDeleteEvent }) => {
  const config = blockTypeConfig[event.resource.blockType] || { color: '#6B7280', textColor: '#FFFFFF' };

  return (
    <div
      className="h-full w-full text-xs font-medium flex flex-col justify-center p-1"
      style={{ backgroundColor: config.color, color: config.textColor }}
    >
      <div className="font-semibold truncate">{event.title}</div>
      <div className="opacity-80">{event.resource.weeks}w • {event.resource.focus}</div>
    </div>
  );
});

CalendarEvent.displayName = 'CalendarEvent';

// Event Detail Panel
const EventDetailPanel = memo(({ selectedEvent, blockTypeConfig, updateEventWeeks, addDeloadToEvent, handleDeleteEvent, onClose }) => {
  if (!selectedEvent) return null;

  const config = blockTypeConfig[selectedEvent.resource.blockType] || { color: '#6B7280', textColor: '#FFFFFF' };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{selectedEvent.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Duration (weeks)
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateEventWeeks(selectedEvent.id, Math.max(1, selectedEvent.resource.weeks - 1))}
                className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
                disabled={selectedEvent.resource.weeks <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-medium px-4">{selectedEvent.resource.weeks} weeks</span>
              <button
                onClick={() => updateEventWeeks(selectedEvent.id, Math.min(12, selectedEvent.resource.weeks + 1))}
                className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
                disabled={selectedEvent.resource.weeks >= 12}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Start Date
            </label>
            <p className="text-white">{moment(selectedEvent.start).format('MMMM Do, YYYY')}</p>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              End Date
            </label>
            <p className="text-white">{moment(selectedEvent.end).format('MMMM Do, YYYY')}</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => addDeloadToEvent(selectedEvent.id)}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Add Deload Week
            </button>
            <button
              onClick={() => {
                handleDeleteEvent(selectedEvent.id);
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete Block
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

EventDetailPanel.displayName = 'EventDetailPanel';

// Error boundary component for Program
class ProgramErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Program component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Program Design Error</h1>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-300 mb-4">
                An error occurred while loading the program design interface.
              </p>
              <details className="mb-4">
                <summary className="text-blue-400 cursor-pointer mb-2">Error Details</summary>
                <pre className="text-gray-400 text-sm bg-gray-900 p-3 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Program = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Auto-detect context from URL
  useEffect(() => {
    const path = location.pathname;
    let detectedLevel = null;

    if (path.includes('macrocycle') || path.includes('program-design')) {
      detectedLevel = 'macro';
    } else if (path.includes('mesocycle')) {
      detectedLevel = 'meso';
    } else if (path.includes('microcycle')) {
      detectedLevel = 'micro';
    } else if (path.includes('builder')) {
      detectedLevel = 'macro'; // Default to macro for generic builder
    }

    if (detectedLevel && detectedLevel !== selectedLevel) {
      setSelectedLevel(detectedLevel);
      setActiveTab('builder'); // Auto-switch to builder tab
      console.log(`🎯 Auto-detected ${detectedLevel.toUpperCase()} builder from URL:`, path);
    }
  }, [location.pathname, selectedLevel]);

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

  // Calendar integration for block sequencing
  // Setup moment and localizer
  moment.locale('en');
  const localizer = momentLocalizer(moment);
  const [calendarView, setCalendarView] = useState(true); // true for calendar, false for list
  const [localEvents, setLocalEvents] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Block type configurations with colors for TrainingPeaks-style visualization
  const blockTypeConfig = {
    accumulation: { color: '#3B82F6', textColor: '#FFFFFF', focus: 'Volume' }, // Blue
    intensification: { color: '#F59E0B', textColor: '#000000', focus: 'Intensity' }, // Orange
    realization: { color: '#10B981', textColor: '#FFFFFF', focus: 'Peaking' }, // Green
    deload: { color: '#6B7280', textColor: '#FFFFFF', focus: 'Recovery' }, // Gray
    specialization: { color: '#8B5CF6', textColor: '#FFFFFF', focus: 'Specialization' }, // Purple
    competition: { color: '#EF4444', textColor: '#FFFFFF', focus: 'Competition' } // Red
  };

  // Per-block parameters state
  const [blockParameters, setBlockParameters] = useState({});
  const [activeBlockTab, setActiveBlockTab] = useState('accumulation');

  // Computed values for current block parameters
  const currentBlockParams = blockParameters[activeBlockTab] || {};
  const selectedExercise = currentBlockParams.selectedExercise || '';
  const tempo = currentBlockParams.tempo || '3010';
  const rom = currentBlockParams.rom || 'Full';

  // Get phase-specific defaults
  const getPhaseDefaults = useCallback((blockType) => {
    const defaults = {
      accumulation: {
        intensityRange: [55, 70],
        defaultIntensity: 65,
        defaultRIR: 3,
        suggestedReps: '8-12',
        focus: 'Volume progression, muscle hypertrophy'
      },
      intensification: {
        intensityRange: [70, 85],
        defaultIntensity: 80,
        defaultRIR: 2,
        suggestedReps: '4-8',
        focus: 'Strength development, moderate volume'
      },
      realization: {
        intensityRange: [85, 100],
        defaultIntensity: 90,
        defaultRIR: 1,
        suggestedReps: '1-5',
        focus: 'Peak strength, low volume'
      },
      deload: {
        intensityRange: [40, 60],
        defaultIntensity: 50,
        defaultRIR: 4,
        suggestedReps: '8-15',
        focus: 'Recovery, technique refinement'
      },
      specialization: {
        intensityRange: [60, 80],
        defaultIntensity: 70,
        defaultRIR: 2,
        suggestedReps: '6-10',
        focus: 'Specialized skill development'
      },
      competition: {
        intensityRange: [90, 100],
        defaultIntensity: 95,
        defaultRIR: 0,
        suggestedReps: '1-3',
        focus: 'Competition performance'
      }
    };
    return defaults[blockType] || defaults.accumulation;
  }, []);

  // Initialize block parameters when blockSequence changes
  useEffect(() => {
    setBlockParameters(prevParams => {
      const newParams = { ...prevParams };
      blockSequence.forEach(block => {
        if (!newParams[block.id]) {
          const defaults = getPhaseDefaults(block.id);
          newParams[block.id] = {
            // Loading parameters
            oneRM: '',
            intensity: defaults.defaultIntensity,
            targetRIR: defaults.defaultRIR,
            loadingResults: null,
            // Movement parameters
            exercises: [],
            selectedExercise: '',
            tempo: '3010',
            rom: 'Full'
          };
        }
      });
      return newParams;
    });
  }, [blockSequence, getPhaseDefaults]);

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

  // Load recent programs using ProgramService
  useEffect(() => {
    const loadRecentPrograms = async () => {
      setIsLoadingPrograms(true);
      try {
        const programs = await programService.loadAllPrograms();

        // Sort by creation date and take only recent 5
        const recentPrograms = programs
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentPrograms(recentPrograms);
      } catch (error) {
        console.error('Error loading programs:', error);
        // ProgramService already handles toast notifications
      } finally {
        setIsLoadingPrograms(false);
      }
    };

    loadRecentPrograms();
  }, []);

  // Function to refresh recent programs using ProgramService
  const refreshRecentPrograms = useCallback(async () => {
    try {
      const programs = await programService.loadAllPrograms();

      // Sort by creation date and take only recent 5
      const recentPrograms = programs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentPrograms(recentPrograms);
    } catch (error) {
      console.error('Error refreshing programs:', error);
      // ProgramService already handles toast notifications
    }
  }, []);

  // Load a specific program by ID using ProgramService
  const loadSpecificProgram = useCallback(async (programId) => {
    try {
      const program = await programService.loadProgram(programId);
      return program;
    } catch (error) {
      console.error('Error loading specific program:', error);
      return null;
    }
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
    // Update localEvents based on blockSequence changes
    setLocalEvents(prevEvents => [...prevEvents]); // Trigger re-render
  }, [blockSequence]);

  // Calendar event handlers for block sequencing
  const handleSelectSlot = useCallback((slotInfo) => {
    if (draggedBlock) {
      const newEvent = {
        id: `${draggedBlock.id}-${Date.now()}`,
        title: draggedBlock.name,
        start: slotInfo.start,
        end: moment(slotInfo.start).add(4, 'weeks').toDate(), // Default 4 weeks
        resource: {
          blockType: draggedBlock.id,
          weeks: 4,
          focus: blockTypeConfig[draggedBlock.id]?.focus || 'Training',
          methods: ['Standard Sets'],
          load: 'Moderate'
        }
      };

      setLocalEvents(prev => [...prev, newEvent]);
      setDraggedBlock(null);
      toast.success(`${draggedBlock.name} block added to calendar`);
    }
  }, [draggedBlock, blockTypeConfig]);

  const handleEventResize = useCallback(({ event, start, end }) => {
    setLocalEvents(prev => prev.map(evt =>
      evt.id === event.id
        ? { ...evt, start, end, resource: { ...evt.resource, weeks: moment(end).diff(moment(start), 'weeks') } }
        : evt
    ));
  }, []);

  const handleEventDrop = useCallback(({ event, start, end }) => {
    setLocalEvents(prev => prev.map(evt =>
      evt.id === event.id
        ? { ...evt, start, end }
        : evt
    ));
  }, []);

  const handleDeleteEvent = useCallback((eventId) => {
    setLocalEvents(prev => prev.filter(evt => evt.id !== eventId));
    toast.success('Training block removed from calendar');
  }, []);

  const updateEventWeeks = useCallback((eventId, weeks) => {
    setLocalEvents(prev => prev.map(evt =>
      evt.id === eventId
        ? {
          ...evt,
          end: moment(evt.start).add(weeks, 'weeks').toDate(),
          resource: { ...evt.resource, weeks }
        }
        : evt
    ));
  }, []);

  const addDeloadToEvent = useCallback((eventId) => {
    setLocalEvents(prev => prev.map(evt =>
      evt.id === eventId
        ? {
          ...evt,
          end: moment(evt.end).add(1, 'week').toDate(),
          resource: {
            ...evt.resource,
            weeks: evt.resource.weeks + 1,
            hasDeload: true
          }
        }
        : evt
    ));
    toast.success('Deload week added');
  }, []);

  // Handle per-block loading calculation
  const handleCalculateLoading = useCallback((blockId) => {
    const blockParams = blockParameters[blockId];
    if (!blockParams?.oneRM || blockParams.oneRM <= 0) {
      toast.error('Please enter a valid 1RM weight for this block');
      return;
    }

    const weight = parseFloat(blockParams.oneRM);
    const intensity = blockParams.intensity;
    const targetRIR = blockParams.targetRIR;
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
    const blockDefaults = getPhaseDefaults(blockId);

    const results = {
      loadWeight,
      estimatedReps,
      recommendedSets,
      totalVolume,
      landmarks,
      intensity,
      targetRIR,
      blockType: blockId,
      focus: blockDefaults.focus
    };

    // Update block parameters with results
    setBlockParameters(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        loadingResults: results
      }
    }));

    const blockName = blockSequence.find(b => b.id === blockId)?.name || blockId;
    toast.success(`Loading parameters calculated for ${blockName} block`);
  }, [blockParameters, blockSequence, getPhaseDefaults]);

  // Handle adding exercise to block
  const handleAddExercise = useCallback((blockId) => {
    const blockParams = blockParameters[blockId];
    if (!blockParams?.selectedExercise || !blockParams?.tempo || !blockParams?.rom) {
      toast.error('Please complete all exercise fields');
      return;
    }

    const newExercise = {
      id: Date.now(),
      name: blockParams.selectedExercise,
      tempo: blockParams.tempo,
      rom: blockParams.rom
    };

    setBlockParameters(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        exercises: [...(prev[blockId].exercises || []), newExercise],
        selectedExercise: '',
        tempo: '3010',
        rom: 'Full'
      }
    }));

    const blockName = blockSequence.find(b => b.id === blockId)?.name || blockId;
    toast.success(`Exercise added to ${blockName} block`);
  }, [blockParameters, blockSequence]);

  // Update block parameter helper
  const updateBlockParameter = useCallback((blockId, field, value) => {
    setBlockParameters(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        [field]: value
      }
    }));
  }, []);

  // Handle adding movement (this is now handled by handleAddExercise above)
  // Legacy function - kept for compatibility
  const handleAddMovement = useCallback(() => {
    // This functionality has been moved to per-block handleAddExercise
    toast.info('Please use the block-specific exercise addition in the Loading & Movement Parameters section');
  }, []);

  // Remove exercise from block
  const handleRemoveExercise = useCallback((blockId, exerciseId) => {
    setBlockParameters(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        exercises: prev[blockId].exercises?.filter(ex => ex.id !== exerciseId) || []
      }
    }));

    toast.success('Exercise removed from block');
  }, []);

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
        movement: { exercise: selectedExercise, tempo: rom },
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

    // Log programData before save as requested
    console.log('programData before save:', programData);

    try {
      const newProgram = {
        id: Date.now().toString(),
        ...generatedProgram,
        createdAt: new Date().toISOString(),
        userId: assessmentData?.userId || 'anonymous'
      };

      // Save to localStorage first (always works as fallback)
      const savedPrograms = JSON.parse(localStorage.getItem('savedPrograms') || '[]');
      savedPrograms.push(newProgram);
      localStorage.setItem('savedPrograms', JSON.stringify(savedPrograms));

      // Try to save to Supabase with improved error handling
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.warn('Authentication error, saving locally only:', authError);
          toast.success('Saved locally—check internet for cloud sync');
          return;
        }

        if (user) {
          // Ensure 'programs' table has required columns (id, user_id, name, model, blockSequence, etc.)
          const { error: supabaseError } = await supabase
            .from('programs')
            .insert({
              id: newProgram.id,
              name: newProgram.overview.name,
              goal_type: newProgram.overview.goal,
              duration_weeks: newProgram.overview.duration,
              training_days_per_week: newProgram.overview.trainingDays,
              user_id: user.id,
              // Store model and blockSequence in JSON columns
              model: newProgram.overview.trainingModel,
              block_sequence: JSON.stringify(newProgram.phases || []),
              phases: JSON.stringify(newProgram.phases),
              weekly_outline: JSON.stringify(newProgram.weeklyOutline),
              parameters: JSON.stringify(newProgram.parameters),
              created_at: newProgram.createdAt,
              is_active: true
            });

          if (supabaseError) {
            console.warn('Supabase insert failed, using localStorage fallback:', supabaseError);
            toast.success('Saved locally—check internet for cloud sync');
          } else {
            console.log('Program saved to both localStorage and Supabase');
            toast.success('Program saved successfully!');
          }
        } else {
          // No user authentication, use localStorage only
          console.log('No authenticated user, saved locally only');
          toast.success('Saved locally—check internet for cloud sync');
        }
      } catch (supabaseError) {
        console.warn('Supabase save failed, but localStorage succeeded:', supabaseError);
        toast.success('Saved locally—check internet for cloud sync');
      }

      // Refresh the recent programs list to show the new program
      await refreshRecentPrograms();

      console.log('Program saved successfully:', newProgram);
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Failed to save program');
    }
  }, [generatedProgram, assessmentData, refreshRecentPrograms, programData]);

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
    // Log programData before generation as requested
    console.log('programData before generation:', programData);

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

  // Save program using ProgramService - enhanced with conflict handling
  const saveProgram = useCallback(async (programData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Log programData before save as requested
      console.log('programData before saveProgram:', programData);

      // Validate required fields
      if (!programData.name?.trim()) {
        throw new Error('Program name is required');
      }

      // Prepare complete program data
      const completeProgram = {
        name: programData.name.trim(),
        description: programData.description || '',
        type: selectedLevel || 'macro',
        goal: programData.goal,
        duration: programData.duration,
        trainingDaysPerWeek: programData.trainingDays,
        selectedTemplate: programData.selectedTemplate,
        assessmentId: assessmentData?.id,
        totalDuration: programData.duration,
        isActive: true,
        blocks: []
      };

      // Add blocks if template is selected
      if (programData.selectedTemplate && MACROCYCLE_TEMPLATES[programData.selectedTemplate]) {
        const template = MACROCYCLE_TEMPLATES[programData.selectedTemplate];
        completeProgram.blocks = template.blocks.map((block, index) => ({
          id: `block_${Date.now()}_${index}`,
          name: `${block.block_type} ${index + 1}`,
          type: block.block_type,
          duration: block.duration_weeks,
          focus: PHASE_FOCUS_MAPPING[block.focus] || block.focus,
          order: index,
          isActive: index === 0
        }));
      }

      // Try ProgramService first, with enhanced error handling for Supabase fallback
      let savedProgram;
      try {
        savedProgram = await programService.saveProgram(completeProgram);
        console.log('Program saved via ProgramService:', savedProgram);
      } catch (serviceError) {
        console.warn('ProgramService failed, attempting direct Supabase save:', serviceError);

        // Fallback: try direct Supabase save with auth handling
        try {
          const { data: { user }, error: authError } = await supabase.auth.getUser();

          if (authError || !user) {
            // No auth, save to localStorage only
            const localProgram = {
              ...completeProgram,
              id: Date.now().toString(),
              createdAt: new Date().toISOString()
            };
            localStorage.setItem('currentProgram', JSON.stringify(localProgram));
            toast.success('Saved locally—check internet for cloud sync');
            savedProgram = localProgram;
          } else {
            // Try direct Supabase insert with proper column mapping
            const { data: supabaseProgram, error: insertError } = await supabase
              .from('programs')
              .insert({
                name: completeProgram.name,
                goal_type: completeProgram.goal,
                duration_weeks: completeProgram.duration,
                training_days_per_week: completeProgram.trainingDaysPerWeek,
                user_id: user.id,
                is_active: completeProgram.isActive,
                // Store additional data in JSON fields
                model: selectedLevel || 'macro',
                block_sequence: JSON.stringify(completeProgram.blocks)
              })
              .select()
              .single();

            if (insertError) {
              // Supabase failed, use localStorage fallback
              const localProgram = {
                ...completeProgram,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
              };
              localStorage.setItem('currentProgram', JSON.stringify(localProgram));
              toast.success('Saved locally—check internet for cloud sync');
              savedProgram = localProgram;
            } else {
              savedProgram = supabaseProgram;
              toast.success('Program saved successfully!');
            }
          }
        } catch (fallbackError) {
          // Final fallback to localStorage only
          console.error('All save methods failed, using localStorage only:', fallbackError);
          const localProgram = {
            ...completeProgram,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('currentProgram', JSON.stringify(localProgram));
          toast.success('Saved locally—check internet for cloud sync');
          savedProgram = localProgram;
        }
      }

      // Update local state
      setRecentPrograms(prev => [savedProgram, ...prev.slice(0, 4)]);

      // Navigate to appropriate phase designer
      if (selectedLevel === 'macro') {
        navigate('/macrocycle', {
          state: {
            programId: savedProgram.id,
            selectedTemplate: programData.selectedTemplate,
            programData: savedProgram
          }
        });
      } else if (selectedLevel === 'meso') {
        navigate('/mesocycle', { state: { programId: savedProgram.id } });
      } else if (selectedLevel === 'micro') {
        navigate('/microcycle', { state: { programId: savedProgram.id } });
      }

    } catch (error) {
      console.error('Error saving program:', error);
      setError(error.message || 'Failed to save program');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLevel, assessmentData, navigate, setRecentPrograms, programData]);

  // Continue with existing program
  const handleContinueProgram = useCallback(async (program) => {
    try {
      // Navigate based on program type or default to macrocycle
      navigate('/macrocycle', {
        state: {
          programId: program.id,
          programData: {
            name: program.name,
            goal: program.goal,
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

  // Delete program using ProgramService
  const handleDeleteProgram = useCallback(async (program) => {
    if (!window.confirm(`Are you sure you want to delete "${program.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Use ProgramService for deletion with conflict handling
      const success = await programService.deleteProgram(program.id);

      if (success) {
        // Refresh the programs list
        await refreshRecentPrograms();
        setError(null);
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      setError(`Failed to delete program: ${error.message}`);
    }
  }, [refreshRecentPrograms]);

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
  }) => {
    // Accordion state management
    const [openAccordion, setOpenAccordion] = useState('assessment'); // Always open assessment by default

    const toggleAccordion = (value) => {
      setOpenAccordion(openAccordion === value ? '' : value);
    };

    // Auto-expand next section when Apply button is clicked
    const handleApplyWithNext = (currentSection, nextSection, applyFunction) => {
      applyFunction();
      if (nextSection) {
        setTimeout(() => setOpenAccordion(nextSection), 300);
      }
    };

    // Accordion Item Component with Shadcn styling
    const AccordionItem = ({ value, title, children, stepNumber, isComplete, instructions }) => (
      <div className="border border-gray-700 rounded-lg bg-gray-800/50">
        <button
          onClick={() => toggleAccordion(value)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/50 transition-colors rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isComplete ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
              {stepNumber}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {instructions && (
                <p className="text-gray-400 text-sm">{instructions}</p>
              )}
            </div>
          </div>
          <div className={`transform transition-transform ${openAccordion === value ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {openAccordion === value && (
          <div className="px-4 pb-4 space-y-4">
            {children}
          </div>
        )}
      </div>
    );

    return (
      <div className="space-y-4 max-w-6xl mx-auto">
        {/* Step 1: Assessment Summary (Always Open) */}
        <AccordionItem
          value="assessment"
          stepNumber="1"
          title="Assessment Summary"
          instructions="Your training profile and personalized recommendations"
          isComplete={!!assessmentData}
        >
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
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Assessment Complete
                </h4>
                <Link
                  to="/assessment"
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                  title="Update your assessment data"
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
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="text-center">
                <div className="text-yellow-400 mb-2">📝 Assessment Required</div>
                <p className="text-gray-300 mb-4">Complete your assessment to begin program design</p>
                <Link
                  to="/assessment"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                >
                  Start Assessment
                </Link>
              </div>
            </div>
          )}
        </AccordionItem>

        {/* Step 2: Training Model */}
        {assessmentData && (
          <AccordionItem
            value="training-model"
            stepNumber="2"
            title="Training Model"
            instructions="Select your periodization approach"
            isComplete={!!selectedTrainingModel}
          >
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                   
                    Select your base training model
                    <span className="text-gray-400 ml-2" title="Your periodization strategy determines how training variables progress over time">ℹ️</span>
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
                    onClick={() => handleApplyWithNext('training-model', 'block-sequencing', handleApplyModel)}
                    disabled={!selectedTrainingModel}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    title="Apply this training model and continue to next step"
                  >
                    Apply Model
                  </button>
                </div>
              </div>

              {/* Model descriptions */}
              {selectedTrainingModel && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <h5 className="text-white font-medium mb-2">{selectedTrainingModel} Training Model</h5>
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
          </AccordionItem>
        )}

        {/* Step 3: Block Sequencing - Calendar Integration */}
        {assessmentData && selectedTrainingModel && (selectedTrainingModel === 'Block' || selectedTrainingModel === 'Hybrid') && (
          <AccordionItem
            value="block-sequencing"
            stepNumber="3"
            title="Block Sequencing"
            instructions="Drag blocks to calendar for visual sequencing—adjust weeks with controls"
            isComplete={localEvents.length > 0}
          >
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="mb-4">
                <p className="text-gray-300 mb-2">
                  Design your training sequence using our TrainingPeaks-inspired calendar interface.
                </p>
                <p className="text-gray-400 text-sm">
                  Select training blocks from the palette and place them on the calendar to create your periodization plan.
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCalendarView(true)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${calendarView
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Calendar View</span>
                  </button>
                  <button
                    onClick={() => setCalendarView(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${!calendarView
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    <List className="w-4 h-4" />
                    <span>List View</span>
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  {localEvents.length} blocks scheduled
                </div>
              </div>

              {calendarView ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Block Palette */}
                  <div className="lg:col-span-1">
                    <BlockPalette
                      blockSequence={blockSequence}
                      blockTypeConfig={blockTypeConfig}
                      draggedBlock={draggedBlock}
                      setDraggedBlock={setDraggedBlock}
                      selectedTrainingModel={selectedTrainingModel}
                    />
                  </div>

                  {/* Calendar */}
                  <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg p-4" style={{ height: '500px' }}>
                      <BigCalendar
                        localizer={localizer}
                        events={localEvents}
                        startAccessor="start"
                        endAccessor="end"
                        views={['month']}
                        defaultView="month"
                        selectable={true}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={(event) => setSelectedEvent(event)}
                        onEventDrop={handleEventDrop}
                        onEventResize={handleEventResize}
                        resizable={true}
                        dragFromOutsideItem={null}
                        components={{
                          event: (props) => (
                            <CalendarEvent
                              {...props}
                              blockTypeConfig={blockTypeConfig}
                              updateEventWeeks={updateEventWeeks}
                              addDeloadToEvent={addDeloadToEvent}
                              handleDeleteEvent={handleDeleteEvent}
                            />
                          )
                        }}
                        eventPropGetter={(event) => {
                          const config = blockTypeConfig[event.resource.blockType] || { color: '#6B7280' };
                          return {
                            style: {
                              backgroundColor: config.color,
                              borderColor: config.color,
                              border: 'none',
                              borderRadius: '4px',
                              color: config.textColor || '#FFFFFF'
                            }
                          };
                        }}
                        dayPropGetter={(date) => ({
                          style: {
                            backgroundColor: moment().isSame(date, 'day') ? '#FEF3C7' : '#FFFFFF'
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
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

                  <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Scheduled Events</h4>
                    {localEvents.length > 0 ? (
                      <div className="space-y-2">
                        {localEvents
                          .sort((a, b) => new Date(a.start) - new Date(b.start))
                          .map((event) => (
                            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-600 rounded">
                              <div>
                                <span className="text-white font-medium">{event.title}</span>
                                <span className="text-gray-300 ml-2">
                                  {moment(event.start).format('MMM DD')} - {moment(event.end).format('MMM DD, YYYY')}
                                </span>
                                <span className="text-gray-400 ml-2">({event.resource.weeks} weeks)</span>
                              </div>
                              <button
                                onClick={() => setSelectedEvent(event)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Edit
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No training blocks scheduled yet.</p>
                    )
                    }
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600">
                <div className="text-sm text-gray-400">
                  <span>Training model: </span>
                  <span className="text-white font-medium">{selectedTrainingModel}</span>
                  {localEvents.length > 0 && (
                    <span className="ml-4">
                      Total duration: {localEvents.reduce((total, event) => total + event.resource.weeks, 0)} weeks
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleApplyWithNext('block-sequencing', 'loading-parameters', handleSaveSequence)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  title="Save block sequence and continue to loading parameters"
                >
                  Save Sequence
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <span className="font-bold">Pro Tip:</span> Use the calendar view to visualize your training progression and ensure proper periodization. Each block automatically fills with appropriate load, time, and methods.
                </p>
              </div>
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
              <EventDetailPanel
                selectedEvent={selectedEvent}
                blockTypeConfig={blockTypeConfig}
                updateEventWeeks={updateEventWeeks}
                addDeloadToEvent={addDeloadToEvent}
                handleDeleteEvent={handleDeleteEvent}
                onClose={() => setSelectedEvent(null)}
              />
            )}
          </AccordionItem>
        )}

        {/* Step 4: Loading & Movement Parameters (Per-Block) */}
        {assessmentData && selectedTrainingModel && blockSequence.length > 0 && (
          <AccordionItem
            value="loading-parameters"
            stepNumber="4"
            title="Loading & Movement Parameters"
            instructions="Configure training loads and exercises for each block - defaults based on block type"
            isComplete={Object.keys(blockParameters).length > 0}
          >
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="mb-6">
                <p className="text-gray-300 mb-2">
                  Set parameters for each block in your {selectedTrainingModel.toLowerCase()} training model.
                </p>
                <p className="text-gray-400 text-sm">
                  Each block has default intensity ranges based on its phase. Customize as needed for your specific goals.
                </p>
              </div>

              {/* Active Block Tab Navigation */}
              {blockSequence.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blockSequence.map((block) => {
                      const blockConfig = blockTypeConfig[block.id] || blockTypeConfig.accumulation;
                      const blockParams = blockParameters[block.id] || {};
                      const hasParams = blockParams.oneRM || blockParams.exercises?.length > 0;

                      return (
                        <button
                          key={block.id}
                          onClick={() => setActiveBlockTab(block.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeBlockTab === block.id
                            ? 'bg-blue-600 text-white'
                            : hasParams
                              ? 'bg-green-800 text-green-200 hover:bg-green-700'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          style={{
                            backgroundColor: activeBlockTab === block.id
                              ? undefined
                              : hasParams
                                ? undefined
                                : blockConfig.color + '20',
                            borderColor: blockConfig.color,
                            borderWidth: '1px'
                          }}
                        >
                          {block.name}
                          {hasParams && <span className="ml-2 text-green-400">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Block Parameter Form */}
                  {activeBlockTab && blockSequence.length > 0 && (
                    <div className="border border-gray-600 rounded-lg p-6">
                      {(() => {
                        const activeBlock = blockSequence.find(b => b.id === activeBlockTab);
                        const blockConfig = blockTypeConfig[activeBlockTab] || blockTypeConfig.accumulation;
                        const blockParams = blockParameters[activeBlockTab] || {};
                        const defaults = getPhaseDefaults(activeBlockTab);

                        if (!activeBlock) {
                          return <div className="text-gray-400">Block not found</div>;
                        }

                        return (
                          <div>
                            {/* Block Header */}
                            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: blockConfig.color + '15', borderColor: blockConfig.color, borderWidth: '1px' }}>
                              <h4 className="text-white text-lg font-semibold mb-2">{activeBlock?.name || activeBlockTab}</h4>
                              <p className="text-gray-300 text-sm mb-1">
                                <span className="font-medium">Focus:</span> {defaults.focus}
                              </p>
                              <p className="text-gray-300 text-sm">
                                <span className="font-medium">Default Intensity:</span> {defaults.intensityRange} •
                                <span className="font-medium ml-2">Target RIR:</span> {defaults.targetRIR}
                              </p>
                            </div>

                            {/* Loading Parameters Form */}
                            <div className="mb-6">
                              <h5 className="text-white font-medium mb-4">Loading Parameters</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex flex-col">
                                  <label className="block text-gray-300 text-sm font-medium mb-2">
                                    1RM Weight (lbs)
                                  </label>
                                  <input
                                    type="number"
                                    value={blockParams.oneRM || ''}
                                    onChange={(e) => updateBlockParameter(activeBlockTab, 'oneRM', e.target.value)}
                                    className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="e.g., 225"
                                    min="1"
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Intensity (%1RM)
                                  </label>
                                  <input
                                    type="number"
                                    value={blockParams.intensity || defaults.defaultIntensity}
                                    onChange={(e) => updateBlockParameter(activeBlockTab, 'intensity', parseInt(e.target.value))}
                                    className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                                    min="50"
                                    max="100"
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Target RIR
                                  </label>
                                  <input
                                    type="number"
                                    value={blockParams.targetRIR ?? defaults.targetRIR}
                                    onChange={(e) => updateBlockParameter(activeBlockTab, 'targetRIR', parseInt(e.target.value))}
                                    className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                                    min="0"
                                    max="5"
                                  />
                                </div>
                              </div>

                              <button
                                onClick={() => handleCalculateLoading(activeBlockTab)}
                                disabled={!blockParams.oneRM || blockParams.oneRM <= 0}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                              >
                                Calculate Loading for {activeBlock?.name}
                              </button>

                              {/* Loading Results */}
                              {blockParams.loadingResults && (
                                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                  <h6 className="text-white font-medium mb-3">Loading Recommendations</h6>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="text-center p-2 bg-gray-800 rounded">
                                      <div className="text-gray-400 text-xs mb-1">Working Weight</div>
                                      <div className="text-blue-400 font-bold">{blockParams.loadingResults.loadWeight} lbs</div>
                                    </div>
                                    <div className="text-center p-2 bg-gray-800 rounded">
                                      <div className="text-gray-400 text-xs mb-1">Reps</div>
                                      <div className="text-green-400 font-bold">{blockParams.loadingResults.estimatedReps}</div>
                                    </div>
                                    <div className="text-center p-2 bg-gray-800 rounded">
                                      <div className="text-gray-400 text-xs mb-1">Sets</div>
                                      <div className="text-yellow-400 font-bold">{blockParams.loadingResults.recommendedSets}</div>
                                    </div>
                                    <div className="text-center p-2 bg-gray-800 rounded">
                                      <div className="text-gray-400 text-xs mb-1">Volume</div>
                                      <div className="text-purple-400 font-bold">{blockParams.loadingResults.totalVolume.toLocaleString()}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Movement Parameters Form */}
                            <div>
                              <h5 className="text-white font-medium mb-4">Movement Parameters</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex flex-col">
                                  <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Exercise
                                  </label>
                                  <select
                                    value={blockParams.selectedExercise || ''}
                                    onChange={(e) => updateBlockParameter(activeBlockTab, 'selectedExercise', e.target.value)}
                                    className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                                  >
                                    <option value="">Select exercise...</option>
                                    <option value="Bench Press">Bench Press</option>
                                    <option value="Squat">Squat</option>
                                    <option value="Deadlift">Deadlift</option>
                                    <option value="Overhead Press">Overhead Press</option>
                                    <option value="Incline Press">Incline Press</option>
                                    <option value="Romanian Deadlift">Romanian Deadlift</option>
                                  </select>
                                </div>

                                <div className="flex flex-col">
                                  <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Tempo (e.g., 3010)
                                  </label>
                                  <input
                                    type="text"
                                    value={blockParams.tempo || '3010'}
                                    onChange={(e) => updateBlockParameter(activeBlockTab, 'tempo', e.target.value)}
                                    className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="3010"
                                    maxLength="4"
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Range of Motion
                                  </label>
                                  <select
                                    value={blockParams.rom || 'Full'}
                                    onChange={(e) => updateBlockParameter(activeBlockTab, 'rom', e.target.value)}
                                    className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none"
                                  >
                                    <option value="Full">Full ROM</option>
                                    <option value="Partial">Partial ROM</option>
                                    <option value="1.5x">1.5x ROM</option>
                                    <option value="Lengthened">Lengthened Partial</option>
                                  </select>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddExercise(activeBlockTab)}
                                disabled={!blockParams.selectedExercise || !blockParams.tempo || !blockParams.rom}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                              >
                                Add Exercise to {activeBlock?.name}
                              </button>

                              {/* Exercise List */}
                              {blockParams.exercises && blockParams.exercises.length > 0 && (
                                <div className="mt-4">
                                  <h6 className="text-white font-medium mb-2">Exercises in {activeBlock?.name}</h6>
                                  <div className="space-y-2">
                                    {blockParams.exercises.map((exercise) => (
                                      <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                        <div>
                                          <span className="text-white font-medium">{exercise.name}</span>
                                          <span className="text-gray-400 ml-3">Tempo: {exercise.tempo}</span>
                                          <span className="text-gray-400 ml-3">ROM: {exercise.rom}</span>
                                        </div>
                                        <button
                                          onClick={() => handleRemoveExercise(activeBlockTab, exercise.id)}
                                          className="text-red-400 hover:text-red-300 px-2 py-1 rounded"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </AccordionItem>
        )}

        {/* Step 5: Training Methods */}
        {assessmentData && selectedTrainingModel && (
          <AccordionItem
            value="training-methods"
            stepNumber="5"
            title="Training Methods"
            instructions="Select training methods with SFR ratings"
            isComplete={!!selectedTrainingMethod}
          >
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
                    <span className="text-gray-400 ml-2" title="Training method determines stimulus and fatigue">ℹ️</span>
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
                    <span className="text-gray-400 ml-2" title="Stimulus-to-Fatigue Ratio">ℹ️</span>
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
                  onClick={() => {
                    handleApplyMethod();
                    setTimeout(() => setOpenAccordion('energy-systems'), 500);
                  }}
                  disabled={!selectedTrainingMethod}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
                  title="Apply training method and continue to energy systems"
                >
                  Apply Method
                </button>
              </div>

              {/* Method Description */}
              {selectedTrainingMethod && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h5 className="text-white font-medium mb-2">{selectedTrainingMethod} Method</h5>
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
          </AccordionItem>
        )}

        {/* Step 7: Energy Systems */}
        {assessmentData && selectedTrainingModel && (
          <AccordionItem
            value="energy-systems"
            stepNumber="6"
            title="Energy Systems"
            instructions="Configure energy system development focus"
            isComplete={!!selectedEnergySystem}
          >
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
                    <span className="text-gray-400 ml-2" title="Primary energy pathway focus">ℹ️</span>
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
                  onClick={() => {
                    handleApplyEnergySystem();
                    setTimeout(() => setOpenAccordion('recovery'), 500);
                  }}
                  disabled={!selectedEnergySystem}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
                  title="Apply energy system and continue to recovery parameters"
                >
                  Apply Energy System
                </button>
              </div>

              {/* Energy System Description */}
              {selectedEnergySystem && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h5 className="text-white font-medium mb-2">{selectedEnergySystem} Focus</h5>
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
          </AccordionItem>
        )}

        {/* Step 8: Recovery & Adaptation */}
        {assessmentData && selectedTrainingModel && (
          <AccordionItem
            value="recovery"
            stepNumber="7"
            title="Recovery & Adaptation"
            instructions="Configure deload strategies and recovery protocols"
            isComplete={!!selectedDeloadType}
          >
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
                    <span className="text-gray-400 ml-2" title="How and when to implement recovery periods">ℹ️</span>
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
                  onClick={() => {
                    handleApplyDeload();
                    setTimeout(() => setOpenAccordion('individual'), 500);
                  }}
                  disabled={!selectedDeloadType}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
                  title="Apply deload strategy and continue to individual considerations"
                >
                  Apply Deload
                </button>
              </div>

              {/* Deload Strategy Description */}
              {selectedDeloadType && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h5 className="text-white font-medium mb-2">{selectedDeloadType} Strategy</h5>
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
          </AccordionItem>
        )}

        {/* Step 9: Individual Considerations */}
        {assessmentData && selectedTrainingModel && (
          <AccordionItem
            value="individual"
            stepNumber="8"
            title="Individual Considerations"
            instructions="Personalize based on training age and chronotype"
            isComplete={trainingAge && chronotype}
          >
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
                    <span className="text-gray-400 ml-2" title="Years of consistent resistance training experience">ℹ️</span>
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
                    <span className="text-gray-400 ml-2" title="Your natural circadian rhythm preference">ℹ️</span>
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
                  onClick={() => {
                    handleSaveConsiderations();
                    setTimeout(() => setOpenAccordion('tech'), 500);
                  }}
                  disabled={!trainingAge || !chronotype}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
                  title="Save individual considerations and continue to tech integration"
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
          </AccordionItem>
        )}

        {/* Step 10: Tech Integration */}
        {assessmentData && selectedTrainingModel && (
          <AccordionItem
            value="tech"
            stepNumber="9"
            title="Emerging Trends & Tech"
            instructions="Integrate cutting-edge technology and monitoring"
            isComplete={!!selectedTechIntegration}
          >
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
                    <span className="text-gray-400 ml-2" title="Advanced technology integrations">ℹ️</span>
                  </label>
                  <select
                    value={selectedTechIntegration}
                    onChange={handleTechIntegrationChange}
                    className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-blue-500 focus:outline-none appearance-none">`n                  >`n                    <option value="None">None</option>
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
                  onClick={() => {
                    handleApplyTech();
                    setTimeout(() => setOpenAccordion('preview'), 500);
                  }}
                  disabled={!selectedTechIntegration}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium"
                  title="Apply tech integration and continue to preview"
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
          </AccordionItem>
        )}

        {/* Step 11: Program Preview */}
        {assessmentData && selectedTrainingModel && (
          <AccordionItem
            value="preview"
            stepNumber="10"
            title="Program Preview"
            instructions="Generate and review your complete program structure"
            isComplete={!!generatedProgram}
          >
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
                    onClick={() => {
                      handleGeneratePreview();
                      setTimeout(() => setOpenAccordion('generate'), 800);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                    title="Generate program preview and continue to final generation"
                  >
                    Generate Preview
                  </button>
                </div>
              ) : generatedProgram && (
                <div className="space-y-6">
                  {/* Program Overview */}
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h5 className="text-xl font-semibold text-white mb-3">Program Overview</h5>
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

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-600">
                    <button
                      onClick={handleSaveProgram}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex-1"
                      title="Save this program to your library"
                    >
                      💾 Save Program
                    </button>
                    <button
                      onClick={handleExportProgram}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex-1"
                      title="Export program as JSON file"
                    >
                      📤 Export JSON
                    </button>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                      title="Regenerate program with current settings"
                    >
                      🔄 Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </AccordionItem>
        )}

        {/* Step 12: Generate Full Program */}
        {assessmentData && selectedTrainingModel && (
          <AccordionItem
            value="generate"
            stepNumber="11"
            title="Generate Full Program"
            instructions="Create your complete training program with all configurations"
            isComplete={false}
          >
            <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700 text-center">
              <div className="mb-4">
                <h5 className="text-lg md:text-xl font-semibold text-white mb-2">Ready to Generate?</h5>
                <p className="text-gray-300 text-sm">
                  All parameters configured. Generate your complete macrocycle program with all specified settings.
                </p>
              </div>

              <button
                onClick={handleGenerateFullProgram}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Generate your complete program and proceed to builder"
              >
                🚀 Generate Full Program
              </button>

              <p className="text-gray-400 text-xs mt-3">
                This will compile all your selections into a comprehensive training program
              </p>
            </div>
          </AccordionItem>
        )}

        {/* Planning Level Selection */}
        <div className="mt-8 pt-8 border-t border-gray-600">
          <h3 className="text-2xl font-semibold text-white mb-6">Choose Your Planning Level</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'macro',
                title: 'MACROCYCLE',
                subtitle: '3-12 months',
                description: 'Long-term periodization with RP + NEW Timeline View! 📅✨',
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
                className={`bg-gray-800 rounded-lg p-6 border-2 cursor-pointer transition-all hover:border-gray-500`}
              >
                <div className="text-3xl mb-3">{level.icon}</div>
                <h4 className="text-lg font-bold text-white mb-1">{level.title}</h4>
                <p className="text-red-400 text-sm mb-2">{level.subtitle}</p>
                <p className="text-gray-300 text-sm mb-4">{level.description}</p>
                <div className="space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      level.handler();
                    }}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    title={`Start new ${level.title.toLowerCase()}`}
                  >
                    START NEW
                  </button>
                </div>
              </div>
            ))}
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

        {/* Unified Flow Indicator */}
        {selectedLevel && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-center">
              <span className="text-blue-400">🎯</span>
              <span className="text-blue-300 font-medium">
                Unified Program Builder - {selectedLevel.toUpperCase()} Mode
              </span>
              <span className="text-blue-400">✨</span>
            </div>
            <p className="text-blue-200 text-sm text-center mt-1">
              All builders have been merged into this unified experience
            </p>
          </div>
        )}

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
            setSelectedLevel={setSelectedLevel}
            error={error}
            setError={handleSetError}
            isLoading={isLoading}
            saveProgram={saveProgram}
            setActiveTab={handleSetActiveTab}
            onStartMacrocycle={handleStartMacrocycle}
            onStartMesocycle={handleStartMesocycle}
            onStartMicrocycle={handleStartMicrocycle}
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
