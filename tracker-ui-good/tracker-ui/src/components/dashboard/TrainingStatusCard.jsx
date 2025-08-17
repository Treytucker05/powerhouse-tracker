import React from 'react';

const TrainingStatusCard = () => {
  return (
    <div style={{
      backgroundColor: '#111827',
      border: '2px solid #dc2626',
      borderRadius: '0.75rem',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)'
    }}>
      {/* Header */}
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '1.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        borderBottom: '2px solid #dc2626',
        paddingBottom: '0.5rem'
      }}>
        Current Training Status
      </h2>
      
      {/* Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#dc2626',
            lineHeight: '1',
            marginBottom: '0.5rem'
          }}>1</div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>WEEK</div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#dc2626',
            lineHeight: '1',
            marginBottom: '0.5rem'
          }}>4</div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>MESO LENGTH</div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#dc2626',
            lineHeight: '1',
            marginBottom: '0.5rem'
          }}>1</div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>BLOCK</div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#dc2626',
            lineHeight: '1',
            marginBottom: '0.5rem'
          }}>3</div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>TARGET RIR</div>
        </div>
      </div>
      
      {/* Phase and Fatigue Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'rgba(234, 179, 8, 0.15)',
          border: '2px solid rgba(234, 179, 8, 0.4)',
          borderRadius: '0.75rem',
          padding: '1.5rem'
        }}>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            color: '#eab308',
            marginBottom: '0.5rem',
            textTransform: 'uppercase'
          }}>Accumulation</div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>PHASE</div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          border: '2px solid rgba(220, 38, 38, 0.6)',
          borderRadius: '0.75rem',
          padding: '1.5rem'
        }}>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            color: '#ff4444',
            marginBottom: '0.5rem'
          }}>2600%</div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>SYSTEM FATIGUE</div>
        </div>
      </div>
      
      {/* Deload Recommendation */}
      <div style={{
        backgroundColor: '#dc2626',
        color: '#ffffff',
        padding: '1rem 2rem',
        borderRadius: '0.75rem',
        fontWeight: 'bold',
        fontSize: '1.125rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)',
        border: '2px solid #ff0000',
        animation: 'pulse 2s infinite'
      }}>
        ⚠️ DELOAD STRONGLY RECOMMENDED! ⚠️
      </div>
    </div>
  );
};

export default TrainingStatusCard;
