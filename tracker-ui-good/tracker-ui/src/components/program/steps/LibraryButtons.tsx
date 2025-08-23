import { Link } from "react-router-dom";

const libraryLinks = [
    { name: "Templates", path: "/library/templates" },
    { name: "Assistance", path: "/library/assistance" },
    { name: "Warm-ups", path: "/library/warmups" },
    { name: "Supplemental", path: "/library/supplemental" },
    { name: "Conditioning", path: "/library/conditioning" },
    { name: "Jumps/Throws", path: "/library/jumps-throws" },
    { name: "Special Rules", path: "/library/special-rules" },
];

export function LibraryButtons() {
    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {libraryLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className="px-3 py-2 rounded bg-[#1f2937] hover:bg-[#ef4444] text-white border border-gray-700 transition"
                >
                    {link.name} Library
                </Link>
            ))}
        </div>
    );
}
