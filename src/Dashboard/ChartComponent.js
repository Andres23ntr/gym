// src/components/ChartComponent.js
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra los componentes necesarios para que `chart.js` funcione
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ title, data, type = 'line' }) => {
  const ChartType = type === 'bar' ? Bar : Line;

  // Verifica que `data` y `data.labels` existan
  const chartData = data && data.labels ? data : { labels: [], datasets: [] };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-gray-600 font-semibold mb-4">{title}</h3>
      <ChartType data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default ChartComponent;
