// Design System Constants and Components
// Based on PowerHouse Tracker UI/UX Specifications

export const COLORS = {
    // Primary Colors
    primary: {
        red: '#FF0000',
        black: '#000000',
        white: '#FFFFFF',
    },

    // Grays (Dark Theme)
    gray: {
        900: '#111827', // Background
        800: '#1F2937', // Cards
        700: '#374151', // Borders
        600: '#4B5563', // Disabled
        400: '#9CA3AF', // Subtle text
        100: '#F3F4F6', // Primary text
    },

    // Status Colors
    status: {
        success: '#22C55E',
        warning: '#EAB308',
        danger: '#EF4444',
        info: '#3B82F6',
    },

    // Volume Indicators
    volume: {
        belowMEV: '#22C55E',    // Green - needs more
        optimal: '#3B82F6',     // Blue - good range
        nearMRV: '#EAB308',     // Yellow - caution
        aboveMRV: '#EF4444',    // Red - too much
    }
};

export const TYPOGRAPHY = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    sizes: {
        xs: '0.75rem',   // 12px
        sm: '0.875rem',  // 14px
        base: '1rem',    // 16px
        lg: '1.125rem',  // 18px
        xl: '1.25rem',   // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
    }
};

export const SPACING = {
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    12: '3rem',    // 48px
};

// Common component classes
export const COMPONENT_CLASSES = {
    // Cards
    card: 'bg-gray-900 rounded-lg border border-gray-700',
    cardSecondary: 'bg-gray-800 rounded-lg border border-gray-600',

    // Buttons
    buttonPrimary: 'bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105',
    buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors',
    buttonDisabled: 'bg-gray-600 text-gray-400 cursor-not-allowed',

    // Forms
    input: 'w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
    inputError: 'border-red-500 focus:ring-red-500',
    label: 'block text-sm font-medium text-gray-300 mb-2',

    // Progress
    progressBar: 'w-full bg-gray-800 rounded-full h-2',
    progressFill: 'bg-red-600 h-2 rounded-full transition-all duration-300',

    // Volume indicators
    volumeBar: 'w-full bg-gray-700 rounded-full h-2',
    volumeBarOptimal: 'bg-blue-500 h-2 rounded-full transition-all duration-300',
    volumeBarCaution: 'bg-yellow-500 h-2 rounded-full transition-all duration-300',
    volumeBarDanger: 'bg-red-500 h-2 rounded-full transition-all duration-300',
};

// Volume Progress Component
export const VolumeProgressBar = ({ current, mev, mrv, muscle }) => {
    const percentage = (current / mrv) * 100;
    const isBelowMEV = current < mev;
    const isNearMRV = current > mrv * 0.8;
    const isAboveMRV = current > mrv;

    let barColor = COLORS.volume.optimal;
    if (isBelowMEV) barColor = COLORS.volume.belowMEV;
    if (isNearMRV) barColor = COLORS.volume.nearMRV;
    if (isAboveMRV) barColor = COLORS.volume.aboveMRV;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-gray-200 font-medium capitalize">{muscle}</span>
                <span className="text-gray-100 font-bold">{current}/{mrv} sets</span>
            </div>

            <div className="relative">
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: barColor
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>MEV ↑</span>
                    <span>↑ MRV</span>
                </div>
            </div>

            {/* Status indicator */}
            <div className="text-xs">
                {isBelowMEV && <span className="text-green-400">• Below MEV - Increase volume</span>}
                {!isBelowMEV && !isNearMRV && <span className="text-blue-400">• Optimal range</span>}
                {isNearMRV && !isAboveMRV && <span className="text-yellow-400">• Near MRV - Monitor fatigue</span>}
                {isAboveMRV && <span className="text-red-400">• Above MRV - Reduce volume</span>}
            </div>
        </div>
    );
};

// Phase Card Component
export const PhaseCard = ({ phase, weeks, current, total, description, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-900/20 border-blue-600/30 text-blue-300',
        yellow: 'bg-yellow-900/20 border-yellow-600/30 text-yellow-300',
        red: 'bg-red-900/20 border-red-600/30 text-red-300',
        gray: 'bg-gray-800/20 border-gray-600/30 text-gray-300',
    };

    const percentage = (current / total) * 100;

    return (
        <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg">{phase} PHASE</h3>
                    <p className="text-sm opacity-70">Weeks {weeks}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm opacity-70">Progress</div>
                    <div className="font-bold">{Math.round(percentage)}%</div>
                </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${color === 'blue' ? 'bg-blue-500' :
                            color === 'yellow' ? 'bg-yellow-500' :
                                color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <p className="text-sm opacity-80">{description}</p>
        </div>
    );
};

// Step Progress Component
export const StepProgress = ({ currentStep, totalSteps, steps }) => {
    return (
        <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <div key={stepNumber} className="flex items-center">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${isActive ? 'bg-red-600 text-white' :
                                    isCompleted ? 'bg-green-600 text-white' :
                                        'bg-gray-600 text-gray-400'
                                }`}>
                                {isCompleted ? '✓' : stepNumber}
                            </div>
                            <span className={`ml-2 text-sm ${isActive ? 'text-white' :
                                    isCompleted ? 'text-green-400' :
                                        'text-gray-400'
                                }`}>
                                {step}
                            </span>
                        </div>
                        {stepNumber < totalSteps && (
                            <div className={`w-8 h-0.5 ml-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-600'
                                }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    COMPONENT_CLASSES,
    VolumeProgressBar,
    PhaseCard,
    StepProgress
};
