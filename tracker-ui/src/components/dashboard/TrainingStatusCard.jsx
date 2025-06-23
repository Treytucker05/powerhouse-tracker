import React from 'react';

const TrainingStatusCard = () => {
  return (
    <div style={{
      backgroundColor: '#111827',
      border: '1px solid #dc2626',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      textAlign: 'center'
    }}>
      <h2 className="text-xl font-bold text-white mb-4">Current Training Status</h2>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#dc2626' }}>1</div>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>WEEK</div>
        </div>
        <div>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#dc2626' }}>4</div>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>MESO LENGTH</div>
        </div>
        <div>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#dc2626' }}>1</div>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>BLOCK</div>
        </div>
        <div>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#dc2626' }}>3</div>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>TARGET RIR</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#eab308' }}>Accumulation</div>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>PHASE</div>
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626' }}>2600%</div>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>SYSTEM FATIGUE</div>
        </div>
      </div>
      <div style={{
        marginTop: '1rem',
        backgroundColor: '#dc2626',
        color: '#ffffff',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        fontWeight: 'bold'
      }}>
        Deload strongly recommended!
      </div>
    </div>
  );
};

export default TrainingStatusCard;
