import React from 'react';

const DonutChart = ({ 
  data, 
  title, 
  colors = ['#EF4444', '#F97316', '#EAB308', '#10B981', '#3B82F6'] 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = (cumulativePercentage / 100) * 360;
    
    cumulativePercentage += percentage;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (startAngle + angle - 90) * (Math.PI / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const x1 = 50 + 35 * Math.cos(startAngleRad);
    const y1 = 50 + 35 * Math.sin(startAngleRad);
    const x2 = 50 + 35 * Math.cos(endAngleRad);
    const y2 = 50 + 35 * Math.sin(endAngleRad);
    
    const x3 = 50 + 20 * Math.cos(endAngleRad);
    const y3 = 50 + 20 * Math.sin(endAngleRad);
    const x4 = 50 + 20 * Math.cos(startAngleRad);
    const y4 = 50 + 20 * Math.sin(startAngleRad);
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A 20 20 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');

    return {
      pathData,
      color: colors[index % colors.length],
      percentage: Math.round(percentage),
      label: item.label,
      value: item.value
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <svg viewBox="0 0 100 100" className="w-32 h-32">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.pathData}
                fill={segment.color}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-700 flex-1">{segment.label}</span>
              <span className="text-sm font-semibold text-gray-900">
                {segment.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;