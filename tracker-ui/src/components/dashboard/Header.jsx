import React from 'react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-black to-gray-900 border-b-4 border-red-600 shadow-2xl">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black mb-2">
              <span className="text-red-600">POWERHOUSE</span>
              <span className="text-white">ATX</span>
            </h1>
            <p className="text-gray-300 text-lg font-semibold">Evidence-Based Muscle Building</p>
          </div>
          <div className="text-right">
            <div className="text-white text-xl font-bold mb-2">
              WORKOUT CALCULATOR
            </div>
            <div className="text-gray-400 text-sm">
              Advanced Training Analytics
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
