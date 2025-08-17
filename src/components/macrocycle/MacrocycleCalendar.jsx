import React, { useState } from 'react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    Eye,
    Settings,
    Target
} from 'lucide-react';

/**
 * MacrocycleCalendar - Interactive calendar view for mesocycle planning
 * 
 * Features:
 * - Month/Week view toggle
 * - Drag and drop mesocycles on calendar
 * - Visual representation of training phases
 * - Competition markers
 * - Goal timeline visualization
 */

export const MacrocycleCalendar = ({
    macrocycle,
    mesocycleTypes,
    programGoals,
    onUpdateMesocycle
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month'); // month, week, year
    const [selectedMesocycle, setSelectedMesocycle] = useState(null);

    // Calendar navigation
    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    const navigate = (direction) => {
        if (viewMode === 'month') {
            navigateMonth(direction);
        } else if (viewMode === 'week') {
            navigateWeek(direction);
        }
    };

    // Get calendar data based on view mode
    const getCalendarData = () => {
        if (viewMode === 'month') {
            return getMonthData();
        } else if (viewMode === 'week') {
            return getWeekData();
        } else {
            return getYearData();
        }
    };

    const getMonthData = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return {
            days,
            title: `${firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
            columns: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        };
    };

    const getWeekData = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const days = [];
        const current = new Date(startOfWeek);

        for (let i = 0; i < 7; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return {
            days,
            title: `Week of ${startOfWeek.toLocaleDateString()}`,
            columns: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        };
    };

    const getYearData = () => {
        const year = currentDate.getFullYear();
        const months = [];

        for (let i = 0; i < 12; i++) {
            months.push(new Date(year, i, 1));
        }

        return {
            days: months,
            title: `${year}`,
            columns: ['Q1', 'Q2', 'Q3', 'Q4']
        };
    };

    // Check if a date has mesocycles
    const getMesocyclesForDate = (date) => {
        return macrocycle.mesocycles.filter(meso => {
            const mesoStart = new Date(meso.startDate);
            const mesoEnd = new Date(meso.endDate);
            return date >= mesoStart && date <= mesoEnd;
        });
    };

    // Check if a date has competitions
    const getCompetitionsForDate = (date) => {
        return macrocycle.competitions.filter(comp => {
            const compDate = new Date(comp.date);
            return compDate.toDateString() === date.toDateString();
        });
    };

    // Get goals active on a date
    const getGoalsForDate = (date) => {
        const weekNumber = getWeekNumber(date, macrocycle.startDate);
        return macrocycle.goals.filter(goal =>
            weekNumber >= goal.startWeek && weekNumber <= goal.startWeek + goal.duration - 1
        );
    };

    const getWeekNumber = (date, startDate) => {
        const diffTime = date.getTime() - new Date(startDate).getTime();
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        return Math.max(1, diffWeeks);
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    const calendarData = getCalendarData();

    return (
        <div className="space-y-6">
            {/* Calendar header */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-300" />
                        </button>

                        <h3 className="text-xl font-semibold text-white">
                            {calendarData.title}
                        </h3>

                        <button
                            onClick={() => navigate(1)}
                            className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-300" />
                        </button>
                    </div>

                    {/* View mode toggles */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-3 py-2 rounded-md transition-colors ${viewMode === 'week'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                }`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-3 py-2 rounded-md transition-colors ${viewMode === 'month'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                }`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-2 bg-gray-600 text-gray-300 hover:bg-gray-500 rounded-md transition-colors"
                        >
                            Today
                        </button>
                    </div>
                </div>

                {/* Calendar legend */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-300">Accumulation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-gray-300">Intensification</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-gray-300">Realization</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-300">Restoration</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-yellow-400" />
                        <span className="text-gray-300">Competition</span>
                    </div>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
                {/* Column headers */}
                <div className={`grid ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'} border-b border-gray-600`}>
                    {calendarData.columns.map((col, index) => (
                        <div key={index} className="p-3 bg-gray-600 text-center font-medium text-gray-300">
                            {col}
                        </div>
                    ))}
                </div>

                {/* Calendar body */}
                <div className={`grid ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'}`}>
                    {calendarData.days.map((date, index) => {
                        const mesocycles = getMesocyclesForDate(date);
                        const competitions = getCompetitionsForDate(date);
                        const goals = getGoalsForDate(date);
                        const dayIsToday = isToday(date);
                        const dayInCurrentMonth = isCurrentMonth(date);

                        return (
                            <div
                                key={index}
                                className={`min-h-[120px] p-2 border-b border-r border-gray-600 ${dayIsToday ? 'bg-blue-900/30' : ''
                                    } ${!dayInCurrentMonth && viewMode === 'month' ? 'bg-gray-800 opacity-50' : ''
                                    }`}
                            >
                                {/* Date number */}
                                <div className={`text-sm font-medium mb-2 ${dayIsToday ? 'text-blue-400' :
                                        dayInCurrentMonth ? 'text-white' : 'text-gray-500'
                                    }`}>
                                    {viewMode === 'month' ? date.getDate() :
                                        viewMode === 'week' ? `${date.getDate()} ${date.toLocaleDateString('en', { weekday: 'short' })}` :
                                            date.toLocaleDateString('en', { month: 'short' })}
                                </div>

                                {/* Competitions */}
                                {competitions.map(comp => (
                                    <div key={comp.id} className="mb-1">
                                        <div className={`text-xs px-2 py-1 rounded bg-yellow-600 text-yellow-100 flex items-center gap-1`}>
                                            <Target className="h-3 w-3" />
                                            <span className="truncate">{comp.name}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Mesocycles */}
                                {mesocycles.map(meso => {
                                    const mesoType = mesocycleTypes[meso.type];
                                    return (
                                        <div key={meso.id} className="mb-1">
                                            <div
                                                className={`text-xs px-2 py-1 rounded bg-${mesoType.color}-600 text-${mesoType.color}-100 cursor-pointer hover:opacity-80 transition-opacity`}
                                                onClick={() => setSelectedMesocycle(meso)}
                                            >
                                                <div className="truncate font-medium">{meso.name}</div>
                                                <div className="opacity-75">{mesoType.name}</div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Goals indicator */}
                                {goals.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {goals.map(goal => {
                                            const goalConfig = programGoals[goal.type];
                                            return (
                                                <div
                                                    key={goal.id}
                                                    className={`w-2 h-2 rounded-full bg-${goalConfig.color}-400`}
                                                    title={goal.name}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Selected mesocycle details */}
            {selectedMesocycle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Mesocycle Details</h3>
                            <button
                                onClick={() => setSelectedMesocycle(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-white">{selectedMesocycle.name}</h4>
                                <p className="text-sm text-gray-300">
                                    {mesocycleTypes[selectedMesocycle.type]?.name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white ml-2">{selectedMesocycle.duration} weeks</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Week:</span>
                                    <span className="text-white ml-2">{selectedMesocycle.startWeek}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Volume:</span>
                                    <span className="text-white ml-2">{selectedMesocycle.volume}%</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Intensity:</span>
                                    <span className="text-white ml-2">{selectedMesocycle.intensity}%</span>
                                </div>
                            </div>

                            {selectedMesocycle.focus && (
                                <div>
                                    <h5 className="text-sm font-medium text-gray-300 mb-1">Focus:</h5>
                                    <p className="text-sm text-gray-400">{selectedMesocycle.focus}</p>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setSelectedMesocycle(null)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
