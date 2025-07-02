import React from 'react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-black to-gray-900 border-b-4 border-red-600 shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black">
            <span className="text-red-600">POWERHOUSE</span>
            <span className="text-white">ATX</span>
          </h1>
          <div className="text-white text-sm">
            WORKOUT CALCULATOR
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-1">Evidence-Based Muscle Building</p>
      </div>
    </header>
  );
}
