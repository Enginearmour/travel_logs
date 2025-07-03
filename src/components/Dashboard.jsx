import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Car, 
  TrendingUp, 
  Calendar,
  Fuel,
  UtensilsCrossed,
  Building,
  Receipt,
  MapPin,
  Users
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Dashboard = ({ expenses, mileageEntries }) => {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthExpenses = expenses.filter(expense => 
    isWithinInterval(expense.date, { start: monthStart, end: monthEnd })
  );
  
  const currentMonthMileage = mileageEntries.filter(entry => 
    isWithinInterval(entry.date, { start: monthStart, end: monthEnd })
  );
  
  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalMileage = currentMonthMileage.reduce((sum, entry) => sum + entry.totalKm, 0);
  const totalMileageAmount = currentMonthMileage.reduce((sum, entry) => sum + entry.amount, 0);
  const totalBusinessAmount = totalExpenses + totalMileageAmount;
  
  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  
  const stats = [
    {
      title: 'Total Business Expenses',
      value: `$${totalBusinessAmount.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Business Mileage',
      value: `${totalMileage} km`,
      icon: Car,
      color: 'from-green-500 to-green-600',
      change: `$${totalMileageAmount.toFixed(2)}`,
      trend: 'up'
    },
    {
      title: 'Fuel Expenses',
      value: `$${(categoryTotals['Fuel'] || 0).toFixed(2)}`,
      icon: Fuel,
      color: 'from-orange-500 to-orange-600',
      change: '+8.3%',
      trend: 'up'
    },
    {
      title: 'Meal Expenses',
      value: `$${(categoryTotals['Meals'] || 0).toFixed(2)}`,
      icon: UtensilsCrossed,
      color: 'from-purple-500 to-purple-600',
      change: '-2.1%',
      trend: 'down'
    }
  ];

  const recentActivities = [
    ...currentMonthExpenses.slice(0, 3).map(expense => ({
      ...expense,
      type: 'expense',
      icon: getExpenseIcon(expense.category)
    })),
    ...currentMonthMileage.slice(0, 2).map(entry => ({
      ...entry,
      type: 'mileage',
      icon: Car,
      title: `${entry.startLocation} → ${entry.endLocation}`,
      amount: entry.amount
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  function getExpenseIcon(category) {
    switch (category) {
      case 'Fuel': return Fuel;
      case 'Meals': return UtensilsCrossed;
      case 'Accommodation': return Building;
      default: return Receipt;
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">
          Business Travel Dashboard
        </h2>
        <p className="text-white/60">
          Tax-compliant expense tracking for {format(currentMonth, 'MMMM yyyy')}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4 rotate-180" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/60 text-sm">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Business Activities</h3>
          <Calendar className="w-6 h-6 text-purple-400" />
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <activity.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{activity.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <span>{activity.type === 'mileage' ? 'Mileage' : activity.category}</span>
                    {activity.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                    {activity.attendees && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{activity.attendees}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">${activity.amount.toFixed(2)}</p>
                <p className="text-sm text-white/60">
                  {format(activity.date, 'MMM dd')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tax Compliance Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Tax Compliance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <Receipt className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-white/60">Deductible Expenses</p>
            <p className="font-semibold text-white">${totalBusinessAmount.toFixed(2)}</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <Car className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-white/60">Business KM</p>
            <p className="font-semibold text-white">{totalMileage} km</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-white/60">Potential Tax Savings</p>
            <p className="font-semibold text-white">${(totalBusinessAmount * 0.3).toFixed(2)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
