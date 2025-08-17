{/* Supplemental Configuration Section */ }
<div className="mt-5">
    {/* BBB Configuration */}
    {suppStrategy === 'bbb' && (
        <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
            <div className="flex items-center">
                <div className="text-white font-medium">BBB Configuration</div>
                <div className="ml-auto flex items-center bg-blue-500/20 border border-blue-500/30 rounded-full px-2 py-0.5 text-[10px] text-blue-300">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    <span>High Volume</span>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-200">Supplemental Pairing</label>
                <p className="text-xs text-gray-400 mb-2">Choose how BBB is paired after your main lift.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="inline-flex items-center justify-between gap-2 text-xs bg-gray-900/50 border border-gray-700 rounded p-3 cursor-pointer">
                        <div>
                            <div className="font-medium text-white">Same Lift</div>
                            <div className="text-[11px] text-gray-400 mt-1">BBB sets use same movement as main work</div>
                            <div className="mt-2 text-[10px] text-blue-300">Recommended for pure hypertrophy focus</div>
                        </div>
                        <input
                            type="radio"
                            name="suppPairing"
                            value="same"
                            checked={suppPairing === 'same'}
                            onChange={() => setSuppPairing('same')}
                        />
                    </label>
                    <label className="inline-flex items-center justify-between gap-2 text-xs bg-gray-900/50 border border-gray-700 rounded p-3 cursor-pointer">
                        <div>
                            <div className="font-medium text-white">Opposite Lift</div>
                            <div className="text-[11px] text-gray-400 mt-1">Press + Bench, Squat + Deadlift pairings</div>
                            <div className="mt-2 text-[10px] text-green-300">Better recovery between workouts</div>
                        </div>
                        <input
                            type="radio"
                            name="suppPairing"
                            value="opposite"
                            checked={suppPairing === 'opposite'}
                            onChange={() => setSuppPairing('opposite')}
                        />
                    </label>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-xs uppercase text-gray-400">Percentage of TM</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="50"
                            max="70"
                            step="5"
                            value={suppPct}
                            onChange={e => setSuppPct(Number(e.target.value))}
                            className="w-full"
                        />
                        <input
                            type="number"
                            value={suppPct}
                            min={50}
                            max={70}
                            onChange={e => setSuppPct(Number(e.target.value))}
                            className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-red-500"
                        />
                        <span className="text-gray-400">%</span>
                    </div>
                    {!validation.supplementalOk && <p className="text-xs text-yellow-300">Range 50-70%</p>}
                </div>
                <div className="space-y-2">
                    <label className="block text-xs uppercase text-gray-400">Sets × Reps</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: '5x10', label: '5×10', desc: 'Standard' },
                            { id: '5x8', label: '5×8', desc: 'Reduced' },
                            { id: '4x10', label: '4×10', desc: 'Moderate' }
                        ].map(format => (
                            <button
                                key={format.id}
                                type="button"
                                onClick={() => dispatch({
                                    type: 'SET_SUPPLEMENTAL_DETAILS',
                                    details: { ...(state?.supplemental?.details || {}), bbbFormat: format.id }
                                })}
                                className={`px-3 py-1 rounded border text-sm ${(state?.supplemental?.details?.bbbFormat || '5x10') === format.id ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}
                            >
                                {format.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/40 rounded p-3 text-[11px] text-blue-100 flex space-x-2 leading-snug">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-medium mb-1">BBB Programming Guidelines</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Lower percentages (50-60%) work best for most lifters</li>
                        <li>Use 60-70% only if recovery is excellent and main work is conservative</li>
                        <li>Consider reduced conditioning with higher BBB percentages</li>
                        <li>For best results, run BBB for 2-3 cycles before changing templates</li>
                    </ul>
                </div>
            </div>
        </div>
    )}

    {/* FSL Configuration */}
    {suppStrategy === 'fsl' && (
        <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
            <div className="flex items-center">
                <div className="text-white font-medium">FSL Configuration</div>
                <div className="ml-auto flex items-center bg-green-500/20 border border-green-500/30 rounded-full px-2 py-0.5 text-[10px] text-green-300">
                    <RefreshCcw className="w-3 h-3 mr-1" />
                    <span>Balanced</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200">Format</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {[
                            { id: '5x5', label: '5×5', desc: 'Standard format' },
                            { id: '5x8', label: '5×8', desc: 'Higher volume' },
                            { id: '3x8', label: '3×8', desc: 'Moderate volume' },
                            { id: '5x3', label: '5×3', desc: 'Strength focus' }
                        ].map(format => (
                            <button
                                key={format.id}
                                type="button"
                                onClick={() => dispatch({
                                    type: 'SET_SUPPLEMENTAL_DETAILS',
                                    details: { ...(state?.supplemental?.details || {}), fslFormat: format.id }
                                })}
                                className={`px-3 py-1 rounded border text-sm ${(state?.supplemental?.details?.fslFormat || '5x5') === format.id ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}
                            >
                                {format.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">First Set Last uses your first working set percentage for balanced intensity and volume.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200">Percentage Info</label>
                    <div className="text-[11px] text-gray-300 mt-2">
                        <div className="flex justify-between">
                            <span>Week 1:</span>
                            <span className="font-mono">65% TM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Week 2:</span>
                            <span className="font-mono">70% TM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Week 3:</span>
                            <span className="font-mono">75% TM</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-green-900/20 border border-green-700/40 rounded p-3 text-[11px] text-green-100 flex space-x-2 leading-snug">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-medium mb-1">FSL Supplemental Variants</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><span className="font-medium">Standard FSL:</span> 5×5 format balances strength and hypertrophy</li>
                        <li><span className="font-medium">FSL Widowmakers:</span> 1×20 reps at FSL weight (for squats primarily)</li>
                        <li><span className="font-medium">FSL AMRAP:</span> Single set, as many reps as possible with good form</li>
                        <li><span className="font-medium">FSL PR Sets:</span> Push for rep PRs on supplemental work (advanced)</li>
                    </ul>
                </div>
            </div>
        </div>
    )}

    {/* SSL Configuration */}
    {suppStrategy === 'ssl' && (
        <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
            <div className="flex items-center">
                <div className="text-white font-medium">SSL Configuration</div>
                <div className="ml-auto flex items-center bg-yellow-500/20 border border-yellow-500/30 rounded-full px-2 py-0.5 text-[10px] text-yellow-300">
                    <Gauge className="w-3 h-3 mr-1" />
                    <span>Higher Intensity</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200">Format</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {[
                            { id: '5x5', label: '5×5', desc: 'Standard format' },
                            { id: '5x3', label: '5×3', desc: 'Lower volume' },
                            { id: '3x5', label: '3×5', desc: 'Moderate volume' },
                            { id: '3x3', label: '3×3', desc: 'Pure strength' }
                        ].map(format => (
                            <button
                                key={format.id}
                                type="button"
                                onClick={() => dispatch({
                                    type: 'SET_SUPPLEMENTAL_DETAILS',
                                    details: { ...(state?.supplemental?.details || {}), sslFormat: format.id }
                                })}
                                className={`px-3 py-1 rounded border text-sm ${(state?.supplemental?.details?.sslFormat || '5x5') === format.id ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}
                            >
                                {format.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">Second Set Last uses your second working set percentage for increased intensity.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200">Percentage Info</label>
                    <div className="text-[11px] text-gray-300 mt-2">
                        <div className="flex justify-between">
                            <span>Week 1:</span>
                            <span className="font-mono">70% TM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Week 2:</span>
                            <span className="font-mono">80% TM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Week 3:</span>
                            <span className="font-mono">85% TM</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded p-3 text-[11px] text-yellow-100 flex space-x-2 leading-snug">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-medium mb-1">SSL Recovery Considerations</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>SSL is more demanding than FSL and requires excellent recovery</li>
                        <li>Consider reducing assistance volume when using SSL</li>
                        <li>May be best implemented on a Leader cycle or with reduced conditioning</li>
                        <li>Often paired with 5's PRO for main work to manage overall fatigue</li>
                    </ul>
                </div>
            </div>
        </div>
    )}

    {/* BBS Configuration */}
    {suppStrategy === 'bbs' && (
        <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
            <div className="flex items-center">
                <div className="text-white font-medium">BBS Configuration</div>
                <div className="ml-auto flex items-center bg-purple-500/20 border border-purple-500/30 rounded-full px-2 py-0.5 text-[10px] text-purple-300">
                    <Dumbbell className="w-3 h-3 mr-1" />
                    <span>Strength-Hypertrophy</span>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-xs uppercase text-gray-400">Percentage of TM</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="65"
                            max="75"
                            step="5"
                            value={state?.supplemental?.details?.bbsPercentage || 65}
                            onChange={e => dispatch({
                                type: 'SET_SUPPLEMENTAL_DETAILS',
                                details: { ...(state?.supplemental?.details || {}), bbsPercentage: Number(e.target.value) }
                            })}
                            className="w-full"
                        />
                        <input
                            type="number"
                            value={state?.supplemental?.details?.bbsPercentage || 65}
                            min={65}
                            max={75}
                            onChange={e => dispatch({
                                type: 'SET_SUPPLEMENTAL_DETAILS',
                                details: { ...(state?.supplemental?.details || {}), bbsPercentage: Number(e.target.value) }
                            })}
                            className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-red-500"
                        />
                        <span className="text-gray-400">%</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-xs uppercase text-gray-400">Sets × Reps Format</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: '5x5', label: '5×5', desc: 'Standard' },
                            { id: '5x3', label: '5×3', desc: 'Reduced' },
                            { id: '3x5', label: '3×5', desc: 'Moderate' }
                        ].map(format => (
                            <button
                                key={format.id}
                                type="button"
                                onClick={() => dispatch({
                                    type: 'SET_SUPPLEMENTAL_DETAILS',
                                    details: { ...(state?.supplemental?.details || {}), bbsFormat: format.id }
                                })}
                                className={`px-3 py-1 rounded border text-sm ${(state?.supplemental?.details?.bbsFormat || '5x5') === format.id ? 'border-red-500 ring-2 ring-red-600 text-white' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}
                            >
                                {format.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-purple-900/20 border border-purple-700/40 rounded p-3 text-[11px] text-purple-100 flex space-x-2 leading-snug">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-medium mb-1">BBS Implementation Notes</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>BBS combines the higher intensity of SSL with the multiple set approach of BBB</li>
                        <li>Most effective when combined with reduced assistance work and careful conditioning</li>
                        <li>Best implemented after establishing a solid base with BBB or FSL</li>
                        <li>Consider using "opposite lift" pairings to enhance recovery between sessions</li>
                    </ul>
                </div>
            </div>
        </div>
    )}

    {/* Specialized Template Configurations */}
    {state?.supplemental?.type === 'widowmaker' && (
        <div className="bg-gray-800/60 border border-gray-700 rounded p-4 space-y-4">
            <div className="flex items-center">
                <div className="text-white font-medium">Widowmaker Configuration</div>
                <div className="ml-auto flex items-center bg-red-500/20 border border-red-500/30 rounded-full px-2 py-0.5 text-[10px] text-red-300">
                    <Skull className="w-3 h-3 mr-1" />
                    <span>High Intensity</span>
                </div>
            </div>

            <div className="bg-red-900/20 border border-red-700/40 rounded p-3 text-[11px] text-red-100 flex space-x-2 leading-snug">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="font-medium mb-1">Widowmaker Implementation</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Single set of 20 reps at 65% TM (FSL percentage)</li>
                        <li>Most effective with squats, but can be applied to other lifts</li>
                        <li>Requires excellent conditioning and mental toughness</li>
                        <li>Limit to one Widowmaker set per workout</li>
                        <li>Reduce assistance work on Widowmaker days</li>
                    </ul>
                </div>
            </div>
        </div>
    )}
</div>
