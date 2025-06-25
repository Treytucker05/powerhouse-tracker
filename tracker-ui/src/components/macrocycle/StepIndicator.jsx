import React from 'react';

export default function StepIndicator({ step, total }) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {Array.from({ length: total }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === step;
        const isComplete = stepNumber < step;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                isComplete
                  ? 'bg-green-500 text-white'
                  : isActive
                  ? 'bg-blue-500 text-white ring-4 ring-blue-500/30'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {isComplete ? '✓' : stepNumber}
            </div>
            {stepNumber < total && (
              <div
                className={`w-12 h-0.5 mx-2 transition-all duration-200 ${
                  isComplete ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
