import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
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
  const inputSelectClassName = "w-full bg-white border border-gray-600 text-black px-4 py-3 rounded-lg focus:border-red-500 focus:outline-none appearance-none";

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
  saveProgram, setActiveTab, handleSetProgramData
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setActiveTab('overview')}
          className="text-gray-400 hover:text-white"
        >
          ← Back to Overview
        </button>
        <h2 className="text-2xl font-semibold text-white">Program Builder</h2>
      </div>

      <ProgramForm
        programData={programData}
        setProgramData={setProgramData}
        selectedLevel={selectedLevel}
        error={error}
        setError={setError}
        isLoading={isLoading}
        saveProgram={saveProgram}
        setActiveTab={setActiveTab}
      />
    </div>
  );
});

ProgramBuilder.displayName = 'ProgramBuilder';

const Program = memo(() => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [recentPrograms, setRecentPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [error, setError] = useState(null);
  const [programData, setProgramData] = useState({
    name: '',
    goal: 'hypertrophy',
    duration: 12,
    trainingDays: 4,
    selectedTemplate: null
  });

  // Stable functions to prevent re-renders
  const handleSetProgramData = useCallback((newData) => {
    setProgramData(prev => ({ ...prev, ...newData }));
  }, []); // Remove programData from dependencies!

  const handleSetError = useCallback((error) => {
    setError(error);
  }, []);

  const handleSetActiveTab = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

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

  const ProgramOverview = () => (
    <div className="space-y-8">
      {/* Planning Level Selection */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Choose Your Planning Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'macro',
              title: 'MACROCYCLE',
              subtitle: '3-12 months',
              description: 'Long-term periodization',
              icon: '📅',
              route: '/macrocycle'
            },
            {
              id: 'meso',
              title: 'MESOCYCLE',
              subtitle: '4-6 weeks',
              description: 'Training blocks',
              icon: '📊',
              route: '/mesocycle'
            },
            {
              id: 'micro',
              title: 'MICROCYCLE',
              subtitle: '1 week',
              description: 'Daily workouts',
              icon: '📋',
              route: '/microcycle'
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
                    setActiveTab('builder');
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
                <div className="text-gray-400 text-sm">MEV</div>
                <div className="text-green-400 text-xl font-bold">{landmarks.mev}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">MRV</div>
                <div className="text-red-400 text-xl font-bold">{landmarks.mrv}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">Week {weeks}</div>
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
                  <span className="text-red-400 capitalize">{block.focus}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setProgramData({
                  ...programData,
                  selectedTemplate: key,
                  duration: template.duration_weeks
                });
                setActiveTab('builder');
              }}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Program Design</h1>
          <p className="text-gray-400">Build evidence-based training programs using Renaissance Periodization methodology</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '🏠' },
            { id: 'builder', label: 'Builder', icon: '🔧' },
            { id: 'calculator', label: 'Calculator', icon: '🧮' },
            { id: 'exercises', label: 'Exercises', icon: '💪' },
            { id: 'templates', label: 'Templates', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors text-black ${activeTab === tab.id
                  ? 'bg-red-600'
                  : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
          <ProgramOverview />
        </div>
        <div className={activeTab === 'builder' ? 'block' : 'hidden'}>
          <ProgramBuilder
            programData={programData}
            setProgramData={setProgramData}
            selectedLevel={selectedLevel}
            error={error}
            setError={handleSetError}
            isLoading={isLoading}
            saveProgram={saveProgram}
            setActiveTab={handleSetActiveTab}
            handleSetProgramData={handleSetProgramData}
          />
        </div>
        <div className={activeTab === 'calculator' ? 'block' : 'hidden'}>
          <VolumeCalculator />
        </div>
        <div className={activeTab === 'exercises' ? 'block' : 'hidden'}>
          <ExerciseDatabase />
        </div>
        <div className={activeTab === 'templates' ? 'block' : 'hidden'}>
          <Templates />
        </div>
      </div>
    </div>
  );
});

export default Program;