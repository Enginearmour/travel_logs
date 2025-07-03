import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Receipt, 
  Car,
  FileText,
  Plus,
  Settings 
} from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, onAddExpense }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'mileage', label: 'Mileage', icon: Car },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-1">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </motion.button>
        ))}
        
        <motion.button
          onClick={onAddExpense}
          className="ml-4 p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="glass border-t border-white/10 px-4 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 4).map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'text-blue-400'
                    : 'text-white/60 hover:text-white'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </motion.button>
            ))}
            
            <motion.button
              onClick={onAddExpense}
              className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full"
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
