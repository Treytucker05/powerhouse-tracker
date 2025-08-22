import React from 'react';
import { TEMPLATE_DETAILS, TEMPLATE_META } from '@/lib/builder/templates';

interface WorkoutPreviewProps {
    templateId: string;
    expanded?: boolean;
}

// Sample TM values for preview calculations
const SAMPLE_TMS = {
    press: 135,
    deadlift: 315,
    bench: 225,
    squat: 275
};

// Calculate percentage of TM for preview
const calcPercentage = (lift: keyof typeof SAMPLE_TMS, percent: number) => {
    return Math.round(SAMPLE_TMS[lift] * (percent / 100));
};

// Detailed template explanations
const TEMPLATE_EXPLANATIONS = {
    bbb: {
        title: "Boring But Big (BBB)",
        subtitle: "High Volume Hypertrophy Template",
        philosophy: "The most popular 5/3/1 template focused on building muscle mass through high-volume supplemental work.",
        howItWorks: [
            "Perform main 5/3/1 sets for strength",
            "Follow with 5×10 supplemental sets at 50-60% TM",
            "Can use same lift (boring) or opposing lift (more boring)",
            "Minimal assistance work to focus on the big compound movements"
        ],
        bestFor: ["Building muscle mass", "Improving work capacity", "Beginners to intermediate lifters"],
        programming: "The 5×10 sets start light (50% TM) and can progress to 60% over several cycles",
        timeCommitment: "45-60 minutes per session",
        difficulty: "Moderate - high volume but straightforward"
    },
    triumvirate: {
        title: "The Triumvirate",
        subtitle: "Balanced Strength & Size Template",
        philosophy: "A well-rounded template combining strength work with targeted assistance for balanced development.",
        howItWorks: [
            "Perform main 5/3/1 sets",
            "Add First Set Last (FSL) supplemental work",
            "Include 2 assistance exercises per session",
            "Focus on weak points and muscle balance"
        ],
        bestFor: ["All-around development", "Addressing weak points", "Intermediate lifters"],
        programming: "FSL uses your first main set weight for 3-5 additional sets",
        timeCommitment: "50-70 minutes per session",
        difficulty: "Moderate - good balance of work"
    },
    jackshit: {
        title: "Jack Shit",
        subtitle: "Minimalist Strength Template",
        philosophy: "Pure strength focus with just the main lifts - perfect for time-crunched lifters or strength specialists.",
        howItWorks: [
            "Perform only the main 5/3/1 sets",
            "No supplemental work",
            "No assistance work",
            "Focus purely on getting stronger at the big 4"
        ],
        bestFor: ["Time-crunched lifters", "Strength focus", "Deload periods"],
        programming: "Just the core 5/3/1 progression - simple and effective",
        timeCommitment: "20-30 minutes per session",
        difficulty: "Easy - minimal volume"
    },
    periodization_bible: {
        title: "Periodization Bible",
        subtitle: "Advanced Periodization Template",
        philosophy: "Based on periodization principles with varied training phases and intelligent progression.",
        howItWorks: [
            "Perform main 5/3/1 sets",
            "Use Second Set Last (SSL) supplemental work",
            "Include periodized assistance work",
            "Varies volume and intensity over time"
        ],
        bestFor: ["Advanced lifters", "Competition preparation", "Long-term progression"],
        programming: "SSL uses your second main set weight for additional volume",
        timeCommitment: "60-80 minutes per session",
        difficulty: "Advanced - requires experience"
    }
};

// Get rep scheme for a given week and day with detailed explanations
const getRepScheme = (week: number, templateId: string) => {
    // Classic 5/3/1 progression
    switch (week) {
        case 1: return {
            sets: [5, 5, 5],
            percents: [65, 75, 85],
            amrap: true,
            description: "Week 1: Volume building - moderate intensity with AMRAP final set",
            focus: "Build work capacity and groove movement patterns"
        };
        case 2: return {
            sets: [3, 3, 3],
            percents: [70, 80, 90],
            amrap: true,
            description: "Week 2: Intensity building - heavier weights with lower reps",
            focus: "Prepare nervous system for heavier loads"
        };
        case 3: return {
            sets: [5, 3, 1],
            percents: [75, 85, 95],
            amrap: true,
            description: "Week 3: Peak intensity - test your strength with heavy singles",
            focus: "Express maximum strength and set rep PRs"
        };
        case 4: return {
            sets: [5, 5, 5],
            percents: [40, 50, 60],
            amrap: false,
            description: "Week 4: Deload - light weights for recovery and technique",
            focus: "Allow body to recover while maintaining movement quality"
        };
        default: return {
            sets: [5, 5, 5],
            percents: [65, 75, 85],
            amrap: true,
            description: "Standard volume week",
            focus: "Build strength foundation"
        };
    }
};

// Get detailed supplemental work information
const getSupplementalPreview = (templateId: string, lift: keyof typeof SAMPLE_TMS) => {
    switch (templateId) {
        case 'bbb':
            return {
                scheme: '5 × 10',
                weight: calcPercentage(lift, 50),
                description: '50% TM (start), progress to 60%',
                purpose: 'High volume for muscle growth and work capacity',
                progression: 'Start at 50% TM, increase 5% every 2-3 cycles',
                tips: 'Keep rest periods short (60-90 seconds) for conditioning effect'
            };
        case 'triumvirate':
            return {
                scheme: 'FSL (First Set Last)',
                weight: calcPercentage(lift, 65),
                description: 'First Set Last - same as main work opener',
                purpose: 'Additional practice with moderate weight',
                progression: 'Use first main set weight for 3-5 additional sets',
                tips: 'Focus on speed and form - should feel relatively easy'
            };
        case 'periodization_bible':
            return {
                scheme: 'SSL (Second Set Last)',
                weight: calcPercentage(lift, 75),
                description: 'Second Set Last - middle main work weight',
                purpose: 'More challenging supplemental work for strength',
                progression: 'Use second main set weight for 3-5 sets',
                tips: 'Heavier than FSL but still manageable for multiple sets'
            };
        case 'jackshit':
            return {
                scheme: 'None',
                weight: 0,
                description: 'No supplemental work',
                purpose: 'Pure strength focus with minimal fatigue',
                progression: 'N/A - only main work',
                tips: 'Perfect for when time is limited or during high stress periods'
            };
        default:
            return {
                scheme: 'FSL',
                weight: calcPercentage(lift, 65),
                description: 'First Set Last',
                purpose: 'Additional volume at moderate intensity',
                progression: 'Matches first main set',
                tips: 'Good balance of volume and intensity'
            };
    }
};

// Template Overview Component - shows what the template is about
const TemplateOverview: React.FC<{ templateId: string }> = ({ templateId }) => {
    const explanation = TEMPLATE_EXPLANATIONS[templateId as keyof typeof TEMPLATE_EXPLANATIONS];

    if (!explanation) return null;

    return (
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg p-4">
            <div className="mb-3">
                <h3 className="text-lg font-bold text-blue-200 mb-1">{explanation.title}</h3>
                <p className="text-sm text-blue-300 italic">{explanation.subtitle}</p>
            </div>

            <div className="space-y-3">
                <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-1">Philosophy:</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{explanation.philosophy}</p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">How It Works:</h4>
                    <ul className="space-y-1">
                        {explanation.howItWorks.map((step, idx) => (
                            <li key={idx} className="text-xs text-gray-400 flex items-start">
                                <span className="text-blue-400 mr-2 mt-0.5">•</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-gray-700">
                    <div>
                        <h5 className="text-xs font-semibold text-emerald-300 mb-1">Best For:</h5>
                        <ul className="space-y-0.5">
                            {explanation.bestFor.map((item, idx) => (
                                <li key={idx} className="text-[10px] text-gray-400">• {item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-xs font-semibold text-yellow-300 mb-1">Time:</h5>
                        <p className="text-[10px] text-gray-400">{explanation.timeCommitment}</p>
                    </div>
                    <div>
                        <h5 className="text-xs font-semibold text-red-300 mb-1">Difficulty:</h5>
                        <p className="text-[10px] text-gray-400">{explanation.difficulty}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WeeklyLayoutPreview: React.FC<{ templateId: string }> = ({ templateId }) => {
    const template = TEMPLATE_DETAILS[templateId];
    if (!template) return null;

    return (
        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Weekly Training Schedule</h4>
            <div className="grid grid-cols-4 gap-2 mb-3">
                {template.days.map((day, idx) => (
                    <div key={day.day} className="bg-gray-800/50 rounded p-3 text-center border border-gray-700">
                        <div className="text-[10px] text-emerald-400 font-bold mb-1">DAY {day.day}</div>
                        <div className="text-xs font-mono text-gray-200 mb-2">{day.primary}</div>
                        <div className="text-[9px] text-gray-500 space-y-0.5">
                            <div>{day.supplemental ? '✓ Supplemental' : '✗ No Supp'}</div>
                            <div>{day.assistance ? `${day.assistance.length} Assistance` : 'No Assistance'}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-[10px] text-gray-500 bg-gray-800/30 rounded p-2">
                <strong className="text-gray-400">Training Split:</strong> This is a 4-day upper/lower split with each main lift getting its own dedicated day.
                Rest days can be inserted anywhere based on your schedule.
            </div>
        </div>
    );
};

const RepSchemePreview: React.FC<{ templateId: string; lift: string }> = ({ templateId, lift }) => {
    const liftKey = lift.toLowerCase() as keyof typeof SAMPLE_TMS;
    const week1 = getRepScheme(1, templateId);
    const supplemental = getSupplementalPreview(templateId, liftKey);

    return (
        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">
                Detailed Workout Breakdown - {lift} Day
            </h4>

            {/* Main Work Section */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-semibold text-emerald-300">Main Work - Week 1 Example</h5>
                    <span className="text-[10px] text-gray-500">5/3/1 Core Sets</span>
                </div>

                <div className="bg-gray-800/50 rounded p-3 space-y-2">
                    {week1.sets.map((reps, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg font-mono text-emerald-400 w-8">
                                    {idx + 1}.
                                </span>
                                <span className="font-mono text-gray-200 text-sm">
                                    {reps} × {calcPercentage(liftKey, week1.percents[idx])}lbs
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400">
                                    {week1.percents[idx]}% TM
                                    {idx === week1.sets.length - 1 && week1.amrap ? ' (AMRAP)' : ''}
                                </div>
                                {idx === week1.sets.length - 1 && week1.amrap && (
                                    <div className="text-[10px] text-yellow-400">
                                        Rep out for max!
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-2 text-[10px] text-gray-500 bg-gray-800/30 rounded p-2">
                    <strong>Focus:</strong> {week1.focus}
                </div>
            </div>

            {/* Supplemental Work Section */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-semibold text-blue-300">Supplemental Work</h5>
                    <span className="text-[10px] text-gray-500">{supplemental.scheme}</span>
                </div>

                {supplemental.scheme !== 'None' ? (
                    <div className="bg-gray-800/50 rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-mono text-gray-200 text-sm">
                                {supplemental.scheme} × {supplemental.weight}lbs
                            </span>
                            <span className="text-xs text-gray-400">{supplemental.description}</span>
                        </div>
                        <div className="space-y-1 text-[10px] text-gray-500">
                            <div><strong>Purpose:</strong> {supplemental.purpose}</div>
                            <div><strong>Progression:</strong> {supplemental.progression}</div>
                            <div><strong>Tips:</strong> {supplemental.tips}</div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-800/30 rounded p-3">
                        <div className="text-sm text-gray-400 italic">No supplemental work in this template</div>
                        <div className="text-[10px] text-gray-500 mt-1">{supplemental.purpose}</div>
                    </div>
                )}
            </div>

            {/* Assistance Work Preview */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-semibold text-purple-300">Assistance Work</h5>
                    <span className="text-[10px] text-gray-500">Supporting Exercises</span>
                </div>

                <div className="bg-gray-800/50 rounded p-3">
                    <div className="text-xs text-gray-400 mb-2">
                        {templateId === 'bbb' ? 'Minimal assistance - focus on main + supplemental' :
                            templateId === 'triumvirate' ? '2 exercises targeting weak points' :
                                templateId === 'jackshit' ? 'No assistance work' :
                                    'Template-specific assistance pattern'}
                    </div>
                    <div className="text-[10px] text-gray-500">
                        {templateId === 'bbb' && 'Example: Face pulls 3×15, Planks 3×30s'}
                        {templateId === 'triumvirate' && 'Example: Dips 5×8-12, Barbell rows 5×8-12'}
                        {templateId === 'jackshit' && 'Keep it simple - just the main lifts'}
                        {templateId === 'periodization_bible' && 'Periodized assistance following the main template'}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgressionPreview: React.FC<{ templateId: string }> = ({ templateId }) => {
    const weeks = [1, 2, 3, 4];

    return (
        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">4-Week Cycle Progression</h4>

            <div className="space-y-3">
                {weeks.map(week => {
                    const scheme = getRepScheme(week, templateId);
                    const isDeload = week === 4;

                    return (
                        <div key={week} className="bg-gray-800/50 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`font-bold text-sm ${isDeload ? 'text-green-400' : 'text-gray-200'}`}>
                                    Week {week}
                                </span>
                                <span className="font-mono text-xs text-gray-400">
                                    {scheme.sets.join('/')}{scheme.amrap ? '+' : ''} @ {scheme.percents.join('/')}%
                                </span>
                            </div>
                            <div className="text-[10px] text-gray-500 mb-1">{scheme.description}</div>
                            <div className="text-[10px] text-gray-400">
                                <strong>Focus:</strong> {scheme.focus}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 bg-blue-900/30 border border-blue-700/50 rounded p-3">
                <div className="text-xs font-semibold text-blue-300 mb-1">After the 4-Week Cycle:</div>
                <div className="text-[10px] text-gray-400 space-y-1">
                    <div>• Increase your Training Max by 5lbs (upper body) or 10lbs (lower body)</div>
                    <div>• Start the next cycle with these new Training Maxes</div>
                    <div>• Continue for multiple cycles to build long-term strength</div>
                    <div>• Track your AMRAP sets to monitor progress</div>
                </div>
            </div>
        </div>
    );
};

// New component for detailed view navigation
const DetailedViewSection: React.FC<{
    activeSection: string;
    setActiveSection: (section: string) => void;
    templateId: string;
}> = ({ activeSection, setActiveSection, templateId }) => {
    const sections = [
        { id: 'overview', label: 'Template Overview', icon: '📋' },
        { id: 'workout', label: 'Workout Breakdown', icon: '🏋️' },
        { id: 'progression', label: '4-Week Progression', icon: '📈' },
        { id: 'schedule', label: 'Weekly Schedule', icon: '📅' }
    ];

    const sampleLift = TEMPLATE_DETAILS[templateId]?.days[0]?.primary || 'Press';

    return (
        <div className="space-y-4">
            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2">
                {sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition ${activeSection === section.id
                                ? 'border-blue-500 bg-blue-600/20 text-blue-200'
                                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-blue-400 hover:bg-blue-600/10'
                            }`}
                    >
                        <span>{section.icon}</span>
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Section Content */}
            <div className="min-h-[400px]">
                {activeSection === 'overview' && <TemplateOverview templateId={templateId} />}
                {activeSection === 'workout' && <RepSchemePreview templateId={templateId} lift={sampleLift} />}
                {activeSection === 'progression' && <ProgressionPreview templateId={templateId} />}
                {activeSection === 'schedule' && <WeeklyLayoutPreview templateId={templateId} />}
            </div>
        </div>
    );
};

export const WorkoutPreview: React.FC<WorkoutPreviewProps> = ({ templateId, expanded = false }) => {
    const [showDetailed, setShowDetailed] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState('overview');
    const template = TEMPLATE_DETAILS[templateId];
    const meta = TEMPLATE_META[templateId];

    if (!template || !expanded) {
        return null;
    }

    return (
        <div className="space-y-4 mt-6 border-t border-gray-700 pt-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-gray-200">Template Preview</span>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-blue-600/70 text-white text-[10px] font-medium">
                            {template.days.length}-Day Split
                        </span>
                        <span className="px-2 py-1 rounded bg-purple-600/70 text-white text-[10px] font-medium">
                            Sample TMs: Press 135, Bench 225, Squat 275, Dead 315
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setShowDetailed(!showDetailed)}
                    className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition ${showDetailed
                            ? 'border-red-500 bg-red-600/10 text-red-200 hover:bg-red-600/20'
                            : 'border-emerald-500 bg-emerald-600/10 text-emerald-200 hover:bg-emerald-600/20'
                        }`}
                >
                    {showDetailed ? (
                        <>
                            <span>🔼</span>
                            Hide Detailed Guide
                        </>
                    ) : (
                        <>
                            <span>🔽</span>
                            Show Detailed Guide
                        </>
                    )}
                </button>
            </div>

            {/* Quick Overview - Always Shown */}
            <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Quick Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-blue-400 font-bold mb-1">Training Days</div>
                        <div className="text-gray-300">{template.days.length} days/week</div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-emerald-400 font-bold mb-1">Focus</div>
                        <div className="text-gray-300">{meta?.focus?.[0] || 'Strength'}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-yellow-400 font-bold mb-1">Difficulty</div>
                        <div className="text-gray-300">{meta?.difficulty || 'Moderate'}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-purple-400 font-bold mb-1">Time/Session</div>
                        <div className="text-gray-300">{meta?.time || '45-60 min'}</div>
                    </div>
                </div>
            </div>

            {/* Detailed Information - Shown when expanded */}
            {showDetailed && (
                <DetailedViewSection
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    templateId={templateId}
                />
            )}

            {/* Important Notes/Cautions */}
            {meta?.caution && (
                <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-sm">⚠️</span>
                        <div>
                            <div className="text-sm text-yellow-300 font-medium mb-1">Important Note:</div>
                            <div className="text-xs text-yellow-200">{meta.caution}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutPreview;
