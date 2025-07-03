import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, MapPin, Plus, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MileageLog = () => {
  const [mileageEntries, setMileageEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startLocation: '',
    endLocation: '',
    startOdometer: '',
    endOdometer: '',
    businessPurpose: '',
    clientName: ''
  });

  const CRA_RATE_2024 = 0.68; // $0.68 per km for 2024

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const startOdo = parseFloat(formData.startOdometer);
    const endOdo = parseFloat(formData.endOdometer);
    
    if (endOdo <= startOdo) {
      toast.error('End odometer must be greater than start odometer');
      return;
    }

    const distance = endOdo - startOdo;
    const amount = distance * CRA_RATE_2024;

    const newEntry = {
      id: Date.now().toString(),
      ...formData,
      startOdometer: startOdo,
      endOdometer: endOdo,
      distance,
      amount,
      date: new Date(formData.date)
    };

    setMileageEntries([newEntry, ...mileageEntries]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startLocation: '',
      endLocation: '',
      startOdometer: '',
      endOdometer: '',
      businessPurpose: '',
      clientName: ''
    });
    setShowForm(false);
    toast.success('Mileage entry added successfully!');
  };

  const totalDistance = mileageEntries.reduce((sum, entry) => sum + entry.distance, 0);
  const totalAmount = mileageEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Mileage Log</h2>
          <p className="text-white/60">Track business travel for tax deductions</p>
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Trip</span>
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card text-center">
          <Car className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{totalDistance.toFixed(1)}</p>
          <p className="text-white/60 text-sm">Total Kilometers</p>
        </div>
        <div className="glass-card text-center">
          <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</p>
          <p className="text-white/60 text-sm">Tax Deduction</p>
        </div>
        <div className="glass-card text-center">
          <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{mileageEntries.length}</p>
          <p className="text-white/60 text-sm">Business Trips</p>
        </div>
      </div>

      {/* Mileage Entries */}
      <div className="glass-card">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Trips</h3>
        
        <div className="space-y-4">
          {mileageEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white/5 rounded-xl"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{entry.businessPurpose}</h4>
                    <p className="text-sm text-white/60">{format(entry.date, 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">${entry.amount.toFixed(2)}</p>
                  <p className="text-sm text-white/60">{entry.distance.toFixed(1)} km</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span>From: {entry.startLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>To: {entry.endLocation}</span>
                </div>
                <div>
                  <span>Start: {entry.startOdometer.toLocaleString()} km</span>
                </div>
                <div>
                  <span>End: {entry.endOdometer.toLocaleString()} km</span>
                </div>
                {entry.clientName && (
                  <div className="md:col-span-2">
                    <span>Client: {entry.clientName}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {mileageEntries.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No mileage entries yet</h3>
              <p className="text-white/60">Start tracking your business travel</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Mileage Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white mb-6">Add Mileage Entry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Start Location</label>
                <input
                  type="text"
                  value={formData.startLocation}
                  onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Office, Home"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">End Location</label>
                <input
                  type="text"
                  value={formData.endLocation}
                  onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Client office, Conference center"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Start Odometer (km)</label>
                  <input
                    type="number"
                    value={formData.startOdometer}
                    onChange={(e) => setFormData({ ...formData, startOdometer: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">End Odometer (km)</label>
                  <input
                    type="number"
                    value={formData.endOdometer}
                    onChange={(e) => setFormData({ ...formData, endOdometer: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Business Purpose</label>
                <input
                  type="text"
                  value={formData.businessPurpose}
                  onChange={(e) => setFormData({ ...formData, businessPurpose: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Client meeting, Site visit"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Client/Company Name</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MileageLog;
