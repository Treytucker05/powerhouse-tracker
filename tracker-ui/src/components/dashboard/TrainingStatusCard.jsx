import React from 'react';

const TrainingStatusCard = () => {
  return (
    <div className="bg-gray-900 border border-red-600 rounded-lg p-6 text-center">
      <h2 className="text-xl font-bold text-white mb-4">Current Training Status</h2>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <div className="text-3xl font-bold text-red-600">1</div>
          <div className="text-gray-400 text-sm">WEEK</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-red-600">4</div>
          <div className="text-gray-400 text-sm">MESO LENGTH</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-red-600">1</div>
          <div className="text-gray-400 text-sm">BLOCK</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-red-600">3</div>
          <div className="text-gray-400 text-sm">TARGET RIR</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xl font-bold text-yellow-500">Accumulation</div>
          <div className="text-gray-400 text-sm">PHASE</div>
        </div>
        <div>
          <div className="text-xl font-bold text-red-600">2600%</div>
          <div className="text-gray-400 text-sm">SYSTEM FATIGUE</div>
        </div>
      </div>
      <div className="mt-4 bg-red-600 text-white py-2 px-4 rounded font-bold">
        Deload strongly recommended!
      </div>
    </div>
  );
};

export default TrainingStatusCard;
