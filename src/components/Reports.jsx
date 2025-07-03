import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  DollarSign,
  Car,
  Receipt
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Reports = ({ expenses }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getPeriodData = () => {
    const now = new Date();
    let start, end;

    switch (selectedPeriod) {
      case 'current-month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'last-month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        start = quarterStart;
        end = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
    }

    return { start, end };
  };

  const { start, end } = getPeriodData();
  
  const filteredExpenses = expenses.filter(expense => {
    const inPeriod = isWithinInterval(expense.date, { start, end });
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return inPeriod && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categories = ['all', ...new Set(expenses.map(expense => expense.category))];

  const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const generateCSV = () => {
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Business Purpose', 'Location', 'Description'];
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        format(expense.date, 'yyyy-MM-dd'),
        `"${expense.title}"`,
        expense.category,
        expense.amount.toFixed(2),
        `"${expense.businessPurpose || ''}"`,
        `"${expense.location || ''}"`,
        `"${expense.description || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${format(start, 'yyyy-MM-dd')}-to-${format(end, 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateTaxReport = () => {
    const taxContent = [
      'BUSINESS EXPENSE TAX REPORT',
      `Period: ${format(start, 'MMM dd, yyyy')} - ${format(end, 'MMM dd, yyyy')}`,
      `Generated: ${format(new Date(), 'MMM dd, yyyy')}`,
      '',
      'SUMMARY:',
      `Total Business Expenses: $${totalAmount.toFixed(2)}`,
      `Number of Transactions: ${filteredExpenses.length}`,
      `Estimated Tax Deduction: $${totalAmount.toFixed(2)}`,
      `Estimated Tax Savings (25%): $${(totalAmount * 0.25).toFixed(2)}`,
      '',
      'CATEGORY BREAKDOWN:',
      ...Object.entries(categoryBreakdown).map(([category, amount]) => 
        `${category}: $${amount.toFixed(2)}`
      ),
      '',
      'DETAILED TRANSACTIONS:',
      'Date\t\tTitle\t\tCategory\t\tAmount\t\tBusiness Purpose',
      ...filteredExpenses.map(expense => 
        `${format(expense.date, 'yyyy-MM-dd')}\t\t${expense.title}\t\t${expense.category}\t\t$${expense.amount.toFixed(2)}\t\t${expense.businessPurpose || 'N/A'}`
      )
    ].join('\n');

    const blob = new Blob([taxContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-report-${format(start, 'yyyy-MM-dd')}-to-${format(end, 'yyyy-MM-dd')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Expense Reports</h2>
        <p className="text-white/60">Generate tax-compliant reports for your business expenses</p>
      </div>

      {/* Filters */}
      <div className="glass-card">
        <h3 className="text-xl font-semibold text-white mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current-month" className="bg-slate-800">Current Month</option>
              <option value="last-month" className="bg-slate-800">Last Month</option>
              <option value="quarter" className="bg-slate-800">Current Quarter</option>
              <option value="year" className="bg-slate-800">Current Year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card text-center"
        >
          <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</p>
          <p className="text-white/60 text-sm">Total Expenses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card text-center"
        >
          <Receipt className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{filteredExpenses.length}</p>
          <p className="text-white/60 text-sm">Transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card text-center"
        >
          <Car className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">${(totalAmount * 0.25).toFixed(2)}</p>
          <p className="text-white/60 text-sm">Est. Tax Savings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card text-center"
        >
          <FileText className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{Object.keys(categoryBreakdown).length}</p>
          <p className="text-white/60 text-sm">Categories</p>
        </motion.div>
      </div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Export Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            onClick={generateCSV}
            className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </motion.button>
          
          <motion.button
            onClick={generateTaxReport}
            className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-5 h-5" />
            <span>Tax Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Category Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(categoryBreakdown)
            .sort(([,a], [,b]) => b - a)
            .map(([category, amount], index) => {
              const percentage = (amount / totalAmount) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{category}</span>
                    <div className="text-right">
                      <span className="text-white font-semibold">${amount.toFixed(2)}</span>
                      <span className="text-white/60 text-sm ml-2">({percentage.toFixed(1)}%)</span>
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

      {/* Tax Compliance Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20"
      >
        <h3 className="text-lg font-semibold text-white mb-3">Tax Compliance Information</h3>
        <div className="text-sm text-white/80 space-y-2">
          <p>• Keep all receipts and documentation for business expenses</p>
          <p>• Ensure business purpose is clearly documented for each expense</p>
          <p>• Mileage rate for 2024: $0.68 per kilometer (CRA)</p>
          <p>• Consult with a tax professional for specific deduction advice</p>
          <p>• Reports generated are for record-keeping purposes only</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
