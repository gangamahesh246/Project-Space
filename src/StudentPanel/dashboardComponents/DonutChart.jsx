import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({
  data,
  title,
  colors = ['#EF4444', '#F97316', '#EAB308', '#10B981', '#3B82F6']
}) => {
  const labels = data.map(item => item.label);
  const values = data.map(item => item.value);
  const total = values.reduce((sum, val) => sum + val, 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 10,
        cutout: '60%'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-6">
        <div className="relative w-32 h-32">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-lg font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
