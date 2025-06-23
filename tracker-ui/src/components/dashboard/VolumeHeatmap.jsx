import { useWeeklyVolume } from '../../hooks/useWeeklyVolume'
import Skeleton from '../ui/Skeleton'

export default function VolumeHeatmap({ className = '' }) {
  const { data: weeklyVolumeData, isLoading, error } = useWeeklyVolume()

  const getIntensityColor = (mrvPercentage) => {
    if (mrvPercentage <= 20) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    if (mrvPercentage <= 40) return 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100'
    if (mrvPercentage <= 60) return 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100'
    if (mrvPercentage <= 80) return 'bg-orange-300 dark:bg-orange-700 text-orange-900 dark:text-orange-100'
    return 'bg-red-400 dark:bg-red-600 text-red-900 dark:text-red-100'
  }

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="body-diagram aspect-square grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">Failed to load volume data</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please check your connection and try again
          </p>
        </div>
      </div>
    )
  }
  // Transform data for heatmap display
  const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core']
  const heatmapData = muscleGroups.map(muscle => {
    const weekData = {}
    weeklyVolumeData?.forEach((week, index) => {
      weekData[`week${index + 1}`] = week.volumes[muscle]?.sets || 0
    })
    return { muscle, ...weekData }
  })
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Volume Heatmap
        </h3>
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Low</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded"></div>
            <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded"></div>
            <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
            <div className="w-3 h-3 bg-orange-300 dark:bg-orange-700 rounded"></div>
            <div className="w-3 h-3 bg-red-400 dark:bg-red-600 rounded"></div>
          </div>
          <span>High</span>
        </div>
      </div>

      <div className="body-diagram aspect-square grid grid-cols-3 gap-2">
        {heatmapData.map((row) => {
          const weekData = weeklyVolumeData?.[0]?.volumes[row.muscle] // Current week
          const sets = weekData?.sets || 0
          const mrvPercentage = weekData?.mrvPercentage || 0
          const colorClass = getIntensityColor(mrvPercentage)
          
          return (
            <div
              key={row.muscle}
              className={`
                muscle-group ${colorClass} flex flex-col items-center justify-center
                rounded-lg border border-slate-200 dark:border-slate-700
                text-xs md:text-sm aspect-square cursor-pointer
                hover:scale-105 transition-transform duration-200
              `}
              title={`${row.muscle}: ${sets} sets (${Math.round(mrvPercentage)}% of MRV)`}
            >
              <div className="font-medium">{row.muscle}</div>
              <div className="text-xs opacity-80">{sets} sets</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
