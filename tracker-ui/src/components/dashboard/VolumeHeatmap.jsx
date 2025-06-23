import { useWeeklyVolume } from '../../hooks/useWeeklyVolume'
import Skeleton from '../ui/Skeleton'

export default function VolumeHeatmap({ className = '' }) {
  const { data: weeklyVolumeData, isLoading, error } = useWeeklyVolume()
  const getIntensityColor = (mrvPercentage) => {
    if (mrvPercentage < 50) return 'bg-green-500 dark:bg-green-600 text-white border-green-600 dark:border-green-500'
    if (mrvPercentage <= 80) return 'bg-yellow-500 dark:bg-yellow-600 text-gray-900 dark:text-white border-yellow-600 dark:border-yellow-500'
    if (mrvPercentage <= 95) return 'bg-orange-500 dark:bg-orange-600 text-white border-orange-600 dark:border-orange-500'
    return 'bg-red-500 dark:bg-red-600 text-white border-red-600 dark:border-red-500'
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
        </h3>        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Low</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded" title="< 50% MRV"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded" title="50-80% MRV"></div>
            <div className="w-3 h-3 bg-orange-500 rounded" title="80-95% MRV"></div>
            <div className="w-3 h-3 bg-red-500 rounded" title="> 95% MRV"></div>
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
          
          return (            <div
              key={row.muscle}
              className={`
                muscle-group ${colorClass} flex flex-col items-center justify-center
                rounded-lg border-2 text-xs md:text-sm aspect-square cursor-pointer
                hover:scale-105 hover:shadow-lg transition-all duration-200
                font-medium shadow-sm
              `}
              title={`${row.muscle}: ${sets} sets (${Math.round(mrvPercentage)}% of MRV)`}
            >
              <div className="font-bold text-center">{row.muscle}</div>
              <div className="text-xs opacity-90 font-semibold">{sets} sets</div>
              <div className="text-xs opacity-75">{Math.round(mrvPercentage)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
