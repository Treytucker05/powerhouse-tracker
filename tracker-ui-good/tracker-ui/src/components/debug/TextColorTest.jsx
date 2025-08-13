import React from 'react';

/**
 * TextColorTest - Component to test and debug text color issues
 * Use this component to identify where blue text or other color issues appear
 */
const TextColorTest = ({ showDebug = false }) => {
    if (!showDebug) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg border border-gray-600 text-xs z-50">
            <h4 className="text-white font-bold mb-2">Text Color Debug</h4>
            <div className="space-y-1">
                <div className="text-white">✓ Default text (should be white)</div>
                <div className="text-gray-300">✓ Gray text (should be light gray)</div>
                <div className="text-red-400">✓ Red text (should be red)</div>
                <div className="text-green-400">✓ Green text (should be green)</div>
                <div className="text-blue-500">⚠ Blue text (should be white if overridden)</div>
                <div className="text-indigo-600">⚠ Indigo text (should be white if overridden)</div>

                {/* Form elements test */}
                <input
                    type="text"
                    placeholder="Input test"
                    className="w-full p-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                />
                <select className="w-full p-1 text-xs bg-gray-700 border border-gray-600 rounded text-white">
                    <option>Select test</option>
                </select>

                {/* Radio button test */}
                <label className="flex items-center space-x-2 text-white">
                    <input type="radio" name="test" className="accent-red-600" />
                    <span>Radio test</span>
                </label>
            </div>
        </div>
    );
};

export default TextColorTest;
