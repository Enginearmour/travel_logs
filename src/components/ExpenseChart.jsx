import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { calculateCategoryTotals, getMonthlyExpenses, getCategoryColors } from '../utils/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ExpenseChart = ({ expenses, chartType = 'category' }) => {
  const categoryTotals = calculateCategoryTotals(expenses);
  const monthlyData = getMonthlyExpenses(expenses);
  const categoryColors = getCategoryColors();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: chartType !== 'doughnut' ? {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    } : {},
  };

  const categoryChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(category => 
          categoryColors[category] || '#6b7280'
        ),
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyData.map(data => data.total),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const renderChart = () => {
    switch (chartType) {
      case 'doughnut':
        return <Doughnut data={categoryChartData} options={chartOptions} />;
      case 'monthly':
        return <Line data={monthlyChartData} options={chartOptions} />;
      default:
        return <Bar data={categoryChartData} options={chartOptions} />;
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'doughnut':
        return 'Expense Distribution';
      case 'monthly':
        return 'Monthly Spending Trends';
      default:
        return 'Expenses by Category';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card"
    >
      <h3 className="text-xl font-semibold text-white mb-6">{getChartTitle()}</h3>
      <div className="h-80">
        {renderChart()}
      </div>
    </motion.div>
  );
};

export default ExpenseChart;
