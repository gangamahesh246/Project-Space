import React from 'react';

const BarChart = ({ 
  data, 
  title, 
  color = '#10B981', 
  horizontal = false 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  if (horizontal) {
    return (
      <div className="bg-white rounded shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-32 text-sm font-medium text-gray-700 truncate">
                {item.label}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                <div
                  className="h-3 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <div className="w-12 text-sm font-semibold text-gray-900 text-right">
                {item.value}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-end justify-between space-x-2 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t-md transition-all duration-700 ease-out hover:opacity-80"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: color,
                minHeight: '20px'
              }}
            />
            <div className="mt-2 text-xs font-medium text-gray-700 text-center truncate w-full">
              {item.label}
            </div>
            <div className="text-xs font-semibold text-gray-900 mt-1">
              {item.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;