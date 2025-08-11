import React from 'react';
import { User, AlertCircle } from 'lucide-react';

const SingleLegSquatAssessment = ({ data, onDataChange }) => {
    // NASM Single-Leg Squat Protocol from Chapter 6 (Pages 143-146)
    // 1. Hands on hips, eyes forward, stance neutral
    // 2. Squat to comfortable depth; ≤5 reps/side
    // Mark knee valgus; use Table 6-13 for muscle list

    const handleCompensationChange = (leg, field, value) => {
        const newData = {
            ...data,
            singleLegSquat: {
                ...data.singleLegSquat,
                [leg]: {
                    ...data.singleLegSquat[leg],
                    [field]: value
                }
            }
        };
        onDataChange(newData);
    };

    return (
        <div className="space-y-6">
            {/* NASM Protocol Instructions */}
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-blue-300">NASM Single-Leg Squat Assessment Protocol</h4>
                </div>
                <div className="text-sm text-blue-200 space-y-2">
                    <p><strong>Purpose:</strong> Assess dynamic flexibility, core strength, balance, and neuromuscular control</p>
                    <p><strong>Position:</strong> Hands on hips, eyes on point straight ahead, stance foot points straight</p>
                    <p><strong>Movement:</strong> Squat to comfortable level and return - up to 5 reps before switching sides</p>
                    <p><strong>Observation:</strong> Watch knee from front - should track in line with foot (2nd-3rd toes)</p>
                    <p><strong>Focus:</strong> Knee valgus (inward movement) - adduction and internal rotation</p>
                    <p><strong>Modification:</strong> Single-leg balance assessment if SLS too difficult (elderly)</p>
                    <p><strong>Reference:</strong> NASM-CPT 7th Edition, Chapter 6, pp. 143-146</p>
                </div>
            </div>

            {/* Right Leg Assessment */}
            <div className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-white">Right Leg Assessment</h4>
                    <span className="text-sm text-gray-400">(Standing on right leg)</span>
                </div>

                <div className="space-y-4">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={data.singleLegSquat?.rightLeg?.kneeValgus || false}
                            onChange={(e) => handleCompensationChange('rightLeg', 'kneeValgus', e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                        />
                        <div>
                            <span className="text-white font-medium">Knee Moves Inward</span>
                            <p className="text-gray-400 text-sm">Knee adducts and internally rotates during single-leg squat (NASM Figure 6.39)</p>
                            <p className="text-yellow-400 text-xs mt-1">
                                Table 6-13: Overactive - Adductors, TFL, Vastus lateralis; Underactive - Glute med/max, VMO
                            </p>
                        </div>
                    </label>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Additional Observations (Right Leg)
                        </label>
                        <textarea
                            value={data.singleLegSquat?.rightLeg?.notes || ''}
                            onChange={(e) => handleCompensationChange('rightLeg', 'notes', e.target.value)}
                            placeholder="Note any additional compensations: hip drop, trunk lean, loss of balance, inability to perform movement..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Left Leg Assessment */}
            <div className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-orange-400" />
                    <h4 className="text-lg font-semibold text-white">Left Leg Assessment</h4>
                    <span className="text-sm text-gray-400">(Standing on left leg)</span>
                </div>

                <div className="space-y-4">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={data.singleLegSquat?.leftLeg?.kneeValgus || false}
                            onChange={(e) => handleCompensationChange('leftLeg', 'kneeValgus', e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                        />
                        <div>
                            <span className="text-white font-medium">Knee Moves Inward</span>
                            <p className="text-gray-400 text-sm">Knee adducts and internally rotates during single-leg squat (NASM Figure 6.39)</p>
                            <p className="text-yellow-400 text-xs mt-1">
                                Table 6-13: Overactive - Adductors, TFL, Vastus lateralis; Underactive - Glute med/max, VMO
                            </p>
                        </div>
                    </label>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Additional Observations (Left Leg)
                        </label>
                        <textarea
                            value={data.singleLegSquat?.leftLeg?.notes || ''}
                            onChange={(e) => handleCompensationChange('leftLeg', 'notes', e.target.value)}
                            placeholder="Note any additional compensations: hip drop, trunk lean, loss of balance, inability to perform movement..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Population Modifications */}
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                <h5 className="text-md font-semibold text-yellow-300 mb-2">Population Modifications</h5>
                <div className="text-sm text-yellow-200 space-y-1">
                    <p><strong>Elderly or Balance Issues:</strong> Replace with single-leg balance test (hold for 30 seconds)</p>
                    <p><strong>Unable to Perform:</strong> Note inability to perform and assess balance instead</p>
                    <p><strong>Pain or Discomfort:</strong> Stop assessment and note limitations</p>
                </div>
            </div>

            {/* Assessment Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h5 className="text-md font-semibold text-white mb-3">Assessment Summary</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-gray-300">Right Leg Compensations:</span>
                        <span className="ml-2 text-white font-medium">
                            {data.singleLegSquat?.rightLeg?.kneeValgus ? 1 : 0}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-300">Left Leg Compensations:</span>
                        <span className="ml-2 text-white font-medium">
                            {data.singleLegSquat?.leftLeg?.kneeValgus ? 1 : 0}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-300">Bilateral Issues:</span>
                        <span className={`ml-2 font-medium ${(data.singleLegSquat?.rightLeg?.kneeValgus && data.singleLegSquat?.leftLeg?.kneeValgus)
                            ? 'text-red-400' : 'text-green-400'
                            }`}>
                            {(data.singleLegSquat?.rightLeg?.kneeValgus && data.singleLegSquat?.leftLeg?.kneeValgus)
                                ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>

                {/* NASM Table 6-13 Reference */}
                {(data.singleLegSquat?.rightLeg?.kneeValgus || data.singleLegSquat?.leftLeg?.kneeValgus) && (
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-600 rounded-md">
                        <h6 className="text-red-300 font-medium mb-2">NASM Table 6-13 - Muscle Imbalances Detected:</h6>
                        <div className="text-sm text-red-200">
                            <p><strong>Probable Overactive:</strong> Adductor complex, Biceps femoris (short), TFL, Vastus lateralis</p>
                            <p><strong>Probable Underactive:</strong> Gluteus medius/maximus, VMO</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleLegSquatAssessment;
