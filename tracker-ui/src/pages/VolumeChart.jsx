import React from 'react';
import { useTrainingState } from '../context/trainingStateContext';
import SimpleVolumeChart from '../components/dashboard/SimpleVolumeChart';

const VolumeChart = () => {
  const { state } = useTrainingState();

  // Sample data with more detailed weekly progression
  const weeklyVolumeData = {
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
          Microcycle Analysis
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#ccc',
          textAlign: 'center',
          fontWeight: '300'
        }}>
          Weekly Volume Distribution & Recovery Status
        </p>
      </div>

      {/* Main Volume Chart */}
      <div className="mb-8">
        <SimpleVolumeChart data={weeklyVolumeData} />
      </div>

      {/* Volume Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '2px solid #16a34a',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#16a34a', fontSize: '1.2rem', marginBottom: '8px' }}>
            Optimal Volume
          </h3>
          <div style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
            8
          </div>
          <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
            muscle groups
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '2px solid #fbbf24',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#fbbf24', fontSize: '1.2rem', marginBottom: '8px' }}>
            Total Volume
          </h3>
          <div style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
            142
          </div>
          <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
            weekly sets
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '2px solid #dc2626',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#dc2626', fontSize: '1.2rem', marginBottom: '8px' }}>
            Recovery Status
          </h3>
          <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Moderate
          </div>
          <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
            fatigue level
          </div>
        </div>
      </div>

      {/* Volume Guidelines */}
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
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Volume Guidelines
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ padding: '16px', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '8px', border: '1px solid #dc2626' }}>
            <h4 style={{ color: '#dc2626', marginBottom: '8px' }}>Sub-Recovery Volume</h4>
            <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
              Below MEV - Consider increasing volume or frequency to stimulate adaptation
            </p>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: 'rgba(22, 163, 74, 0.1)', borderRadius: '8px', border: '1px solid #16a34a' }}>
            <h4 style={{ color: '#16a34a', marginBottom: '8px' }}>Optimal Volume</h4>
            <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
              Between MEV and MRV - Ideal range for sustainable progress
            </p>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', border: '1px solid #fbbf24' }}>
            <h4 style={{ color: '#fbbf24', marginBottom: '8px' }}>MEV (Minimum Effective Volume)</h4>
            <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
              Threshold for muscle growth stimulation
            </p>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '8px', border: '1px solid #dc2626' }}>
            <h4 style={{ color: '#dc2626', marginBottom: '8px' }}>MRV (Maximum Recoverable Volume)</h4>
            <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
              Upper limit before recovery becomes compromised
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeChart;
