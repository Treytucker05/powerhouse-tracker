import { useState, useEffect } from "react";
import { supabase } from "../lib/api/supabaseClient";
import useActiveSession from "../hooks/useActiveSession";
import useLogSet from "../hooks/useLogSet";
import SetEntryForm from "../components/logger/SetEntryForm";
import SessionSummaryModal from "../components/logger/SessionSummaryModal";

export default function Logger() {
  const { activeSession, finishSession, isFinishingSession } = useActiveSession();
  const { logSet, isLogging } = useLogSet();
  
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [completedSession, setCompletedSession] = useState(null);
  const [sessionSets, setSessionSets] = useState([]);

  // Listen for session completion events
  useEffect(() => {
    const handleSessionCompleted = () => {
      setCompletedSession(activeSession);
      setShowSummaryModal(true);
    };

    window.addEventListener('session:completed', handleSessionCompleted);
    
    return () => {
      window.removeEventListener('session:completed', handleSessionCompleted);
    };
  }, [activeSession]);

  // Fetch session sets for display
  useEffect(() => {
    const fetchSessionSets = async () => {
      if (activeSession?.id) {
        try {
          const { data, error } = await supabase
            .from('sets')
            .select('*')
            .eq('session_id', activeSession.id)
            .order('logged_at', { ascending: true });

          if (!error) {
            setSessionSets(data || []);
          }
        } catch (error) {
          console.error('Error fetching session sets:', error);
        }
      } else {
        setSessionSets([]);
      }
    };

    fetchSessionSets();
  }, [activeSession?.id, isLogging]); // Refetch when new sets are logged

  const handleFinishSession = async () => {
    try {
      const completed = await finishSession();
      setCompletedSession(completed);
      setShowSummaryModal(true);
    } catch (error) {
      alert('Error finishing session: ' + error.message);
    }
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
    setCompletedSession(null);
  };

  return (    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">Workout Logger</h2>
      
      {!activeSession ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800">No Active Session</h3>
            <p className="text-sm text-blue-600 mt-1">
              You need to start a training session from your dashboard or program to begin logging sets.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Session Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-emerald-800">
              Active Session: {activeSession.name || 'Workout Session'}
            </h3>
            <p className="text-sm text-emerald-600">
              Started: {new Date(activeSession.created_at).toLocaleString()}
            </p>
            {activeSession.notes && (
              <p className="text-sm text-emerald-600">Notes: {activeSession.notes}</p>
            )}
            {activeSession.planned_sets && (
              <p className="text-sm text-emerald-600">
                Planned Sets: {activeSession.planned_sets.length}
              </p>
            )}
          </div>

          {/* Set Entry Form */}
          <SetEntryForm
            onSubmit={logSet}
            isLoading={isLogging}
            disabled={isFinishingSession}
            nextSetNumber={sessionSets.length + 1}
          />

          {/* Current Session Sets */}
          {sessionSets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Session Sets</h3>
              <div className="space-y-2">
                {sessionSets.map(set => (
                  <div key={set.id} className="bg-gray-50 border rounded p-3 text-sm">
                    <span className="font-medium">#{set.set_number} {set.exercise}</span>
                    <span className="ml-2 text-gray-600">
                      {set.weight}lbs × {set.reps} reps
                      {set.rir !== null && ` @ ${set.rir} RIR`}
                    </span>
                    <span className="ml-2 text-gray-400 text-xs">
                      {new Date(set.logged_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finish Session */}
          <button
            onClick={handleFinishSession}
            disabled={isFinishingSession || isLogging}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isFinishingSession ? 'Finishing...' : 'Finish Session'}
          </button>
        </div>
      )}

      {/* Session Summary Modal */}
      <SessionSummaryModal
        isOpen={showSummaryModal}
        onClose={handleCloseSummaryModal}
        session={completedSession}
        sets={sessionSets}
      />
    </section>
  );
}
