export default function AIInsightBar({ insight }) {
  if (!insight) return null;
  return (
    <footer className="sticky bottom-0 bg-surface border-t border-white/10
                       py-3 text-center text-sm text-gray-100 z-40">
      💡 {insight}
    </footer>
  );
}
