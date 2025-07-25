import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, title, color = '#10B981', horizontal = false, showPercentage = false}) => {
  const labels = data.map(item => item.label);
  const values = data.map(item => item.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: color,
        borderRadius: 6,
        maxBarThickness: 40
      }
    ]
  };

  const options = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${context.raw}${showPercentage ? '%' : ''}`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#4B5563',
          font: { size: 12 }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#4B5563',
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative w-full h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
