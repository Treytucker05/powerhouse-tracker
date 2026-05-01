import { useState } from "react";
import useActiveSession from "../lib/useActiveSession";
import useSessionSets from "../lib/useSessionSets";

export default function Logger() {
  const { activeSession, loading, startSession, finishSession, addSet } = useActiveSession();
  const sets = useSessionSets(activeSession?.id);
  
  const [sessionNotes, setSessionNotes] = useState('');
  const [setForm, setSetForm] = useState({
    exercise: '',
    weight: '',
    reps: '',
    rir: '',
    set_number: 1
  });

  const handleStartSession = async () => {
    try {
      await startSession(sessionNotes);
      setSessionNotes('');
    } catch (error) {
      alert('Error starting session: ' + error.message);
    }
  };

  const handleFinishSession = async () => {
    try {
      await finishSession();
      setSetForm({ exercise: '', weight: '', reps: '', rir: '', set_number: 1 });
    } catch (error) {
      alert('Error finishing session: ' + error.message);
    }
  };

  const handleAddSet = async (e) => {
    e.preventDefault();
    try {
      await addSet({
        exercise: setForm.exercise,
        weight: parseFloat(setForm.weight) || 0,
        reps: parseInt(setForm.reps) || 0,
        rir: parseFloat(setForm.rir) || null,
        set_number: sets.length + 1
      });
      
      // Reset form except exercise (keep for convenience)
      setSetForm(prev => ({
        ...prev,
        weight: '',
        reps: '',
        rir: '',
        set_number: sets.length + 2
      }));
    } catch (error) {
      alert('Error adding set: ' + error.message);
    }
  };

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">Workout Logger</h2>
      
      {!activeSession ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Start New Session</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Session Notes (optional)</label>
            <input
              type="text"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="e.g., Push workout, feeling strong"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleStartSession}
            disabled={loading}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Session'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Session Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-emerald-800">Active Session</h3>
            <p className="text-sm text-emerald-600">
              Started: {new Date(activeSession.start_time).toLocaleString()}
            </p>
            {activeSession.notes && (
              <p className="text-sm text-emerald-600">Notes: {activeSession.notes}</p>
            )}
          </div>

          {/* Add Set Form */}
          <form onSubmit={handleAddSet} className="space-y-4">
            <h3 className="text-lg font-semibold">Add Set</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Exercise</label>
              <input
                type="text"
                value={setForm.exercise}
                onChange={(e) => setSetForm(prev => ({ ...prev, exercise: e.target.value }))}
                placeholder="e.g., Bench Press"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Weight</label>
                <input
                  type="number"
                  step="0.5"
                  value={setForm.weight}
                  onChange={(e) => setSetForm(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="135"
                  required
                  className="w-full border rounded px-3 py-2"
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
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">RIR</label>
                <input
                  type="number"
                  step="0.5"
                  value={setForm.rir}
                  onChange={(e) => setSetForm(prev => ({ ...prev, rir: e.target.value }))}
                  placeholder="2"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Set #{setForm.set_number}
            </button>
          </form>

          {/* Current Session Sets */}
          {sets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Session Sets</h3>
              <div className="space-y-2">
                {sets.map(set => (
                  <div key={set.id} className="bg-gray-50 border rounded p-3 text-sm">
                    <span className="font-medium">#{set.set_number} {set.exercise}</span>
                    <span className="ml-2 text-gray-600">
                      {set.weight}lbs × {set.reps} reps
                      {set.rir !== null && ` @ ${set.rir} RIR`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finish Session */}
          <button
            onClick={handleFinishSession}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Finishing...' : 'Finish Session'}
          </button>
        </div>
      )}
    </section>
  );
}
