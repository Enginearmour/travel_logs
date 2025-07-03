import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateCategoryTotals = (expenses) => {
  const categoryTotals = {};
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });
  return categoryTotals;
};

export const getMonthlyExpenses = (expenses, monthsBack = 6) => {
  const monthlyData = [];
  
  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthExpenses = expenses.filter(expense => 
      isWithinInterval(new Date(expense.date), { start: monthStart, end: monthEnd })
    );
    
    monthlyData.push({
      month: format(date, 'MMM yyyy'),
      total: calculateTotalExpenses(monthExpenses),
      expenses: monthExpenses
    });
  }
  
  return monthlyData;
};

export const calculateSavingsRate = (income, expenses) => {
  if (income <= 0) return 0;
  const totalExpenses = calculateTotalExpenses(expenses);
  return ((income - totalExpenses) / income) * 100;
};

export const getCategoryColors = () => ({
  'Food': '#ef4444',
  'Transportation': '#3b82f6',
  'Entertainment': '#8b5cf6',
  'Health': '#10b981',
  'Education': '#f59e0b',
  'Shopping': '#ec4899',
  'Bills': '#6b7280',
  'Other': '#14b8a6'
});

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
