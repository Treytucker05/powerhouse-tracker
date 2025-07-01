import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  MACROCYCLE_TEMPLATES, 
  PHASE_TYPES, 
  BASE_VOLUME_LANDMARKS, 
  RIR_SCHEMES 
} from '../constants/rpConstants';
const Macrocycle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [programData, setProgramData] = useState(null);
  const [macrocycleData, setMacrocycleData] = useState({
    name: '',
    totalWeeks: 12,
    primaryGoal: 'hypertrophy',
    blocks: [],
    selectedTemplate: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Load program data from state or database
  useEffect(() => {
    const loadProgramData = async () => {
      const programId = location.state?.programId;
      if (programId) {
        try {
          const { data, error } = await supabase
            .from('programs')
            .select('*')
            .eq('id', programId)
            .single();
          
          if (error) throw error;
          setProgramData(data);
          setMacrocycleData(prev => ({
            ...prev,
            totalWeeks: data.duration_weeks,
            primaryGoal: data.goal_type,
            name: `${data.name} - Macrocycle`
          }));
        } catch (error) {
          console.error('Error loading program:', error);
        }
      }
    };

    loadProgramData();
  }, [location.state]);

  // Apply template
  const applyTemplate = (templateKey) => {
    const template = MACROCYCLE_TEMPLATES[templateKey];
    setMacrocycleData(prev => ({
      ...prev,
      selectedTemplate: templateKey,
      totalWeeks: template.duration,
      primaryGoal: template.goal,
      blocks: template.blocks.map((block, index) => ({
        ...block,
        id: index + 1,
        startWeek: template.blocks.slice(0, index).reduce((sum, b) => sum + b.weeks, 1)
      }))
    }));
  };

  // Add custom block
  const addBlock = () => {
    const lastBlock = macrocycleData.blocks[macrocycleData.blocks.length - 1];
    const startWeek = lastBlock ? lastBlock.startWeek + lastBlock.weeks : 1;
    
    setMacrocycleData(prev => ({
      ...prev,
      blocks: [...prev.blocks, {
        id: prev.blocks.length + 1,
        type: 'accumulation',
        weeks: 4,
        name: `Block ${prev.blocks.length + 1}`,
        startWeek
      }]
    }));
  };

  // Update block
  const updateBlock = (blockId, updates) => {
    setMacrocycleData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      )
    }));
  };

  // Remove block
  const removeBlock = (blockId) => {
    setMacrocycleData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
  };

  // Calculate total weeks
  const totalWeeks = macrocycleData.blocks.reduce((sum, block) => sum + block.weeks, 0);

  // Save macrocycle and continue
  const saveMacrocycle = async () => {
    if (!programData) return;
    
    setIsLoading(true);
    try {
      // Save each block to program_blocks table
      const blocksToSave = macrocycleData.blocks.map((block, index) => ({
        program_id: programData.id,
        block_number: index + 1,
        name: block.name,
        block_type: block.type,
        duration_weeks: block.weeks,
        focus: PHASE_TYPES[block.type].focus
      }));

      const { error } = await supabase
        .from('program_blocks')
        .insert(blocksToSave);

      if (error) throw error;

      // Navigate to mesocycle design
      navigate('/mesocycle', { 
        state: { 
          programId: programData.id,
          macrocycleBlocks: macrocycleData.blocks
        } 
      });
    } catch (error) {
      console.error('Error saving macrocycle:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/program')}
              className="text-gray-400 hover:text-white"
            >
              ← Back to Program Design
            </button>
            <h1 className="text-4xl font-bold text-white">Macrocycle Design</h1>
          </div>
          {programData && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-2">{programData.name}</h2>
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <span>Goal: <span className="text-red-400 capitalize">{programData.goal_type}</span></span>
                <span>Duration: <span className="text-red-400">{programData.duration_weeks} weeks</span></span>
                <span>Training Days: <span className="text-red-400">{programData.training_days_per_week}/week</span></span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {[
              { step: 1, name: 'Template Selection', current: activeStep === 1 },
              { step: 2, name: 'Phase Planning', current: activeStep === 2 },
              { step: 3, name: 'Review & Save', current: activeStep === 3 }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${item.current ? 'bg-red-600 text-white' : 
                    activeStep > item.step ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                  {activeStep > item.step ? '✓' : item.step}
                </div>
                <span className={`ml-2 text-sm ${item.current ? 'text-white' : 'text-gray-400'}`}>
                  {item.name}
                </span>
                {item.step < 3 && <div className="w-8 h-px bg-gray-600 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Template Selection */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Choose a Macrocycle Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(MACROCYCLE_TEMPLATES).map(([key, template]) => (
                  <div
                    key={key}
                    className={`border rounded-lg p-6 cursor-pointer transition-all
                      ${macrocycleData.selectedTemplate === key 
                        ? 'border-red-500 bg-gray-700' 
                        : 'border-gray-600 hover:border-gray-500'}`}
                    onClick={() => applyTemplate(key)}
                  >
                    <h4 className="text-lg font-semibold text-white mb-2">{template.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">{template.duration} weeks • {template.goal}</p>
                    <div className="space-y-2">
                      {template.blocks.map((block, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-gray-300">{block.name}</span>
                          <span className={`px-2 py-1 rounded ${PHASE_TYPES[block.type].color} text-white`}>
                            {block.weeks}w
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex items-center space-x-4">
                <button
                  onClick={() => setActiveStep(2)}
                  disabled={!macrocycleData.selectedTemplate}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue with Template
                </button>
                <button
                  onClick={() => {
                    setMacrocycleData(prev => ({ ...prev, selectedTemplate: 'custom' }));
                    setActiveStep(2);
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                >
                  Create Custom
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Phase Planning */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Phase Planning</h3>
                <div className="text-sm text-gray-300">
                  Total: <span className="text-red-400 font-bold">{totalWeeks}</span> weeks
                </div>
              </div>

              {/* Blocks List */}
              <div className="space-y-4 mb-6">
                {macrocycleData.blocks.map((block, index) => (
                  <div key={block.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Block Name</label>
                        <input
                          type="text"
                          value={block.name}
                          onChange={(e) => updateBlock(block.id, { name: e.target.value })}
                          className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Phase Type</label>
                        <select
                          value={block.type}
                          onChange={(e) => updateBlock(block.id, { type: e.target.value })}
                          className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded text-sm"
                        >
                          {Object.entries(PHASE_TYPES).map(([key, phase]) => (
                            <option key={key} value={key}>{phase.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Duration (weeks)</label>
                        <input
                          type="number"
                          value={block.weeks}
                          onChange={(e) => updateBlock(block.id, { weeks: parseInt(e.target.value) || 1 })}
                          className="w-full bg-gray-600 border border-gray-500 text-white px-3 py-2 rounded text-sm"
                          min="1"
                          max="12"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded text-xs text-white ${PHASE_TYPES[block.type].color}`}>
                          Weeks {block.startWeek}-{block.startWeek + block.weeks - 1}
                        </div>
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-400">
                      {PHASE_TYPES[block.type].description}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={addBlock}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  + Add Block
                </button>
                <button
                  onClick={() => setActiveStep(1)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  disabled={macrocycleData.blocks.length === 0}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Review Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Save */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Macrocycle Summary</h3>
              
              {/* Timeline Visualization */}
              <div className="mb-6">
                <div className="flex items-center space-x-1 mb-2">
                  {macrocycleData.blocks.map((block) => (
                    <div
                      key={block.id}
                      className={`${PHASE_TYPES[block.type].color} text-white text-xs px-2 py-1 rounded flex-grow text-center`}
                      style={{ minWidth: `${(block.weeks / totalWeeks) * 100}%` }}
                    >
                      {block.name} ({block.weeks}w)
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 text-center">
                  Total Duration: {totalWeeks} weeks
                </div>
              </div>

              {/* Block Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {macrocycleData.blocks.map((block) => (
                  <div key={block.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{block.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs text-white ${PHASE_TYPES[block.type].color}`}>
                        {PHASE_TYPES[block.type].name}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{PHASE_TYPES[block.type].description}</p>
                    <p className="text-gray-300 text-xs">
                      Weeks {block.startWeek}-{block.startWeek + block.weeks - 1} • 
                      Focus: {PHASE_TYPES[block.type].focus}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveStep(2)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                >
                  Back to Edit
                </button>
                <button
                  onClick={saveMacrocycle}
                  disabled={isLoading || macrocycleData.blocks.length === 0}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save & Continue to Mesocycles'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Macrocycle;
