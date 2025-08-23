import React from "react";

type Props = {
    health: { seventhWeek: boolean; tmRules: boolean; jokerRules: boolean } | null;
    className?: string;
};

export default function DataStatusBanner({ health, className = "" }: Props) {
    if (!health) return null;
    const missing: string[] = [];
    if (!health.seventhWeek) missing.push("seventh_week.csv");
    if (!health.tmRules) missing.push("tm_rules.csv");
    if (!health.jokerRules) missing.push("joker_rules.csv");
    if (missing.length === 0) return null;

    return (
        <div className={`mt-3 p-3 rounded border border-yellow-700 bg-[#2b2410] text-yellow-200 text-sm ${className}`}>
            Missing CSV data: {missing.join(", ")}. Ensure these exist in data/extraction so copy:csv can publish to public/methodology/extraction/.
        </div>
    );
}
