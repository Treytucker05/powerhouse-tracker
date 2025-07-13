import React, { useEffect, useState } from 'react';

const VintageAnalogGauge = ({ value = 0, label = "Fatigue Level", size = 200 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Animate the needle to the current value
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  // Calculate needle angle for semicircle (180 degrees span)
  // 0% = -90° (left), 50% = 0° (up), 100% = +90° (right)
  const needleAngle = -90 + (animatedValue / 100) * 180;

  // Generate tick marks and labels for semicircle
  const generateTicks = () => {
    const ticks = [];
    for (let i = 0; i <= 100; i += 10) {
      // Map 0-100% to -90° to +90° (semicircle)
      const angle = -90 + (i / 100) * 180;
      const isMainTick = i % 20 === 0;
      const tickLength = isMainTick ? 20 : 12;
      const radius = size / 2 - 35;
      
      const x1 = size / 2 + (radius - tickLength) * Math.cos(angle * Math.PI / 180);
      const y1 = size / 2 + (radius - tickLength) * Math.sin(angle * Math.PI / 180);
      const x2 = size / 2 + radius * Math.cos(angle * Math.PI / 180);
      const y2 = size / 2 + radius * Math.sin(angle * Math.PI / 180);

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#6B4423"
          strokeWidth={isMainTick ? 3 : 1.5}
          strokeLinecap="round"
        />
      );

      // Add numbers for main ticks
      if (isMainTick) {
        const textRadius = radius - 35;
        const textX = size / 2 + textRadius * Math.cos(angle * Math.PI / 180);
        const textY = size / 2 + textRadius * Math.sin(angle * Math.PI / 180);
        
        ticks.push(
          <text
            key={`label-${i}`}
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#5D3A1A"
            fontSize="16"
            fontFamily="serif"
            fontWeight="bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            {i}
          </text>
        );
      }
    }
    return ticks;
  };

  // Generate color zones for semicircle
  const generateColorZones = () => {
    const zones = [
      { start: 0, end: 30, color: '#22C55E' },
      { start: 30, end: 70, color: '#F59E0B' },
      { start: 70, end: 100, color: '#EF4444' }
    ];

    return zones.map((zone, index) => {
      const startAngle = -90 + (zone.start / 100) * 180;
      const endAngle = -90 + (zone.end / 100) * 180;
      const outerRadius = size / 2 - 45;
      const innerRadius = size / 2 - 65;
      
      const startAngleRad = startAngle * Math.PI / 180;
      const endAngleRad = endAngle * Math.PI / 180;
      
      const x1 = size / 2 + outerRadius * Math.cos(startAngleRad);
      const y1 = size / 2 + outerRadius * Math.sin(startAngleRad);
      const x2 = size / 2 + outerRadius * Math.cos(endAngleRad);
      const y2 = size / 2 + outerRadius * Math.sin(endAngleRad);
      
      const x3 = size / 2 + innerRadius * Math.cos(endAngleRad);
      const y3 = size / 2 + innerRadius * Math.sin(endAngleRad);
      const x4 = size / 2 + innerRadius * Math.cos(startAngleRad);
      const y4 = size / 2 + innerRadius * Math.sin(startAngleRad);

      const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;

      return (
        <g key={`zone-${index}`}>
          <defs>
            <radialGradient id={`zoneGradient-${index}`} cx="0.5" cy="0.5">
              <stop offset="0%" stopColor={zone.color} stopOpacity="0.6"/>
              <stop offset="100%" stopColor={zone.color} stopOpacity="0.3"/>
            </radialGradient>
          </defs>
          <path
            d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`}
            fill={`url(#zoneGradient-${index})`}
            stroke={zone.color}
            strokeWidth="1"
            opacity="0.8"
          />
        </g>
      );
    });
  };

  const gaugeHeight = size / 2 + 40; // Half circle plus space for text

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative"
        style={{
          width: size,
          height: gaugeHeight,
          filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4))'
        }}
      >
        <svg
          width={size}
          height={gaugeHeight}
          viewBox={`0 0 ${size} ${gaugeHeight}`}
          className="overflow-visible"
        >
          <defs>
            {/* Brushed metal bezel gradient */}
            <radialGradient id="bezelGradient" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#D2B48C" />
              <stop offset="30%" stopColor="#CD7F32" />
              <stop offset="70%" stopColor="#8B4513" />
              <stop offset="100%" stopColor="#654321" />
            </radialGradient>
            
            {/* Inner bezel */}
            <radialGradient id="innerBezelGradient" cx="0.4" cy="0.3">
              <stop offset="0%" stopColor="#B8860B" />
              <stop offset="60%" stopColor="#8B4513" />
              <stop offset="100%" stopColor="#5D4037" />
            </radialGradient>
            
            {/* Gauge face */}
            <radialGradient id="faceGradient" cx="0.4" cy="0.2">
              <stop offset="0%" stopColor="#FFFEF7" />
              <stop offset="60%" stopColor="#FDF6E3" />
              <stop offset="100%" stopColor="#F5DEB3" />
            </radialGradient>
            
            {/* Glass reflection */}
            <radialGradient id="glassGradient" cx="0.3" cy="0.1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
            </radialGradient>
            
            {/* Paper texture */}
            <pattern id="paperTexture" patternUnits="userSpaceOnUse" width="6" height="6">
              <rect width="6" height="6" fill="#FDF6E3"/>
              <circle cx="1.5" cy="1.5" r="0.5" fill="#F0E68C" opacity="0.2"/>
              <circle cx="4.5" cy="4.5" r="0.3" fill="#DDD" opacity="0.3"/>
              <circle cx="1" cy="5" r="0.2" fill="#CCC" opacity="0.2"/>
            </pattern>
            
            {/* Brushed metal pattern */}
            <pattern id="brushedMetal" patternUnits="userSpaceOnUse" width="3" height="3">
              <rect width="3" height="3" fill="#8B4513"/>
              <rect width="1" height="3" fill="#A0522D" opacity="0.6"/>
              <rect x="2" width="1" height="3" fill="#654321" opacity="0.4"/>
            </pattern>
            
            {/* Shadow filters */}
            <filter id="outerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.5"/>
            </filter>
            
            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
              <feOffset dx="0" dy="3"/>
              <feGaussianBlur stdDeviation="4"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
              <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_innerShadow"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_innerShadow" result="shape"/>
            </filter>
          </defs>

          {/* Main outer bezel - semicircle */}
          <path
            d={`M ${size * 0.1} ${size / 2} A ${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.9} ${size / 2}`}
            fill="none"
            stroke="url(#bezelGradient)"
            strokeWidth="20"
            strokeLinecap="round"
            filter="url(#outerShadow)"
          />
          
          {/* Brushed metal texture ring */}
          <path
            d={`M ${size * 0.15} ${size / 2} A ${size * 0.35} ${size * 0.35} 0 0 1 ${size * 0.85} ${size / 2}`}
            fill="none"
            stroke="url(#brushedMetal)"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.7"
          />
          
          {/* Inner bezel */}
          <path
            d={`M ${size * 0.2} ${size / 2} A ${size * 0.3} ${size * 0.3} 0 0 1 ${size * 0.8} ${size / 2}`}
            fill="none"
            stroke="url(#innerBezelGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Gauge face semicircle */}
          <path
            d={`M ${size * 0.25} ${size / 2} A ${size * 0.25} ${size * 0.25} 0 0 1 ${size * 0.75} ${size / 2} Z`}
            fill="url(#paperTexture)"
            stroke="#D4B896"
            strokeWidth="2"
            filter="url(#innerShadow)"
          />
          
          {/* Face highlight */}
          <path
            d={`M ${size * 0.25} ${size / 2} A ${size * 0.25} ${size * 0.25} 0 0 1 ${size * 0.75} ${size / 2} Z`}
            fill="url(#faceGradient)"
            opacity="0.9"
          />

          {/* Color zones */}
          {generateColorZones()}

          {/* Tick marks and numbers */}
          {generateTicks()}

          {/* Glass cover */}
          <path
            d={`M ${size * 0.25} ${size / 2} A ${size * 0.25} ${size * 0.25} 0 0 1 ${size * 0.75} ${size / 2} Z`}
            fill="url(#glassGradient)"
            opacity="0.6"
          />

          {/* Center hub */}
          <circle
            cx={size / 2 + 1}
            cy={size / 2 + 1}
            r="10"
            fill="rgba(0, 0, 0, 0.4)"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="10"
            fill="url(#bezelGradient)"
            stroke="#4A4A4A"
            strokeWidth="2"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="6"
            fill="url(#innerBezelGradient)"
          />

          {/* Needle */}
          <g
            style={{
              transition: 'transform 2.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
              transformOrigin: `${size / 2}px ${size / 2}px`
            }}
            transform={`rotate(${needleAngle} ${size / 2} ${size / 2})`}
          >
            {/* Needle shadow */}
            <line
              x1={size / 2 + 1}
              y1={size / 2 + 1}
              x2={size / 2 + 1}
              y2={size / 2 - 65 + 1}
              stroke="rgba(0, 0, 0, 0.5)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Main needle */}
            <line
              x1={size / 2}
              y1={size / 2}
              x2={size / 2}
              y2={size / 2 - 65}
              stroke="#D2691E"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Needle tip */}
            <circle 
              cx={size / 2} 
              cy={size / 2 - 65} 
              r="3" 
              fill="#FF4500" 
              stroke="#8B4513" 
              strokeWidth="1"
            />
            {/* Counter-balance */}
            <line
              x1={size / 2}
              y1={size / 2}
              x2={size / 2}
              y2={size / 2 + 15}
              stroke="#8B4513"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Center dot */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="3"
            fill="#4A4A4A"
          />
        </svg>
      </div>

      {/* Vintage label */}
      <div className="mt-6 text-center">
        <div 
          className="text-lg font-bold tracking-wider mb-2"
          style={{
            fontFamily: 'serif',
            color: '#654321',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.15em'
          }}
        >
          {label}
        </div>
        <div 
          className="text-2xl font-bold"
          style={{
            fontFamily: 'serif',
            color: '#8B4513',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)'
          }}
        >
          {Math.round(value)}%
        </div>
      </div>
    </div>
  );
};

export default VintageAnalogGauge;
