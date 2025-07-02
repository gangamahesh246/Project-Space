import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
  Title
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
  Title
);

const LineChart = ({ data, title, color = '#3B82F6' }) => {
  const labels = data.map(point => point.label);
  const values = data.map(point => point.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, color + '33'); 
          gradient.addColorStop(1, color + '00'); 
          return gradient;
        },
        borderColor: color,
        pointBackgroundColor: color,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: false,
        text: title
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative w-full h-40">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
