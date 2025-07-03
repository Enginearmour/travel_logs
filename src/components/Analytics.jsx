import React from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Target,
  Award
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

const Analytics = ({ expenses }) => {
  const currentMonth = new Date();
  const lastMonth = subMonths(currentMonth, 1);
  
  const currentMonthExpenses = expenses.filter(expense => 
    isWithinInterval(expense.date, { 
      start: startOfMonth(currentMonth), 
      end: endOfMonth(currentMonth) 
    })
  );
  
  const lastMonthExpenses = expenses.filter(expense => 
    isWithinInterval(expense.date, { 
      start: startOfMonth(lastMonth), 
      end: endOfMonth(lastMonth) 
    })
  );

  const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyChange = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;

  // Category breakdown
  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / currentTotal) * 100
    }))
    .sort((a, b) => b.amount - a.amount);

  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-red-500 to-red-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600'
  ];

  // Weekly breakdown
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i * 7 + 1);
    const weekEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), (i + 1) * 7);
    
    const weekExpenses = currentMonthExpenses.filter(expense =>
      isWithinInterval(expense.date, { start: weekStart, end: weekEnd })
    );
    
    weeklyData.push({
      week: `Week ${i + 1}`,
      amount: weekExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      count: weekExpenses.length
    });
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Expense Analytics</h2>
        <p className="text-white/60">
          Insights for {format(currentMonth, 'MMMM yyyy')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card text-center"
        >
          <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">${currentTotal.toFixed(2)}</p>
          <p className="text-white/60 text-sm">This Month</p>
          <div className={`flex items-center justify-center space-x-1 text-sm mt-1 ${
            monthlyChange >= 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            <TrendingUp className={`w-4 h-4 ${monthlyChange < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(monthlyChange).toFixed(1)}%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card text-center"
        >
          <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{currentMonthExpenses.length}</p>
          <p className="text-white/60 text-sm">Transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card text-center"
        >
          <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            ${currentMonthExpenses.length > 0 ? (currentTotal / currentMonthExpenses.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-white/60 text-sm">Avg per Transaction</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card text-center"
        >
          <Award className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            {categoryData.length > 0 ? categoryData[0].category : 'None'}
          </p>
          <p className="text-white/60 text-sm">Top Category</p>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <PieChart className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Category Breakdown</h3>
        </div>

        <div className="space-y-4">
          {categoryData.map((item, index) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{item.category}</span>
                <div className="text-right">
                  <span className="text-white font-semibold">${item.amount.toFixed(2)}</span>
                  <span className="text-white/60 text-sm ml-2">({item.percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className={`h-2 rounded-full bg-gradient-to-r ${colors[index % colors.length]}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Weekly Spending</h3>
        </div>

        <div className="space-y-4">
          {weeklyData.map((week, index) => {
            const maxAmount = Math.max(...weeklyData.map(w => w.amount));
            const percentage = maxAmount > 0 ? (week.amount / maxAmount) * 100 : 0;
            
            return (
              <div key={week.week} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{week.week}</span>
                  <div className="text-right">
                    <span className="text-white font-semibold">${week.amount.toFixed(2)}</span>
                    <span className="text-white/60 text-sm ml-2">({week.count} transactions)</span>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Tax Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Tax Deduction Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-sm text-white/60 mb-1">Potential Deduction</p>
            <p className="text-2xl font-bold text-green-400">${currentTotal.toFixed(2)}</p>
            <p className="text-xs text-white/50 mt-1">Based on business expenses</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <p className="text-sm text-white/60 mb-1">Tax Savings Estimate</p>
            <p className="text-2xl font-bold text-blue-400">${(currentTotal * 0.25).toFixed(2)}</p>
            <p className="text-xs text-white/50 mt-1">Assuming 25% tax rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
