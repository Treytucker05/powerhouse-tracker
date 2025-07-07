import { useState } from 'react';
import { useTrainingState } from '../../context/TrainingStateContext.jsx';

export default function MesocycleBuilder() {
  const { state, setupMesocycle } = useTrainingState();
  const [mesocycleConfig, setMesocycleConfig] = useState({
    weeks: 4,
    focus: 'volume',
    phase: 'accumulation',
    ...state.currentMesocycle
  });

  const handleConfigChange = (field, value) => {
    setMesocycleConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveMesocycle = () => {
    setupMesocycle(mesocycleConfig);
  };

  const focusOptions = [
    { value: 'volume', label: 'Volume Focus', desc: 'Emphasize set count and time under tension', color: '#22c55e' },
    { value: 'intensity', label: 'Intensity Focus', desc: 'Emphasize load progression and strength', color: '#dc2626' },
    { value: 'metabolite', label: 'Metabolite Focus', desc: 'Emphasize pump and metabolic stress', color: '#eab308' }
  ];

  const phaseOptions = [
    { value: 'accumulation', label: 'Accumulation', desc: 'Build work capacity and volume tolerance', color: '#22c55e' },
    { value: 'intensification', label: 'Intensification', desc: 'Peak strength and neural adaptations', color: '#eab308' },
    { value: 'realization', label: 'Realization', desc: 'Test and demonstrate gains', color: '#dc2626' }
  ];

  return (
    <div style={{
      backgroundColor: '#111827',
      border: '2px solid #dc2626',
      borderRadius: '0.75rem',
      padding: '2rem',
      boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        borderBottom: '2px solid #dc2626',
        paddingBottom: '1rem'
      }}>
        <h3 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Mesocycle Planning
        </h3>
        <span style={{
          backgroundColor: '#dc2626',
          color: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          Block {state.currentMesocycle?.block || 1}
        </span>
      </div>

      {/* Current Mesocycle Overview */}
      {state.currentMesocycle?.weeks && (
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '2px solid rgba(220, 38, 38, 0.3)',
          borderRadius: '0.75rem'
        }}>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '0.5rem'
          }}>
            Current Block: {state.currentMesocycle.weeks} weeks • {state.currentMesocycle.focus} focus
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#dc2626',
            fontWeight: '600'
          }}>
            Phase: {state.currentMesocycle.phase} • Week {state.currentMesocycle.currentWeek || 1} of {state.currentMesocycle.weeks}
          </div>
        </div>
      )}

      {/* Configuration */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Duration */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Block Duration
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}>
            {[3, 4, 5, 6].map(weeks => (
              <button
                key={weeks}
                onClick={() => handleConfigChange('weeks', weeks)}
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '2px solid',
                  borderColor: mesocycleConfig.weeks === weeks ? '#dc2626' : '#374151',
                  backgroundColor: mesocycleConfig.weeks === weeks ? '#dc2626' : '#1f2937',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: mesocycleConfig.weeks === weeks ? '0 4px 12px rgba(220, 38, 38, 0.4)' : 'none'
                }}
              >
                {weeks} weeks
              </button>
            ))}
          </div>
        </div>

        {/* Focus */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Training Focus
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {focusOptions.map(option => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  cursor: 'pointer',
                  padding: '1.5rem',
                  backgroundColor: mesocycleConfig.focus === option.value ? 'rgba(220, 38, 38, 0.2)' : '#1f2937',
                  border: '2px solid',
                  borderColor: mesocycleConfig.focus === option.value ? option.color : '#374151',
                  borderRadius: '0.75rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="radio"
                  name="focus"
                  value={option.value}
                  checked={mesocycleConfig.focus === option.value}
                  onChange={(e) => handleConfigChange('focus', e.target.value)}
                  style={{
                    marginTop: '0.25rem',
                    accentColor: option.color
                  }}
                />
                <div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: mesocycleConfig.focus === option.value ? option.color : '#ffffff',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}>
                    {option.label}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    lineHeight: '1.4'
                  }}>
                    {option.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Phase */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Training Phase
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {phaseOptions.map(option => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  cursor: 'pointer',
                  padding: '1.5rem',
                  backgroundColor: mesocycleConfig.phase === option.value ? 'rgba(220, 38, 38, 0.2)' : '#1f2937',
                  border: '2px solid',
                  borderColor: mesocycleConfig.phase === option.value ? option.color : '#374151',
                  borderRadius: '0.75rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="radio"
                  name="phase"
                  value={option.value}
                  checked={mesocycleConfig.phase === option.value}
                  onChange={(e) => handleConfigChange('phase', e.target.value)}
                  style={{
                    marginTop: '0.25rem',
                    accentColor: option.color
                  }}
                />
                <div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: mesocycleConfig.phase === option.value ? option.color : '#ffffff',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}>
                    {option.label}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    lineHeight: '1.4'
                  }}>
                    {option.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveMesocycle}
          style={{
            width: '100%',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#b91c1c';
            e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
          }}
        >
          🚀 Start New Mesocycle
        </button>
      </div>
    </div>
  );
}
