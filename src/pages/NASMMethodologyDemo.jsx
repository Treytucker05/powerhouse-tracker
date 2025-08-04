import React from 'react';
import NASMMethodologyEntry from './components/methodology/nasm';

// Demo component showing how to use the NASM methodology-first workflow
const NASMMethodologyDemo = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        POWERHOUSE TRACKER: NASM Methodology-First Workflow
                    </h1>
                    <p className="text-gray-300">
                        Complete NASM OPT Model implementation running parallel to existing system
                    </p>
                </div>
            </div>

            {/* NASM Workflow */}
            <NASMMethodologyEntry />

            {/* Footer */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
                <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
                    Phase 1 Implementation: NASM Methodology-First Workflow (Parallel to existing system)
                </div>
            </div>
        </div>
    );
};

export default NASMMethodologyDemo;
