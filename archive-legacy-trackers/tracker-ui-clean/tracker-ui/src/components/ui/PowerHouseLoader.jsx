import React from 'react';

const PowerHouseLoader = ({ message = 'Loading PowerHouse Tracker...' }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* PowerHouse Logo Animation */}
        <div className="relative mb-8">
          <div className="text-6xl font-bold">
            <span className="text-red-500 animate-pulse">Power</span>
            <span className="text-white ml-2">House</span>
          </div>
          <div className="text-xl text-gray-400 mt-2">Tracker</div>
        </div>
        
        {/* Loading Spinner */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-red-400 rounded-full animate-ping"></div>
          </div>
        </div>
        
        {/* Loading Message */}
        <p className="text-gray-400 text-lg">{message}</p>
        
        {/* Progress Bar */}
        <div className="w-64 bg-gray-700 rounded-full h-2 mt-4 mx-auto">
          <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PowerHouseLoader;
