import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { debounce } from 'lodash';
import { unstable_batchedUpdates } from 'react-dom';

// Memoized Calendar component to prevent unnecessary re-renders
const Calendar = React.memo(({ events, onEventClick, onDateSelect, selectedDate }) => {
    const handleEventClick = useCallback((event) => {
        unstable_batchedUpdates(() => {
            onEventClick(event);
        });
    }, [onEventClick]);

    const handleDateSelect = useCallback((date) => {
        unstable_batchedUpdates(() => {
            onDateSelect(date);
        });
    }, [onDateSelect]);

    // Generate calendar days for current month
    const calendarDays = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getDate() === day &&
                    eventDate.getMonth() === currentMonth &&
                    eventDate.getFullYear() === currentYear;
            });

            days.push({
                date,
                day,
                events: dayEvents,
                isSelected: selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentMonth &&
                    selectedDate.getFullYear() === currentYear
            });
        }

        return days;
    }, [events, selectedDate]);

    return (
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm text-gray-400 py-2">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayData, index) => (
                    <div
                        key={index}
                        className={`h-12 border border-gray-700 cursor-pointer transition-colors ${dayData
                                ? dayData.isSelected
                                    ? 'bg-blue-600 text-white'
                                    : dayData.events.length > 0
                                        ? 'bg-blue-900 text-blue-200 hover:bg-blue-800'
                                        : 'hover:bg-gray-700 text-gray-300'
                                : 'bg-gray-800'
                            }`}
                        onClick={() => dayData && handleDateSelect(dayData.date)}
                    >
                        {dayData && (
                            <div className="p-1 text-center">
                                <div className="text-xs">{dayData.day}</div>
                                {dayData.events.length > 0 && (
                                    <div className="w-1 h-1 bg-blue-400 rounded-full mx-auto"></div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

// Memoized event row component for virtualization
const EventRow = React.memo(({ index, style, data }) => {
    const { events, onEventClick } = data;
    const event = events[index];

    const handleClick = useCallback(() => {
        onEventClick(event);
    }, [event, onEventClick]);

    return (
        <div style={style} className="px-2">
            <div
                className="bg-gray-800 p-3 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
                onClick={handleClick}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-medium">{event.title}</h4>
                        <p className="text-gray-400 text-sm">{event.description}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-blue-400 text-sm">{new Date(event.date).toLocaleDateString()}</p>
                        <span className={`px-2 py-1 rounded text-xs ${event.type === 'assessment' ? 'bg-green-900 text-green-200' :
                                event.type === 'program-start' ? 'bg-blue-900 text-blue-200' :
                                    event.type === 'block-change' ? 'bg-yellow-900 text-yellow-200' :
                                        event.type === 'deload' ? 'bg-purple-900 text-purple-200' :
                                            'bg-gray-900 text-gray-200'
                            }`}>
                            {event.type}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

const TimelineStep = ({ assessmentData, onInputChange, events = [], onEventUpdate }) => {
    // Memoize timeline options to prevent unnecessary re-renders
    const timelineOptions = useMemo(() => [
        '8-12 weeks',
        '12-16 weeks',
        '16-20 weeks',
        '20+ weeks'
    ], []);

    // Memoize local events with computed properties
    const localEvents = useMemo(() => {
        if (!events || events.length === 0) {
            // Generate sample events based on selected timeline
            const sampleEvents = [];
            if (assessmentData.timeline) {
                const startDate = new Date();
                const weeks = parseInt(assessmentData.timeline.split('-')[0]) || 8;

                // Add program start event
                sampleEvents.push({
                    id: 'start',
                    title: 'Program Start',
                    description: `Begin ${weeks}-week program`,
                    date: startDate.toISOString(),
                    type: 'program-start'
                });

                // Add block change events
                const blockInterval = Math.floor(weeks / 4);
                for (let i = 1; i < 4; i++) {
                    const blockDate = new Date(startDate);
                    blockDate.setDate(blockDate.getDate() + (blockInterval * i * 7));
                    sampleEvents.push({
                        id: `block-${i}`,
                        title: `Block ${i + 1} Start`,
                        description: `Transition to next training block`,
                        date: blockDate.toISOString(),
                        type: 'block-change'
                    });
                }

                // Add deload events
                const deloadDate = new Date(startDate);
                deloadDate.setDate(deloadDate.getDate() + (Math.floor(weeks / 2) * 7));
                sampleEvents.push({
                    id: 'deload',
                    title: 'Deload Week',
                    description: 'Recovery and restoration phase',
                    date: deloadDate.toISOString(),
                    type: 'deload'
                });
            }
            return sampleEvents;
        }
        return events;
    }, [events, assessmentData.timeline]);

    // Debounced drag drop handler to prevent excessive updates
    const debouncedHandleDrop = useMemo(
        () => debounce((eventId, newDate) => {
            if (onEventUpdate) {
                unstable_batchedUpdates(() => {
                    onEventUpdate(eventId, { date: newDate });
                });
            }
        }, 300),
        [onEventUpdate]
    );

    // Memoized event handlers to prevent re-renders
    const handleTimelineChange = useCallback((value) => {
        unstable_batchedUpdates(() => {
            onInputChange('timeline', value);
        });
    }, [onInputChange]);

    const handleEventClick = useCallback((event) => {
        console.log('Event clicked:', event);
    }, []);

    const handleDateSelect = useCallback((date) => {
        console.log('Date selected:', date);
    }, []);

    const handleDrop = useCallback((eventId, newDate) => {
        debouncedHandleDrop(eventId, newDate);
    }, [debouncedHandleDrop]);

    // Memoize whether to use virtualization based on event count
    const shouldUseVirtualization = useMemo(() => localEvents.length > 50, [localEvents.length]);

    // Memoized event list data for react-window
    const eventListData = useMemo(() => ({
        events: localEvents,
        onEventClick: handleEventClick
    }), [localEvents, handleEventClick]);

    return (
        <div className="flex flex-col bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Step 3: Timeline & Events</h3>
            <p className="text-gray-400 mb-6">How long do you want this program to run?</p>

            {/* Timeline Selection */}
            <div className="space-y-3 mb-8">
                {timelineOptions.map((timeline) => (
                    <label key={timeline} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            name="timeline"
                            value={timeline}
                            checked={assessmentData.timeline === timeline}
                            onChange={(e) => handleTimelineChange(e.target.value)}
                            className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-white">{timeline}</span>
                    </label>
                ))}
            </div>

            {/* Calendar View */}
            {assessmentData.timeline && (
                <div className="space-y-6">
                    <div>
                        <h4 className="text-lg font-medium text-white mb-4">Program Calendar</h4>
                        <Calendar
                            events={localEvents}
                            onEventClick={handleEventClick}
                            onDateSelect={handleDateSelect}
                            selectedDate={null}
                        />
                    </div>

                    {/* Events List */}
                    <div>
                        <h4 className="text-lg font-medium text-white mb-4">
                            Program Events ({localEvents.length})
                        </h4>

                        {shouldUseVirtualization ? (
                            // Use react-window for large lists
                            <div className="bg-gray-900 rounded-lg border border-gray-700">
                                <List
                                    height={400}
                                    itemCount={localEvents.length}
                                    itemSize={80}
                                    itemData={eventListData}
                                    className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                                >
                                    {EventRow}
                                </List>
                            </div>
                        ) : (
                            // Regular rendering for smaller lists
                            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                {localEvents.map((event, index) => (
                                    <EventRow
                                        key={event.id}
                                        index={index}
                                        data={eventListData}
                                        style={{}} // Empty style for non-virtualized items
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(TimelineStep);
