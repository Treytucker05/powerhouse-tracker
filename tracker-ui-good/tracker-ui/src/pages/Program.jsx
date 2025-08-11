import React, { useState } from 'react';
import BuilderCTA from '../components/program/BuilderCTA.jsx';
import MethodologySelection from '../components/program/tabs/MethodologySelection';
import FiveThreeOneWorkflow from '../components/program/FiveThreeOneWorkflow';
import StreamlinedProgram from './StreamlinedProgram';

/**
 * Program.jsx - Updated to include 5/3/1 Training System
 * 
 * FEATURES:
 * - Methodology Selection (5/3/1, NASM, RP, Custom)
 * - Complete 5/3/1 Implementation
 * - Fallback to existing StreamlinedProgram for other methodologies
 */

const Program = () => {
  const [selectedMethodology, setSelectedMethodology] = useState(null);

  const handleMethodologySelect = (methodology) => {
    console.log('Selected methodology:', methodology);
    console.log('Methodology ID:', methodology?.id);
    setSelectedMethodology(methodology);
  };

  // Debug logging
  console.log('Current selectedMethodology:', selectedMethodology);
  console.log('Should show 5/3/1 workflow?', selectedMethodology?.id === 'fivethreeone');

  // If 5/3/1 is selected, show the 5/3/1 workflow
  if (selectedMethodology?.id === 'fivethreeone') {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              💪 5/3/1 Training System
            </h1>
            <p className="text-gray-300">
              Jim Wendler's proven strength training methodology
            </p>
            <button
              onClick={() => setSelectedMethodology(null)}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300 underline"
            >
              ← Back to Methodology Selection
            </button>
          </div>

          <FiveThreeOneWorkflow />
        </div>
      </div>
    );
  }

  // If other methodology is selected, use existing system
  if (selectedMethodology && selectedMethodology.id !== 'fivethreeone') {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {selectedMethodology.icon} {selectedMethodology.name}
            </h1>
            <p className="text-gray-300 mb-4">
              {selectedMethodology.description}
            </p>
            <button
              onClick={() => setSelectedMethodology(null)}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              ← Back to Methodology Selection
            </button>
          </div>

          <StreamlinedProgram />
        </div>
      </div>
    );
  }

  // Show methodology selection by default
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <BuilderCTA />
        <MethodologySelection
          onMethodologySelect={handleMethodologySelect}
          selectedMethodology={selectedMethodology}
        />
      </div>
    </div>
  );
};

export default Program;
