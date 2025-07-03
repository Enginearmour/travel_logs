import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Trash2, Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const categories = ['All', ...new Set(expenses.map(expense => expense.category))];

  const filteredExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-slate-800">
                {category}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date" className="bg-slate-800">Date</option>
            <option value="amount" className="bg-slate-800">Amount</option>
            <option value="category" className="bg-slate-800">Category</option>
          </select>
        </div>
      </div>

      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Expenses ({filteredExpenses.length})
          </h2>
          <div className="text-right">
            <p className="text-sm text-white/60">Total</p>
            <p className="text-xl font-bold text-white">${totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {expense.category.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{expense.title}</h3>
                      <p className="text-sm text-white/60">{expense.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/70 ml-13">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{format(expense.date, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium text-white">${expense.amount.toFixed(2)}</span>
                    </div>
                    {expense.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{expense.location}</span>
                      </div>
                    )}
                    {expense.businessPurpose && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{expense.businessPurpose}</span>
                      </div>
                    )}
                  </div>
                  
                  {expense.description && (
                    <p className="text-sm text-white/60 mt-2 ml-13">{expense.description}</p>
                  )}
                </div>
                
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          
          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No expenses found</h3>
              <p className="text-white/60">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
