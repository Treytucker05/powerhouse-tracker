import { useState } from 'react';
import { useTrainingState } from '../../context/trainingStateContext';

export default function MesocycleBuilder() {
  const { state, setupMesocycle } = useTrainingState();
  const [mesocycleConfig, setMesocycleConfig] = useState({
    weeks: 4,
    focus: 'volume',
    phase: 'accumulation',
    ...state.currentMesocycle
  });

  const handleConfigChange = (field, value) => {
    setMesocycleConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveMesocycle = () => {
    setupMesocycle(mesocycleConfig);
  };

  const focusOptions = [
    { value: 'volume', label: 'Volume Focus', desc: 'Emphasize set count and time under tension' },
    { value: 'intensity', label: 'Intensity Focus', desc: 'Emphasize load progression and strength' },
    { value: 'metabolite', label: 'Metabolite Focus', desc: 'Emphasize pump and metabolic stress' }
  ];

  const phaseOptions = [
    { value: 'accumulation', label: 'Accumulation', desc: 'Build work capacity and volume tolerance' },
    { value: 'intensification', label: 'Intensification', desc: 'Peak strength and neural adaptations' },
    { value: 'realization', label: 'Realization', desc: 'Test and demonstrate gains' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mesocycle Planning
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Block {state.currentMesocycle?.block || 1}
        </span>
      </div>

      {/* Current Mesocycle Overview */}
      {state.currentMesocycle?.weeks && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Current Block: {state.currentMesocycle.weeks} weeks • {state.currentMesocycle.focus} focus
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            Phase: {state.currentMesocycle.phase} • Week {state.currentMesocycle.currentWeek || 1} of {state.currentMesocycle.weeks}
          </div>
        </div>
      )}

      {/* Configuration */}
      <div className="space-y-4">
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Block Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map(weeks => (
              <button
                key={weeks}
                onClick={() => handleConfigChange('weeks', weeks)}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  mesocycleConfig.weeks === weeks
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {weeks} weeks
              </button>
            ))}
          </div>
        </div>

        {/* Focus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Training Focus
          </label>
          <div className="space-y-2">
            {focusOptions.map(option => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="focus"
                  value={option.value}
                  checked={mesocycleConfig.focus === option.value}
                  onChange={(e) => handleConfigChange('focus', e.target.value)}
                  className="mt-1 text-red-600"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {option.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Phase */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Training Phase
          </label>
          <div className="space-y-2">
            {phaseOptions.map(option => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="phase"
                  value={option.value}
                  checked={mesocycleConfig.phase === option.value}
                  onChange={(e) => handleConfigChange('phase', e.target.value)}
                  className="mt-1 text-red-600"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {option.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveMesocycle}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Start New Mesocycle
        </button>
      </div>
    </div>
  );
}
