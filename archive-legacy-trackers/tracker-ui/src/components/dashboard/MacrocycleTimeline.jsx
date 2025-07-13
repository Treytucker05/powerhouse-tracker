import { useState } from 'react';

export default function MacrocycleTimeline() {
  const [selectedBlock, setSelectedBlock] = useState(null);
  
  const macrocycleBlocks = [
    { id: 1, name: 'Base Building', phase: 'accumulation', weeks: 4, status: 'completed', focus: 'volume' },
    { id: 2, name: 'Strength Development', phase: 'accumulation', weeks: 4, status: 'completed', focus: 'intensity' },
    { id: 3, name: 'Power Phase', phase: 'intensification', weeks: 3, status: 'current', focus: 'power' },
    { id: 4, name: 'Peak Preparation', phase: 'intensification', weeks: 2, status: 'planned', focus: 'peak' },
    { id: 5, name: 'Competition/Test', phase: 'realization', weeks: 1, status: 'planned', focus: 'performance' },
    { id: 6, name: 'Active Recovery', phase: 'transition', weeks: 2, status: 'planned', focus: 'recovery' }
  ];

  const phaseColors = {
    accumulation: 'bg-blue-500',
    intensification: 'bg-orange-500',
    realization: 'bg-green-500',
    transition: 'bg-gray-500'
  };

  const statusColors = {
    completed: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    current: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    planned: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
  };

  const getTotalWeeks = () => {
    return macrocycleBlocks.reduce((total, block) => total + block.weeks, 0);
  };

  const getWeekPosition = (blockIndex) => {
    const weeksBeforeBlock = macrocycleBlocks
      .slice(0, blockIndex)
      .reduce((total, block) => total + block.weeks, 0);
    return weeksBeforeBlock;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Annual Training Timeline
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {getTotalWeeks()} weeks total
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="mb-8">
        <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          {/* Week markers */}
          <div className="absolute top-2 left-4 right-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            {Array.from({ length: Math.ceil(getTotalWeeks() / 4) + 1 }, (_, i) => (
              <span key={i}>Week {i * 4}</span>
            ))}
          </div>
          
          {/* Timeline blocks */}
          <div className="mt-6 relative h-16">
            {macrocycleBlocks.map((block, index) => {
              const startPosition = (getWeekPosition(index) / getTotalWeeks()) * 100;
              const width = (block.weeks / getTotalWeeks()) * 100;
              
              return (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                  className={`
                    absolute h-12 rounded cursor-pointer transition-all duration-200
                    ${phaseColors[block.phase]} ${selectedBlock === block.id ? 'shadow-lg scale-105' : 'hover:shadow-md'}
                    flex items-center justify-center text-white text-xs font-medium
                  `}
                  style={{
                    left: `${startPosition}%`,
                    width: `${width}%`,
                    top: '0px'
                  }}
                >
                  <span className="truncate px-2">{block.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Block Details */}
      <div className="grid gap-4">
        {macrocycleBlocks.map(block => (
          <div
            key={block.id}
            className={`
              p-4 rounded-lg border-2 transition-all cursor-pointer
              ${statusColors[block.status]}
              ${selectedBlock === block.id ? 'shadow-lg' : 'hover:shadow-md'}
            `}
            onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${phaseColors[block.phase]}`}></div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {block.name}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {block.weeks} weeks • {block.phase} phase • {block.focus} focus
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${block.status === 'completed' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
                  ${block.status === 'current' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}
                  ${block.status === 'planned' && 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}
                `}>
                  {block.status}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedBlock === block.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Training Focus:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {block.focus.charAt(0).toUpperCase() + block.focus.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Phase:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {block.phase.charAt(0).toUpperCase() + block.phase.slice(1)}
                    </span>
                  </div>
                </div>
                
                {block.status === 'current' && (
                  <div className="mt-3 flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors">
                      Modify Block
                    </button>
                  </div>
                )}
                
                {block.status === 'planned' && (
                  <div className="mt-3 flex space-x-2">
                    <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors">
                      Configure
                    </button>
                    <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors">
                      Adjust Timing
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Macrocycle Progress
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300">Completed:</span>
            <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
              {macrocycleBlocks.filter(b => b.status === 'completed').length} blocks
            </span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Current:</span>
            <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
              {macrocycleBlocks.find(b => b.status === 'current')?.name || 'None'}
            </span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Remaining:</span>
            <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
              {macrocycleBlocks.filter(b => b.status === 'planned').length} blocks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
