/**
 * Re-usable dashboard card with consistent radius, shadow,
 * and hover translate effect. Works in light & dark themes.
 */
export default function CardWrapper({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5
        transition-all duration-300 bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700 p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}
