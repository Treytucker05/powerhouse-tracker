import { useEffect, useState } from 'react'

export default function SessionSummaryModal({ isOpen, onClose, session, sets }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 150) // Allow animation to complete
  }

  const calculateSummary = () => {
    if (!sets || sets.length === 0) {
      return {
        totalSets: 0,
        totalVolume: 0,
        exercises: [],
        duration: 0
      }
    }

    const exerciseMap = new Map()
    let totalVolume = 0

    sets.forEach(set => {
      const volume = set.weight * set.reps
      totalVolume += volume

      if (!exerciseMap.has(set.exercise)) {
        exerciseMap.set(set.exercise, {
          name: set.exercise,
          sets: 0,
          volume: 0,
          topSet: { weight: 0, reps: 0 }
        })
      }

      const exercise = exerciseMap.get(set.exercise)
      exercise.sets++
      exercise.volume += volume

      // Track heaviest set
      if (set.weight > exercise.topSet.weight || 
          (set.weight === exercise.topSet.weight && set.reps > exercise.topSet.reps)) {
        exercise.topSet = { weight: set.weight, reps: set.reps }
      }
    })

    // Calculate duration
    const startTime = session?.created_at ? new Date(session.created_at) : new Date()
    const endTime = session?.completed_at ? new Date(session.completed_at) : new Date()
    const duration = Math.round((endTime - startTime) / (1000 * 60)) // minutes

    return {
      totalSets: sets.length,
      totalVolume,
      exercises: Array.from(exerciseMap.values()),
      duration
    }
  }
  if (!isOpen) return null

  const summary = calculateSummary();
  
  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-150 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              🎉 Session Complete!
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {summary.totalSets}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Total Sets
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {summary.totalVolume.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Total Volume
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {summary.duration}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Minutes
              </div>
            </div>
          </div>

          {/* Exercise Breakdown */}
          {summary.exercises.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Exercise Breakdown
              </h3>
              <div className="space-y-2">
                {summary.exercises.map((exercise, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {exercise.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {exercise.sets} sets • {exercise.volume.toLocaleString()} lbs total
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Top Set
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {exercise.topSet.weight}lbs × {exercise.topSet.reps}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Continue to Dashboard
            </button>
            <button
              onClick={() => {
                // TODO: Implement session sharing/export
                console.log('Share session:', session)
              }}
              className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
