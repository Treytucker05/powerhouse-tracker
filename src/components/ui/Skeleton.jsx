export default function Skeleton({ className = "", lines = 1 }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`bg-gray-200 dark:bg-gray-700 rounded ${
            i === lines - 1 ? 'mb-0' : 'mb-2'
          } ${lines === 1 ? 'h-4' : 'h-3'}`}
        />
      ))}
    </div>
  )
}
