import React from "react";
import { Link } from "react-router-dom";

const methodologies = [
    {
        id: "531",
        title: "5/3/1 Training System",
        description: "Auto-build 5/3/1 with BBB presets and verified progressions.",
        route: "/builder/531/v2",
    },
    {
        id: "nasm",
        title: "NASM OPT Model",
        description: "Structured OPT builder (stub route for now).",
        route: "/builder/nasm",
    },
];

export default function MethodologySelection() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Choose Your Training Methodology</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {methodologies.map((m) => (
                    <Link key={m.id} to={m.route} className="block">
                        <div className="rounded-2xl border p-4 hover:shadow transition">
                            <div className="text-lg font-medium">{m.title}</div>
                            {m.description ? (
                                <p className="text-sm opacity-80 mt-1">{m.description}</p>
                            ) : null}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

