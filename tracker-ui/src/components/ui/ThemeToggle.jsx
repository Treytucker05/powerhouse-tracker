import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem("ph-theme") === "dark" ||
    (!localStorage.getItem("ph-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("ph-theme", dark ? "dark" : "light");

    const sync = e => {
      if (e.key === "ph-theme") {
        setDark(e.newValue === "dark");
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [dark]);

  return (
    <button
      aria-label="Toggle dark mode"
      className="rounded p-2 border border-slate-300 dark:border-slate-600"
      onClick={() => setDark(d => !d)}
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
