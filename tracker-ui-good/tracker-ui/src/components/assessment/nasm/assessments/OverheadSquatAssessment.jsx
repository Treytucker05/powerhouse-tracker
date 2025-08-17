import React from 'react';
import { Eye, AlertCircle, CheckSquare } from 'lucide-react';

const OverheadSquatAssessment = ({ data, onDataChange }) => {
    // NASM Overhead Squat Protocol from Chapter 6 (Pages 139-142)
    // 1. Feet shoulder-width, straight, shoes off
    // 2. Arms overhead, elbows locked  
    // 3. Squat to chair height; 5 reps from front & side view

    const handleCompensationChange = (view, section, field, value) => {
        const newData = {
            ...data,
            overheadSquat: {
                ...data.overheadSquat,
                [view]: {
                    ...data.overheadSquat[view],
                    [section]: {
                        ...data.overheadSquat[view][section],
                        [field]: value
                    }
                }
            }
        };
        onDataChange(newData);
    };

    const handleNotesChange = (view, section, notes) => {
        handleCompensationChange(view, section, 'notes', notes);
    };

    return (
        <div className="space-y-6">
            {/* NASM Protocol Instructions */}
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-blue-300">NASM Overhead Squat Assessment Protocol</h4>
                </div>
                <div className="text-sm text-blue-200 space-y-2">
                    <p><strong>Purpose:</strong> Evaluate dynamic flexibility, core strength, balance, and neuromuscular control</p>
                    <p><strong>Position:</strong> Feet shoulder-width apart, toes straight ahead, shoes off to observe foot-ankle complex</p>
                    <p><strong>Arms:</strong> Overhead, elbows fully extended, upper arms bisect the torso</p>
                    <p><strong>Movement:</strong> Squat to roughly chair seat height and return - 5 repetitions total</p>
                    <p><strong>Observation:</strong> Watch from both anterior (front) and lateral (side) views</p>
                    <p><strong>Reference:</strong> NASM-CPT 7th Edition, Chapter 6, pp. 139-142</p>
                </div>
            </div>

            {/* Front View Assessment */}
            <div className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-5 w-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-white">Anterior (Front) View Assessment</h4>
                </div>
                <p className="text-sm text-gray-400 mb-4">Watch feet, ankles, knees - knees should track over 2nd/3rd toe</p>

                {/* Feet Checkpoint */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">Feet Assessment</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={data.overheadSquat?.frontView?.feet?.feetTurnOut || false}
                                onChange={(e) => handleCompensationChange('frontView', 'feet', 'feetTurnOut', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Feet Flatten/Turn Out</span>
                                <p className="text-gray-400 text-sm">Feet flatten or turn outward during squat movement (NASM Figure 6.30-6.31)</p>
                            </div>
                        </label>
                        <textarea
                            value={data.overheadSquat?.frontView?.feet?.notes || ''}
                            onChange={(e) => handleNotesChange('frontView', 'feet', e.target.value)}
                            placeholder="Additional observations about foot position..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>

                {/* Knees Checkpoint */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">Knee Assessment</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={data.overheadSquat?.frontView?.knees?.kneesMoveinward || false}
                                onChange={(e) => handleCompensationChange('frontView', 'knees', 'kneesMoveinward', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Knees Move Inward</span>
                                <p className="text-gray-400 text-sm">Knees adduct and internally rotate during squat (NASM Figure 6.32)</p>
                            </div>
                        </label>
                        <textarea
                            value={data.overheadSquat?.frontView?.knees?.notes || ''}
                            onChange={(e) => handleNotesChange('frontView', 'knees', e.target.value)}
                            placeholder="Additional observations about knee alignment..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Side View Assessment */}
            <div className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-5 w-5 text-orange-400" />
                    <h4 className="text-lg font-semibold text-white">Lateral (Side) View Assessment</h4>
                </div>
                <p className="text-sm text-gray-400 mb-4">Watch LPHC, shoulder, cervical complexes - tibia angle ≈ torso angle; arms stay aligned with torso</p>

                {/* LPHC (Lumbo-Pelvic-Hip Complex) */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">LPHC (Lumbo-Pelvic-Hip Complex)</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={data.overheadSquat?.sideView?.lphc?.excessiveForwardLean || false}
                                onChange={(e) => handleCompensationChange('sideView', 'lphc', 'excessiveForwardLean', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Excessive Forward Lean</span>
                                <p className="text-gray-400 text-sm">Torso leans excessively forward during squat</p>
                            </div>
                        </label>

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={data.overheadSquat?.sideView?.lphc?.lowBackArches || false}
                                onChange={(e) => handleCompensationChange('sideView', 'lphc', 'lowBackArches', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Low Back Arches</span>
                                <p className="text-gray-400 text-sm">Excessive lumbar extension during squat (NASM Figure 6.33)</p>
                            </div>
                        </label>

                        <textarea
                            value={data.overheadSquat?.sideView?.lphc?.notes || ''}
                            onChange={(e) => handleNotesChange('sideView', 'lphc', e.target.value)}
                            placeholder="Additional observations about LPHC position..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>

                {/* Upper Body Assessment */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">Upper Body Assessment</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={data.overheadSquat?.sideView?.upperBody?.armsFallForward || false}
                                onChange={(e) => handleCompensationChange('sideView', 'upperBody', 'armsFallForward', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Arms Fall Forward</span>
                                <p className="text-gray-400 text-sm">Arms drop forward from overhead position during squat</p>
                            </div>
                        </label>
                        <textarea
                            value={data.overheadSquat?.sideView?.upperBody?.notes || ''}
                            onChange={(e) => handleNotesChange('sideView', 'upperBody', e.target.value)}
                            placeholder="Additional observations about upper body position..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Assessment Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h5 className="text-md font-semibold text-white mb-3">Assessment Summary</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-300">Front View Compensations:</span>
                        <span className="ml-2 text-white font-medium">
                            {(data.overheadSquat?.frontView?.feet?.feetTurnOut ? 1 : 0) +
                                (data.overheadSquat?.frontView?.knees?.kneesMoveinward ? 1 : 0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-300">Side View Compensations:</span>
                        <span className="ml-2 text-white font-medium">
                            {(data.overheadSquat?.sideView?.lphc?.excessiveForwardLean ? 1 : 0) +
                                (data.overheadSquat?.sideView?.lphc?.lowBackArches ? 1 : 0) +
                                (data.overheadSquat?.sideView?.upperBody?.armsFallForward ? 1 : 0)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverheadSquatAssessment;
