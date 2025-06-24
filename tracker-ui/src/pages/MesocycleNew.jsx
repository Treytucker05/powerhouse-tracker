import { useState } from "react";
import CardWrapper from "../components/ui/CardWrapper";
import MesocycleBuilder from "../components/dashboard/MesocycleBuilder";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import "../components/dashboard/DashboardLayout.css";

export default function Mesocycle() {
  // All muscles from the volume chart
  const muscleGroups = ['Chest', 'Back', 'Quads', 'Glutes', 'Hamstrings', 'Shoulders', 'Biceps', 'Triceps', 'Calves', 'Abs', 'Forearms', 'Neck', 'Traps'];
  
  const volumeLandmarks = {
    'Chest': { mev: 8, mav: 18, mrv: 22 },
    'Back': { mev: 10, mav: 20, mrv: 25 },
    'Quads': { mev: 10, mav: 20, mrv: 25 },
    'Glutes': { mev: 8, mav: 14, mrv: 16 },
    'Hamstrings': { mev: 8, mav: 12, mrv: 20 },
    'Shoulders': { mev: 6, mav: 10, mrv: 20 },
    'Biceps': { mev: 6, mav: 14, mrv: 16 },
    'Triceps': { mev: 6, mav: 10, mrv: 18 },
    'Calves': { mev: 6, mav: 8, mrv: 16 },
    'Abs': { mev: 4, mav: 6, mrv: 16 },
    'Forearms': { mev: 4, mav: 4, mrv: 12 },
    'Neck': { mev: 2, mav: 3, mrv: 8 },
    'Traps': { mev: 4, mav: 4, mrv: 12 }
  };

  const VolumeSlider = ({ muscle, landmarks }) => {
    const [currentValue, setCurrentValue] = useState(landmarks.mav);
    
    const getSliderColor = (value) => {
      if (value < landmarks.mev) return '#dc2626'; // Red - below MEV
      if (value > landmarks.mrv) return '#dc2626'; // Red - above MRV
      return '#22c55e'; // Green - optimal range
    };

    const getSliderBackground = (value) => {
      // Create yellow-green-red gradient that matches the chart
      return `linear-gradient(to right, 
        #eab308 0%, 
        #22c55e 50%, 
        #dc2626 100%)`;
    };

    const sliderColor = getSliderColor(currentValue);

    return (
      <div style={{
        backgroundColor: '#1f2937',
        border: `2px solid ${sliderColor}`,
        borderRadius: '0.75rem',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
        boxShadow: `0 4px 12px rgba(${sliderColor === '#22c55e' ? '34, 197, 94' : '220, 38, 38'}, 0.3)`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            textTransform: 'uppercase'
          }}>{muscle}</span>
          <span style={{
            color: sliderColor,
            fontSize: '1rem',
            fontWeight: 'bold',
            textShadow: `0 0 8px ${sliderColor}`
          }}>Current: {currentValue} sets</span>
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            type="range" 
            min={landmarks.mev} 
            max={landmarks.mrv} 
            value={currentValue}
            style={{
              width: '100%',
              height: '12px',
              background: getSliderBackground(currentValue),
              borderRadius: '6px',
              appearance: 'none',
              cursor: 'pointer',
              outline: 'none'
            }}
            onChange={(e) => {
              setCurrentValue(parseInt(e.target.value));
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            marginTop: '0.75rem',
            fontWeight: '600'
          }}>
            <span style={{ 
              color: '#eab308', 
              fontWeight: 'bold',
              textShadow: '0 0 4px #eab308'
            }}>MEV: {landmarks.mev}</span>
            <span style={{ 
              color: currentValue >= landmarks.mev && currentValue <= landmarks.mrv ? '#22c55e' : '#dc2626', 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textShadow: `0 0 4px ${currentValue >= landmarks.mev && currentValue <= landmarks.mrv ? '#22c55e' : '#dc2626'}`
            }}>
              {currentValue >= landmarks.mev && currentValue <= landmarks.mrv ? 'OPTIMAL RANGE' : 'OUT OF RANGE'}
            </span>
            <span style={{ 
              color: '#dc2626', 
              fontWeight: 'bold',
              textShadow: '0 0 4px #dc2626'
            }}>MRV: {landmarks.mrv}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2rem',
          backgroundColor: '#000000',
          minHeight: '100vh'
        }}>
          {/* Page Header */}
          <div style={{
            marginBottom: '3rem',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#111827',
            border: '2px solid #dc2626',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              🗓️ MESOCYCLE PLANNING
            </h1>
            <p style={{
              color: '#9ca3af',
              fontSize: '1.25rem',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Plan and configure your training blocks (3-6 weeks) with evidence-based volume progression
            </p>
          </div>

          <div style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: '1fr',
            '@media (min-width: 1024px)': {
              gridTemplateColumns: 'repeat(2, 1fr)'
            }
          }}>
            {/* Volume Landmarks Configuration */}
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#111827',
              border: '2px solid #dc2626',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)'
            }}>
              <div style={{
                borderBottom: '2px solid #dc2626',
                paddingBottom: '1rem',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem'
                }}>
                  Volume Landmarks
                </h2>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '1rem'
                }}>
                  Configure MEV, MAV, and MRV for each muscle group
                </p>
              </div>
              <div style={{
                display: 'grid',
                gap: '1.5rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
              }}>
                {muscleGroups.map(muscle => (
                  <VolumeSlider 
                    key={muscle} 
                    muscle={muscle} 
                    landmarks={volumeLandmarks[muscle]} 
                  />
                ))}
              </div>
            </div>

            {/* Mesocycle Builder */}
            <MesocycleBuilder />

            {/* Phase Overview */}
            <div style={{
              backgroundColor: '#111827',
              border: '2px solid #dc2626',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)'
            }}>
              <div style={{
                borderBottom: '2px solid #dc2626',
                paddingBottom: '1rem',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.5rem'
                }}>
                  Training Phases
                </h2>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '1rem'
                }}>
                  Current mesocycle structure
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  borderLeft: '4px solid #22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <h4 style={{
                    color: '#22c55e',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}>
                    Accumulation Phase
                  </h4>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    lineHeight: '1.4'
                  }}>
                    Weeks 1-3: Volume progression and work capacity building
                  </p>
                </div>
                
                <div style={{
                  backgroundColor: 'rgba(234, 179, 8, 0.1)',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  borderLeft: '4px solid #eab308',
                  border: '1px solid rgba(234, 179, 8, 0.3)'
                }}>
                  <h4 style={{
                    color: '#eab308',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}>
                    Intensification Phase
                  </h4>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    lineHeight: '1.4'
                  }}>
                    Week 4: High intensity training with reduced volume
                  </p>
                </div>
                
                <div style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  borderLeft: '4px solid #dc2626',
                  border: '1px solid rgba(220, 38, 38, 0.3)'
                }}>
                  <h4 style={{
                    color: '#dc2626',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}>
                    Deload Phase
                  </h4>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    lineHeight: '1.4'
                  }}>
                    Week 5: Recovery, adaptation, and preparation for next block
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
