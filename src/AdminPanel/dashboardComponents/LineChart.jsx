import React from 'react';

const LineChart = ({ data, title, color = '#3B82F6' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = 150 - ((point.value - minValue) / range) * 120;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <div className="bg-white rounded shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative">
        <svg viewBox="0 0 300 150" className="w-full h-40">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={30 + i * 30}
              x2="300"
              y2={30 + i * 30}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Area under curve */}
          <path
            d={`${pathD} L ${points[points.length - 1].split(',')[0]},150 L 0,150 Z`}
            fill="url(#gradient)"
          />
          
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 300;
            const y = 150 - ((point.value - minValue) / range) * 120;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="hover:r-6 transition-all duration-200"
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          {data.map((point, index) => (
            <span key={index} className="text-xs">{point.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;