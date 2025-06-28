import React, { useEffect, useRef } from 'react';

const VintageFatigueGauge = ({ value = 0, label = "Fatigue Level" }) => {
  const needleRef = useRef(null);
  const valueRef = useRef(null);

  // Function to set fatigue level
  const setFatigueLevel = (fatigueValue) => {
    const angle = -90 + (fatigueValue * 1.8);
    const needle = needleRef.current;
    const valueDisplay = valueRef.current;
    
    if (needle) needle.style.transform = `rotate(${angle}deg)`;
    if (valueDisplay) valueDisplay.textContent = `${fatigueValue}%`;
  };

  useEffect(() => {
    // Animate to the current value
    const timer = setTimeout(() => {
      setFatigueLevel(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="gauge-container">
      <div className="gauge-wrapper">
        <div className="gauge-bezel"></div>
        <div className="gauge-inner-bezel"></div>
        <div className="gauge-face"></div>
        
        <svg className="fatigue-gauge" viewBox="0 0 268 148">
          <path className="zone-green" d="M 20 128 A 114 114 0 0 1 74.4 41.6" />
          <path className="zone-yellow" d="M 74.4 41.6 A 114 114 0 0 1 193.6 41.6" />
          <path className="zone-red" d="M 193.6 41.6 A 114 114 0 0 1 248 128" />
          
          <g className="ticks">
            <line className="tick-major" x1="30" y1="128" x2="40" y2="128" />
            <text className="scale-number" x="15" y="135">0</text>
            <line className="tick-major" x1="53.7" y1="76.8" x2="61.4" y2="82.4" />
            <text className="scale-number" x="42" y="68">25</text>
            <line className="tick-major" x1="134" y1="34" x2="134" y2="44" />
            <text className="scale-number" x="134" y="25">50</text>
            <line className="tick-major" x1="214.3" y1="76.8" x2="206.6" y2="82.4" />
            <text className="scale-number" x="226" y="68">75</text>
            <line className="tick-major" x1="238" y1="128" x2="228" y2="128" />
            <text className="scale-number" x="253" y="135">100</text>
          </g>
          
          <g className="minor-ticks">
            <line className="tick-minor" x1="40.2" y1="106.8" x2="46.2" y2="111.2" />
            <line className="tick-minor" x1="66.8" y1="60.4" x2="73.8" y2="66.4" />
            <line className="tick-minor" x1="194.2" y1="60.4" x2="187.2" y2="66.4" />
            <line className="tick-minor" x1="220.8" y1="106.8" x2="214.8" y2="111.2" />
          </g>
          
          <polygon 
            className="needle" 
            ref={needleRef}
            points="134,134 137,131 134,44 131,131" 
          />
          <circle className="pivot" cx="134" cy="134" r="8" />
          <circle className="pivot-center" cx="134" cy="134" r="4" />
        </svg>
        
        <div className="gauge-glass"></div>
      </div>
      
      <div className="gauge-label">{label}</div>
      <div className="gauge-value" ref={valueRef}>{Math.round(value)}%</div>

      <style jsx>{`
        .gauge-container { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          padding: 20px; 
        }
        .gauge-wrapper { 
          position: relative; 
          width: 300px; 
          height: 180px; 
          margin-bottom: 15px; 
        }
        .gauge-bezel { 
          position: absolute; 
          width: 100%; 
          height: 100%; 
          background: linear-gradient(135deg, #CD7F32 0%, #8B4513 30%, #CD7F32 70%, #A0522D 100%); 
          border-radius: 150px 150px 0 0; 
          box-shadow: inset 0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.4); 
          border: 2px solid #8B4513; 
          z-index: 1; 
        }
        .gauge-inner-bezel { 
          position: absolute; 
          top: 6px; 
          left: 6px; 
          right: 6px; 
          height: calc(100% - 6px); 
          background: linear-gradient(135deg, #A0522D 0%, #CD7F32 50%, #8B4513 100%); 
          border-radius: 144px 144px 0 0; 
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); 
          z-index: 2; 
        }
        .gauge-face { 
          position: absolute; 
          top: 12px; 
          left: 12px; 
          right: 12px; 
          height: calc(100% - 12px); 
          background: linear-gradient(135deg, #F5F5DC 0%, #FFFACD 50%, #F0E68C 100%); 
          border-radius: 138px 138px 0 0; 
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); 
          z-index: 3; 
        }
        .gauge-glass { 
          position: absolute; 
          top: 12px; 
          left: 12px; 
          right: 12px; 
          height: calc(100% - 12px); 
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%); 
          border-radius: 138px 138px 0 0; 
          pointer-events: none; 
          z-index: 10; 
        }
        .fatigue-gauge { 
          position: absolute; 
          top: 12px; 
          left: 12px; 
          width: 276px; 
          height: 156px; 
          z-index: 5; 
        }
        .zone-green { 
          fill: none; 
          stroke: rgba(34, 197, 94, 0.6); 
          stroke-width: 8; 
          stroke-linecap: round; 
        }
        .zone-yellow { 
          fill: none; 
          stroke: rgba(245, 158, 11, 0.6); 
          stroke-width: 8; 
          stroke-linecap: round; 
        }
        .zone-red { 
          fill: none; 
          stroke: rgba(239, 68, 68, 0.6); 
          stroke-width: 8; 
          stroke-linecap: round; 
        }
        .tick-major { 
          stroke: #8B4513; 
          stroke-width: 1.5; 
        }
        .tick-minor { 
          stroke: #8B4513; 
          stroke-width: 1; 
        }
        .scale-number { 
          font-family: serif; 
          font-size: 16px; 
          font-weight: bold; 
          text-anchor: middle; 
          fill: #8B4513; 
        }
        .needle { 
          fill: #8B0000; 
          stroke: #654321; 
          stroke-width: 0.5; 
          transform-origin: 134px 134px; 
          transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .pivot { 
          fill: #8B4513; 
          stroke: #654321; 
          stroke-width: 1; 
        }
        .pivot-center { 
          fill: #CD7F32; 
        }
        .gauge-label { 
          color: #8B4513; 
          font-size: 14px; 
          margin-bottom: 5px; 
          font-family: serif; 
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        .gauge-value { 
          color: #DC2626; 
          font-size: 18px; 
          font-weight: bold; 
          font-family: serif; 
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default VintageFatigueGauge;