export default function DashboardCard({ children, className = "" }) {
  const baseClasses = [
    'bg-surface border border-white/10 hover:border-brand',
    'rounded-[1rem] p-6 shadow-insetCard hover:shadow-cardHover',
    'transition hover:-translate-y-1 active:scale-[0.98]',
    className,
  ];

  return (
    <div className={baseClasses.join(' ')}>
      {children}
    </div>
  );
}
