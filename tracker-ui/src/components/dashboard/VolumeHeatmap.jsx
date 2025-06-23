import { useWeeklyVolume } from '../../hooks/useWeeklyVolume'
import Skeleton from '../ui/Skeleton'

export default function VolumeHeatmap({ className = '' }) {
  const { data: weeklyVolumeData, isLoading, error } = useWeeklyVolume()

  const getIntensityColor = (mrvPercentage) => {
    if (mrvPercentage <= 20) return 'bg-green-100 dark:bg-green-900'
    if (mrvPercentage <= 40) return 'bg-green-200 dark:bg-green-800'
    if (mrvPercentage <= 60) return 'bg-yellow-200 dark:bg-yellow-800'
    if (mrvPercentage <= 80) return 'bg-orange-300 dark:bg-orange-700'
    return 'bg-red-400 dark:bg-red-600'
  }

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-20" />
              <div className="flex space-x-2">
                {Array.from({ length: 4 }, (_, j) => (
                  <Skeleton key={j} className="h-8 w-12" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
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

  const weeks = weeklyVolumeData?.map(week => week.weekLabel) || ['Week 1', 'Week 2', 'Week 3', 'Week 4']

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 pb-3">
                Muscle Group
              </th>
              {weeks.map((week) => (
                <th key={week} className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 pb-3 px-2">
                  {week}
                </th>
              ))}
            </tr>
          </thead>          <tbody className="space-y-2">
            {heatmapData.map((row) => (
              <tr key={row.muscle}>
                <td className="text-sm font-medium text-gray-900 dark:text-white py-2">
                  {row.muscle}
                </td>
                {weeks.map((week, weekIndex) => {
                  const weekData = weeklyVolumeData?.[weekIndex]?.volumes[row.muscle]
                  const sets = weekData?.sets || row[`week${weekIndex + 1}`] || 0
                  const mrvPercentage = weekData?.mrvPercentage || 0
                  
                  return (
                    <td key={week} className="px-2 py-2">
                      <div 
                        className={`w-12 h-8 rounded ${getIntensityColor(mrvPercentage)} flex items-center justify-center text-xs font-medium`}
                        title={`${sets} sets (${mrvPercentage}% MRV)`}
                      >
                        {sets}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
