import React, { useState } from 'react';

const Workouts = () => {
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const muscleGroups = [
    'Chest', 'Shoulders', 'Biceps', 'Triceps', 'Lats', 'Mid-Traps',
    'Rear Delts', 'Abs', 'Glutes', 'Quads', 'Hamstrings', 'Calves', 'Forearms'
  ];

  const recentWorkouts = [
    { date: '2024-01-15', muscle: 'Chest', sets: 12, duration: '45 min' },
    { date: '2024-01-13', muscle: 'Legs', sets: 16, duration: '60 min' },
    { date: '2024-01-11', muscle: 'Back', sets: 14, duration: '50 min' },
  ];

  const handleLogSet = () => {
    if (selectedMuscle && sets && reps && weight) {
      // Log the set (implement actual logging logic)
      console.log('Logging set:', { selectedMuscle, sets, reps, weight });
      // Reset form
      setSets('');
      setReps('');
      setWeight('');
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ 
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div className="mb-8">
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#dc2626',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          marginBottom: '8px'
        }}>
          Workout Tracking
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#ccc',
          textAlign: 'center',
          fontWeight: '300'
        }}>
          Log your training sets and track progress
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {/* Set Logger */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '2px solid #dc2626',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#dc2626',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Log New Set
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                color: 'white', 
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                Muscle Group
              </label>
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #444',
                  backgroundColor: '#2d2d2d',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select muscle group</option>
                {muscleGroups.map(muscle => (
                  <option key={muscle} value={muscle}>{muscle}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}>
                  Sets
                </label>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #444',
                    backgroundColor: '#2d2d2d',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}>
                  Reps
                </label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="10"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #444',
                    backgroundColor: '#2d2d2d',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}>
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="135"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #444',
                    backgroundColor: '#2d2d2d',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleLogSet}
              className="btn-powerhouse"
              style={{ marginTop: '16px' }}
            >
              Log Set
            </button>
          </div>
        </div>

        {/* Recent Workouts */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '1px solid #444',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#dc2626',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Recent Workouts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentWorkouts.map((workout, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid #333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    {workout.muscle}
                  </div>
                  <div style={{
                    color: '#ccc',
                    fontSize: '0.9rem'
                  }}>
                    {workout.date}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    color: '#dc2626',
                    fontWeight: 'bold'
                  }}>
                    {workout.sets} sets
                  </div>
                  <div style={{
                    color: '#ccc',
                    fontSize: '0.9rem'
                  }}>
                    {workout.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-powerhouse"
            style={{ width: '100%', marginTop: '16px' }}
          >
            View All Workouts
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        marginTop: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '1px solid #16a34a',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#16a34a', fontSize: '2rem', fontWeight: 'bold' }}>
            142
          </div>
          <div style={{ color: 'white', fontSize: '1rem' }}>
            Total Sets This Week
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '1px solid #fbbf24',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#fbbf24', fontSize: '2rem', fontWeight: 'bold' }}>
            5
          </div>
          <div style={{ color: 'white', fontSize: '1rem' }}>
            Workouts This Week
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '1px solid #dc2626',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#dc2626', fontSize: '2rem', fontWeight: 'bold' }}>
            3:45
          </div>
          <div style={{ color: 'white', fontSize: '1rem' }}>
            Avg Workout Time
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
