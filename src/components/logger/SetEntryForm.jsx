import { useState, useEffect } from 'react'

export default function SetEntryForm({ onSubmit, isLoading, disabled, nextSetNumber }) {
  const [setForm, setSetForm] = useState({
    exercise: '',
    weight: '',
    reps: '',
    rir: '',
    set_number: nextSetNumber || 1
  })

  // Update set number when prop changes
  useEffect(() => {
    setSetForm(prev => ({ ...prev, set_number: nextSetNumber || 1 }))
  }, [nextSetNumber])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const setData = {
      exercise: setForm.exercise,
      weight: parseFloat(setForm.weight) || 0,
      reps: parseInt(setForm.reps) || 0,
      rir: setForm.rir ? parseFloat(setForm.rir) : null,
      set_number: setForm.set_number
    }

    try {
      await onSubmit(setData)
      
      // Reset form except exercise (keep for convenience)
      setSetForm(prev => ({
        ...prev,
        weight: '',
        reps: '',
        rir: '',
        set_number: prev.set_number + 1
      }))
    } catch (error) {
      console.error('Error submitting set:', error)
    }
  }

  const handleReset = () => {
    setSetForm({
      exercise: '',
      weight: '',
      reps: '',
      rir: '',
      set_number: nextSetNumber || 1
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add Set</h3>
        {setForm.exercise && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Form
          </button>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Exercise</label>
        <input
          type="text"
          value={setForm.exercise}
          onChange={(e) => setSetForm(prev => ({ ...prev, exercise: e.target.value }))}
          placeholder="e.g., Bench Press"
          required
          disabled={disabled}
          className="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
          <input
            type="number"
            step="0.5"
            value={setForm.weight}
            onChange={(e) => setSetForm(prev => ({ ...prev, weight: e.target.value }))}
            placeholder="135"
            required
            disabled={disabled}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Reps</label>
          <input
            type="number"
            value={setForm.reps}
            onChange={(e) => setSetForm(prev => ({ ...prev, reps: e.target.value }))}
            placeholder="10"
            required
            disabled={disabled}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">RIR (optional)</label>
          <input
            type="number"
            step="0.5"
            value={setForm.rir}
            onChange={(e) => setSetForm(prev => ({ ...prev, rir: e.target.value }))}
            placeholder="2"
            disabled={disabled}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={disabled || isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding...' : `Add Set #${setForm.set_number}`}
      </button>
    </form>
  )
}
