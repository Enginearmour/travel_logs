import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mic, MicOff, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

const ExpenseForm = ({ onAddExpense, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Fuel',
    date: new Date().toISOString().split('T')[0],
    description: '',
    businessPurpose: '',
    attendees: '',
    location: ''
  });

  const { isListening, transcript, startListening, stopListening, parseVoiceInput, isSupported } = useVoiceInput();

  const categories = [
    'Fuel',
    'Meals',
    'Accommodation',
    'Transportation',
    'Office Supplies',
    'Equipment',
    'Miscellaneous'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    onClose();
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        const parsed = parseVoiceInput(transcript);
        setFormData(prev => ({
          ...prev,
          title: parsed.title,
          amount: parsed.amount.toString(),
          category: parsed.category,
          description: parsed.description
        }));
      }
    } else {
      startListening();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add Business Expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Voice Input */}
        {isSupported && (
          <div className="mb-6">
            <button
              onClick={handleVoiceInput}
              className={`w-full p-4 rounded-xl border-2 border-dashed transition-all ${
                isListening
                  ? 'border-red-400 bg-red-500/10 text-red-400'
                  : 'border-blue-400 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="font-medium">
                  {isListening ? 'Stop Voice Input' : 'Use Voice Input'}
                </span>
              </div>
              {transcript && (
                <p className="mt-2 text-sm text-white/70">"{transcript}"</p>
              )}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Expense Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Gas for client meeting"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Business Purpose
            </label>
            <input
              type="text"
              value={formData.businessPurpose}
              onChange={(e) => setFormData({ ...formData, businessPurpose: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Client meeting, Conference attendance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Downtown office, Hotel conference room"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
              placeholder="Additional details..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Add Expense
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseForm;
