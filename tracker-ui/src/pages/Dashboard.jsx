import React from 'react';
import { useTrainingState } from '../context/trainingStateContext';
import SimpleVolumeChart from '../components/dashboard/SimpleVolumeChart';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';
import MuscleCard from '../components/dashboard/MuscleCard';

const Dashboard = () => {
  const { state } = useTrainingState();

  // Sample data - replace with actual data from context
  const sampleVolumeData = {
    'Chest': 12,
    'Shoulders': 14,
    'Biceps': 8,
    'Triceps': 10,
    'Lats': 16,
    'Mid-Traps': 6,
    'Rear Delts': 8,
    'Abs': 10,
    'Glutes': 12,
    'Quads': 18,
    'Hamstrings': 14,
    'Calves': 8,
    'Forearms': 6,
    mev: {
      'Chest': 8, 'Shoulders': 10, 'Biceps': 6, 'Triceps': 6, 'Lats': 10,
      'Mid-Traps': 4, 'Rear Delts': 6, 'Abs': 6, 'Glutes': 8, 'Quads': 12,
      'Hamstrings': 8, 'Calves': 6, 'Forearms': 4
    },
    mrv: {
      'Chest': 20, 'Shoulders': 22, 'Biceps': 16, 'Triceps': 18, 'Lats': 22,
      'Mid-Traps': 12, 'Rear Delts': 16, 'Abs': 18, 'Glutes': 20, 'Quads': 24,
      'Hamstrings': 20, 'Calves': 16, 'Forearms': 12
    }
  };

  const primaryMuscles = ['Chest', 'Shoulders', 'Lats', 'Quads', 'Hamstrings', 'Glutes'];

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
          PowerHouse Tracker
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#ccc',
          textAlign: 'center',
          fontWeight: '300'
        }}>
          Precision Training Dashboard
        </p>
      </div>

      {/* Training Status Card */}
      <div className="mb-8">
        <TrainingStatusCard 
          currentWeek={3}
          totalWeeks={6}
          fatigueLevel="moderate"
          deloadRecommended={false}
        />
      </div>

      {/* Volume Chart */}
      <div className="mb-8">
        <SimpleVolumeChart data={sampleVolumeData} />
      </div>

      {/* Primary Muscle Cards Grid */}
      <div className="mb-8">
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#dc2626',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Primary Muscle Groups
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {primaryMuscles.map(muscle => (
            <MuscleCard
              key={muscle}
              muscle={muscle}
              currentVolume={sampleVolumeData[muscle]}
              mev={sampleVolumeData.mev[muscle]}
              mrv={sampleVolumeData.mrv[muscle]}
              weeklyChange={Math.floor(Math.random() * 6) - 2}
              lastWorkout={`${Math.floor(Math.random() * 3) + 1} days ago`}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: '1px solid #444',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#dc2626',
          marginBottom: '16px'
        }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <button className="btn-powerhouse">
            Log Workout
          </button>
          <button className="btn-powerhouse">
            Start Deload
          </button>
          <button className="btn-powerhouse">
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
