import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    units: 'lbs',
    restTimer: 120,
    autoProgression: true,
    deloadThreshold: 85
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
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
          Macrocycle Settings
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#ccc',
          textAlign: 'center',
          fontWeight: '300'
        }}>
          Configure your long-term training parameters
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* General Settings */}
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
            General Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Units */}
            <div>
              <label style={{
                display: 'block',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Weight Units
              </label>
              <select
                value={settings.units}
                onChange={(e) => handleSettingChange('units', e.target.value)}
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
                <option value="lbs">Pounds (lbs)</option>
                <option value="kg">Kilograms (kg)</option>
              </select>
            </div>

            {/* Rest Timer */}
            <div>
              <label style={{
                display: 'block',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Default Rest Timer (seconds)
              </label>
              <input
                type="number"
                value={settings.restTimer}
                onChange={(e) => handleSettingChange('restTimer', parseInt(e.target.value))}
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

            {/* Auto Progression */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              border: '1px solid #444'
            }}>
              <div>
                <div style={{
                  color: 'white',
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>
                  Auto Progression
                </div>
                <div style={{
                  color: '#ccc',
                  fontSize: '0.9rem'
                }}>
                  Automatically increase volume when targets are met
                </div>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '60px',
                height: '34px'
              }}>
                <input
                  type="checkbox"
                  checked={settings.autoProgression}
                  onChange={(e) => handleSettingChange('autoProgression', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings.autoProgression ? '#dc2626' : '#ccc',
                  transition: '0.4s',
                  borderRadius: '34px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '26px',
                    width: '26px',
                    left: settings.autoProgression ? '30px' : '4px',
                    bottom: '4px',
                    backgroundColor: 'white',
                    transition: '0.4s',
                    borderRadius: '50%'
                  }} />
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Volume Settings */}
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
            Volume Management
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Deload Threshold */}
            <div>
              <label style={{
                display: 'block',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                Deload Threshold (% of MRV)
              </label>
              <input
                type="range"
                min="70"
                max="95"
                value={settings.deloadThreshold}
                onChange={(e) => handleSettingChange('deloadThreshold', parseInt(e.target.value))}
                className="volume-slider"
                style={{ marginBottom: '8px' }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#ccc',
                fontSize: '0.9rem'
              }}>
                <span>70%</span>
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                  {settings.deloadThreshold}%
                </span>
                <span>95%</span>
              </div>
            </div>

            {/* Volume Progression Rate */}
            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              border: '1px solid #444'
            }}>
              <h4 style={{
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '12px'
              }}>
                Volume Progression Rate
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#ccc'
                }}>
                  <span>Weekly increase:</span>
                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>5-10%</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#ccc'
                }}>
                  <span>Mesocycle length:</span>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>4-6 weeks</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#ccc'
                }}>
                  <span>Deload duration:</span>
                  <span style={{ color: '#dc2626', fontWeight: 'bold' }}>1 week</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
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
            Data Management
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button className="btn-powerhouse">
              Export Training Data
            </button>
            <button
              className="btn-powerhouse"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
              }}
            >
              Backup to Cloud
            </button>
            <button
              className="btn-powerhouse"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#000'
              }}
            >
              Import Data
            </button>
            <button
              className="btn-powerhouse"
              style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
              }}
            >
              Reset All Data
            </button>
          </div>
        </div>

        {/* App Information */}
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
            App Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #333'
            }}>
              <span style={{ color: '#ccc' }}>Version:</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>2.1.0</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #333'
            }}>
              <span style={{ color: '#ccc' }}>Last Updated:</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>Jan 15, 2024</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0'
            }}>
              <span style={{ color: '#ccc' }}>Developer:</span>
              <span style={{ color: '#dc2626', fontWeight: 'bold' }}>PowerHouse Labs</span>
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button className="btn-powerhouse">
              Check for Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
