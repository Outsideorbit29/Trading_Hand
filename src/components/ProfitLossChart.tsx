import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Trade {
  id: string;
  profit_loss: number;
  created_at: string;
}

interface ProfitLossChartProps {
  trades: Trade[];
}

export default function ProfitLossChart({ trades }: ProfitLossChartProps) {
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  let cumulativePL = 0;
  const data = {
    labels: sortedTrades.map(trade => 
      new Date(trade.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Cumulative P&L',
        data: sortedTrades.map(trade => {
          cumulativePL += trade.profit_loss;
          return cumulativePL;
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.8)',
          maxTicksLimit: 6,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.8)',
          callback: function(value) {
            return '$' + Number(value).toFixed(0);
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: 'rgb(59, 130, 246)',
        borderColor: 'white',
        borderWidth: 2,
      },
    },
  };

  if (trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No trade data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}