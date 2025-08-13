// src/pages/Settings.jsx
import React, { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext.jsx';
import { Info } from 'lucide-react';

export default function Settings() {
    const {
        unit, setUnit,
        useAutoIncrement, setUseAutoIncrement,
        customIncrement, setCustomIncrement,
        roundingIncrement,
    } = useSettings();

    // Ensure sensible default for custom increment when switching off auto
    useEffect(() => {
        if (!useAutoIncrement && (!customIncrement || Number(customIncrement) <= 0)) {
            setCustomIncrement(unit === 'kg' ? 2.5 : 5);
        }
    }, [useAutoIncrement, unit, customIncrement, setCustomIncrement]);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white">Settings</h1>
                <p className="text-gray-400">Units & rounding apply everywhere (builder, train, print).</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded p-5 space-y-4">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-200">
                        <div className="font-medium">5/3/1 Rounding</div>
                        <div>Defaults: 5 lb (US) or 2.5 kg (metric). You can override if you own microplates.</div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-gray-300 text-sm">Unit</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setUnit('lb')}
                                className={`px-3 py-1.5 rounded border text-sm ${unit === 'lb'
                                        ? 'border-red-500 text-white bg-red-600/20'
                                        : 'border-gray-600 text-gray-200 hover:bg-gray-700'
                                    }`}
                            >Pounds (lb)</button>
                            <button
                                onClick={() => setUnit('kg')}
                                className={`px-3 py-1.5 rounded border text-sm ${unit === 'kg'
                                        ? 'border-red-500 text-white bg-red-600/20'
                                        : 'border-gray-600 text-gray-200 hover:bg-gray-700'
                                    }`}
                            >Kilograms (kg)</button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-300 text-sm">Rounding Increment</label>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-gray-300 text-sm">
                                <input
                                    type="checkbox"
                                    className="accent-red-500"
                                    checked={useAutoIncrement}
                                    onChange={e => setUseAutoIncrement(e.target.checked)}
                                />
                                Auto ({unit === 'kg' ? '2.5 kg' : '5 lb'})
                            </label>
                            {!useAutoIncrement && (
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    value={customIncrement ?? ''}
                                    onChange={e => setCustomIncrement(e.target.value)}
                                    className="bg-gray-900 border border-gray-600 text-white rounded px-3 py-1.5 w-28"
                                    placeholder={unit === 'kg' ? '2.5' : '5'}
                                />
                            )}
                        </div>
                        <div className="text-xs text-gray-400">Effective rounding: <span className="text-gray-200 font-mono">{roundingIncrement} {unit}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
