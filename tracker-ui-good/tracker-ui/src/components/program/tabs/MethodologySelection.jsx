import React from "react";
import { Link } from "react-router-dom";

const methodologies = [
    {
        id: "531",
        name: "5/3/1 Training System",
        icon: "💪",
        description: "Auto-build 5/3/1 with BBB presets, validated progressions & assistance templates.",
        route: "/builder/531/v2",
        accent: 'from-red-600/80 via-red-600/60 to-rose-500/50'
    },
    {
        id: "nasm",
        name: "NASM OPT Model",
        icon: "📘",
        description: "Structured OPT builder (stub route for now).",
        route: "/builder/nasm",
        accent: 'from-sky-600/70 via-sky-600/50 to-cyan-500/40'
    },
    {
        id: "rp",
        name: "Renaissance Periodization",
        icon: "📈",
        description: "Template-driven hypertrophy periodization (placeholder).",
        route: "/builder/rp",
        accent: 'from-fuchsia-600/70 via-pink-600/50 to-rose-500/40'
    },
    {
        id: "custom",
        name: "Custom Program Designer",
        icon: "🛠️",
        description: "Assemble your own phases, mesocycles & assistance blocks.",
        route: "/builder/custom",
        accent: 'from-amber-600/70 via-amber-600/50 to-orange-500/40'
    },
    {
        id: "minimalist",
        name: "Minimalist Strength",
        icon: "⚡",
        description: "Low-volume high-efficiency strength track (placeholder).",
        route: "/builder/minimalist",
        accent: 'from-emerald-600/70 via-emerald-600/50 to-teal-500/40'
    }
];

export default function MethodologySelection({ onMethodologySelect, selectedMethodology }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Choose Your Training Methodology</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {methodologies.map((m) => {
                    const content = (
                        <div
                            className={[
                                'relative rounded-xl border p-4 transition overflow-hidden group',
                                'bg-gradient-to-br',
                                m.accent,
                                selectedMethodology?.id === m.id
                                    ? 'border-white/40 shadow-md shadow-black/40'
                                    : 'border-white/10 hover:border-white/30 hover:shadow-sm hover:shadow-black/30'
                            ].join(' ')}
                        >
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_70%)]" />
                            <div className="relative">
                                <div className="text-lg font-medium flex items-center gap-2">
                                    <span>{m.icon}</span>
                                    <span>{m.name}</span>
                                </div>
                                {m.description ? (
                                    <p className="text-sm text-white/80 mt-1 leading-snug">
                                        {m.description}
                                    </p>
                                ) : null}
                                {selectedMethodology?.id === m.id && (
                                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-black/30 border border-white/20 text-white/80">
                                        Selected
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                    // If a callback is provided (embedded usage inside Program.jsx), call it instead of navigating away immediately.
                    if (onMethodologySelect) {
                        return (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => onMethodologySelect(m)}
                                className="text-left"
                            >
                                {content}
                            </button>
                        );
                    }
                    // Standalone routed usage (e.g., /program-design)
                    return (
                        <Link key={m.id} to={m.route} className="block">
                            {content}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

