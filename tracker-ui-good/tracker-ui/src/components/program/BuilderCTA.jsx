// src/components/program/BuilderCTA.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function BuilderCTA() {
    return (
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="text-white font-semibold">New 5/3/1 Program Builder</div>
                    <div className="text-gray-400 text-sm">Seven-step flow with templates first, then schedule, loading and assistance.</div>
                </div>
                <Link
                    // Corrected path: previous /program/builder/531 was not a defined route and fell back to dashboard
                    to="/builder/531/v2"
                    className="px-4 py-2 rounded border border-red-500 hover:bg-red-600/10"
                >
                    Open Builder
                </Link>
            </div>
        </div>
    );
}
