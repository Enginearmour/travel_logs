import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { 
  Briefcase, 
  Plus, 
  Car, 
  Receipt, 
  BarChart3, 
  FileText,
  Mic,
  DollarSign,
  Calendar,
  MapPin
} from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState([
    {
      id: '1',
      title: 'Gas for client meeting',
      amount: 45.50,
      category: 'Fuel',
      date: new Date(),
      businessPurpose: 'Client meeting downtown',
      location: 'Shell Station'
    },
    {
      id: '2', 
      title: 'Business lunch',
      amount: 67.25,
      category: 'Meals',
      date: new Date(),
      businessPurpose: 'Lunch with potential client',
      location: 'Downtown Restaurant'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card text-center"
      >
        <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <p className="text-2xl font-bold text-white">${totalExpenses.toFixed(2)}</p>
        <p className="text-white/60 text-sm">Total Expenses</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card text-center"
      >
        <Receipt className="w-8 h-8 text-blue-400 mx-auto mb-2" />
        <p className="text-2xl font-bold text-white">{expenses.length}</p>
        <p className="text-white/60 text-sm">Transactions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card text-center"
      >
        <Car className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <p className="text-2xl font-bold text-white">0</p>
        <p className="text-white/60 text-sm">Miles Logged</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card text-center"
      >
        <FileText className="w-8 h-8 text-orange-400 mx-auto mb-2" />
        <p className="text-2xl font-bold text-white">${(totalExpenses * 0.25).toFixed(2)}</p>
        <p className="text-white/60 text-sm">Tax Savings</p>
      </motion.div>
    </div>
  );

  const ExpenseList = () => (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Expenses</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="space-y-4">
        {expenses.map((expense, index) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
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
              <div className="text-right">
                <p className="font-semibold text-white">${expense.amount.toFixed(2)}</p>
                <p className="text-sm text-white/60">Today</p>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/70 ml-13">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{expense.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>{expense.businessPurpose}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const VoiceInput = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card mb-8"
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-4">Voice Input</h2>
        <p className="text-white/60 mb-6">Add expenses hands-free while driving</p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Mic className="w-8 h-8" />
        </motion.button>
        
        <p className="text-sm text-white/50 mt-4">
          Tap to start voice recording
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-b border-white/10 sticky top-0 z-30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">Business Travel Tracker</h1>
                  <p className="text-xs text-white/60">Tax-Compliant Expense & Mileage Logging</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <VoiceInput />
            <QuickStats />
            <ExpenseList />
          </motion.div>
        </main>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
