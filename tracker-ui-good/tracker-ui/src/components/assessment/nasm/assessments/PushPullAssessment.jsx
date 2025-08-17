import React from 'react';
import { ArrowRightCircle, ArrowLeftCircle, AlertCircle } from 'lucide-react';

const PushPullAssessment = ({ data, onDataChange }) => {
    // NASM Push/Pull Assessment Protocol from Chapter 6 (Pages 147-150)
    // Pushing: Split-stance, core braced; press handles forward & return, 20 controlled reps
    // Pulling: Stand feet shoulder-width, core braced; pull handles to torso, 20 reps

    const pushPullData = data.pushPull || {
        pushing: {
            lphc: { lowBackArches: false, notes: '' },
            shoulders: { shoulderElevation: false, notes: '' },
            head: { headMigratesForward: false, notes: '' }
        },
        pulling: {
            lphc: { lowBackArches: false, notes: '' },
            shoulders: { shoulderElevation: false, notes: '' },
            head: { headMigratesForward: false, notes: '' }
        }
    };

    const handlePushingChange = (section, field, value) => {
        const newData = {
            ...data,
            pushPull: {
                ...pushPullData,
                pushing: {
                    ...pushPullData.pushing,
                    [section]: {
                        ...pushPullData.pushing[section],
                        [field]: value
                    }
                }
            }
        };
        onDataChange(newData);
    };

    const handlePullingChange = (section, field, value) => {
        const newData = {
            ...data,
            pushPull: {
                ...pushPullData,
                pulling: {
                    ...pushPullData.pulling,
                    [section]: {
                        ...pushPullData.pulling[section],
                        [field]: value
                    }
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
                    <h4 className="text-lg font-semibold text-blue-300">NASM Pushing and Pulling Assessment (pp. 146-149)</h4>
                </div>
                <div className="text-sm text-blue-200 space-y-2">
                    <p><strong>Equipment:</strong> Cable machine, tubing with handles, or functional trainer</p>
                    <p><strong>Pushing Setup:</strong> Split-stance position, hands positioned at chest height (Figure 6.40)</p>
                    <p><strong>Pulling Setup:</strong> Feet shoulder-width apart, hands positioned at chest height (Figure 6.41)</p>
                    <p><strong>Repetitions:</strong> ≤20 controlled repetitions for each movement pattern</p>
                    <p><strong>View:</strong> Lateral view to observe compensations</p>
                    <p><strong>Focus:</strong> Three primary compensations (see Tables 6-14 and 6-15)</p>
                </div>
            </div>

            {/* Pushing Assessment */}
            <div className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                    <ArrowRightCircle className="h-5 w-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-white">Pushing Assessment</h4>
                    <span className="text-sm text-gray-400">(≤20 reps, Table 6-14)</span>
                </div>

                {/* LPHC Assessment */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">LPHC (Lumbo-Pelvic-Hip Complex)</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={pushPullData.pushing?.lphc?.lowBackArches || false}
                                onChange={(e) => handlePushingChange('lphc', 'lowBackArches', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Low Back Arches</span>
                                <p className="text-gray-400 text-sm">Excessive lumbar extension during pushing movement</p>
                                <p className="text-yellow-400 text-xs mt-1">
                                    <strong>Overactive:</strong> Hip flexor complex, erector spinae<br />
                                    <strong>Underactive:</strong> Intrinsic core stabilizers
                                </p>
                            </div>
                        </label>
                        <textarea
                            value={pushPullData.pushing?.lphc?.notes || ''}
                            onChange={(e) => handlePushingChange('lphc', 'notes', e.target.value)}
                            placeholder="Additional LPHC observations during pushing..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>

                {/* Shoulder Complex Assessment */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">Shoulder Complex</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={pushPullData.pushing?.shoulders?.shoulderElevation || false}
                                onChange={(e) => handlePushingChange('shoulders', 'shoulderElevation', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Shoulder Elevation</span>
                                <p className="text-gray-400 text-sm">Shoulders rise up toward ears during pushing</p>
                                <p className="text-yellow-400 text-xs mt-1">
                                    <strong>Overactive:</strong> Upper trapezius, sternocleidomastoid, levator scapulae<br />
                                    <strong>Underactive:</strong> Mid/lower trapezius, serratus anterior, deep cervical flexors
                                </p>
                            </div>
                        </label>
                        <textarea
                            value={pushPullData.pushing?.shoulders?.notes || ''}
                            onChange={(e) => handlePushingChange('shoulders', 'notes', e.target.value)}
                            placeholder="Additional shoulder observations during pushing..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>

                {/* Head Position Assessment */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">Head Position</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={pushPullData.pushing?.head?.headMigratesForward || false}
                                onChange={(e) => handlePushingChange('head', 'headMigratesForward', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Head Migrates Forward</span>
                                <p className="text-gray-400 text-sm">Head moves forward from neutral position during pushing</p>
                                <p className="text-yellow-400 text-xs mt-1">
                                    <strong>Overactive:</strong> Upper trapezius, sternocleidomastoid, levator scapulae<br />
                                    <strong>Underactive:</strong> Deep cervical flexors
                                </p>
                            </div>
                        </label>
                        <textarea
                            value={pushPullData.pushing?.head?.notes || ''}
                            onChange={(e) => handlePushingChange('head', 'notes', e.target.value)}
                            placeholder="Additional head position observations during pushing..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Pulling Assessment */}
            <div className="bg-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                    <ArrowLeftCircle className="h-5 w-5 text-orange-400" />
                    <h4 className="text-lg font-semibold text-white">Pulling Assessment</h4>
                    <span className="text-sm text-gray-400">(≤20 reps, Table 6-15)</span>
                </div>

                {/* LPHC Assessment */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">LPHC (Lumbo-Pelvic-Hip Complex)</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={pushPullData.pulling?.lphc?.lowBackArches || false}
                                onChange={(e) => handlePullingChange('lphc', 'lowBackArches', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Low Back Arches</span>
                                <p className="text-gray-400 text-sm">Excessive lumbar extension during pulling movement</p>
                                <p className="text-yellow-400 text-xs mt-1">
                                    <strong>Overactive:</strong> Hip flexor complex, erector spinae<br />
                                    <strong>Underactive:</strong> Intrinsic core stabilizers
                                </p>
                            </div>
                        </label>
                        <textarea
                            value={pushPullData.pulling?.lphc?.notes || ''}
                            onChange={(e) => handlePullingChange('lphc', 'notes', e.target.value)}
                            placeholder="Additional LPHC observations during pulling..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>

                {/* Shoulder Complex Assessment */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">Shoulder Complex</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={pushPullData.pulling?.shoulders?.shoulderElevation || false}
                                onChange={(e) => handlePullingChange('shoulders', 'shoulderElevation', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Shoulder Elevation</span>
                                <p className="text-gray-400 text-sm">Shoulders rise up toward ears during pulling</p>
                                <p className="text-yellow-400 text-xs mt-1">
                                    <strong>Overactive:</strong> Upper trapezius, sternocleidomastoid, levator scapulae<br />
                                    <strong>Underactive:</strong> Mid/lower trapezius, serratus anterior, deep cervical flexors
                                </p>
                            </div>
                        </label>
                        <textarea
                            value={pushPullData.pulling?.shoulders?.notes || ''}
                            onChange={(e) => handlePullingChange('shoulders', 'notes', e.target.value)}
                            placeholder="Additional shoulder observations during pulling..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>

                {/* Head Position Assessment */}
                <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-300 mb-3">Head Position</h5>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={pushPullData.pulling?.head?.headMigratesForward || false}
                                onChange={(e) => handlePullingChange('head', 'headMigratesForward', e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-white font-medium">Head Migrates Forward</span>
                                <p className="text-gray-400 text-sm">Head moves forward from neutral position during pulling</p>
                                <p className="text-yellow-400 text-xs mt-1">
                                    <strong>Overactive:</strong> Upper trapezius, sternocleidomastoid, levator scapulae<br />
                                    <strong>Underactive:</strong> Deep cervical flexors
                                </p>
                            </div>
                        </label>
                        <textarea
                            value={pushPullData.pulling?.head?.notes || ''}
                            onChange={(e) => handlePullingChange('head', 'notes', e.target.value)}
                            placeholder="Additional head position observations during pulling..."
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 text-sm"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Assessment Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h5 className="text-md font-semibold text-white mb-3">Push/Pull Assessment Summary</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-300">Pushing Compensations:</span>
                        <span className="ml-2 text-white font-medium">
                            {(pushPullData.pushing?.lphc?.lowBackArches ? 1 : 0) +
                                (pushPullData.pushing?.shoulders?.shoulderElevation ? 1 : 0) +
                                (pushPullData.pushing?.head?.headMigratesForward ? 1 : 0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-300">Pulling Compensations:</span>
                        <span className="ml-2 text-white font-medium">
                            {(pushPullData.pulling?.lphc?.lowBackArches ? 1 : 0) +
                                (pushPullData.pulling?.shoulders?.shoulderElevation ? 1 : 0) +
                                (pushPullData.pulling?.head?.headMigratesForward ? 1 : 0)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PushPullAssessment;
