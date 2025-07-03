import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'business-travel-expenses';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);
    if (savedExpenses) {
      try {
        const parsed = JSON.parse(savedExpenses);
        setExpenses(parsed.map(expense => ({
          ...expense,
          date: new Date(expense.date)
        })));
      } catch (error) {
        console.error('Error parsing saved expenses:', error);
      }
    }
    setLoading(false);
  }, []);

  const saveExpenses = (newExpenses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  };

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date(expense.date)
    };
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    toast.success('Expense added successfully!');
  };

  const deleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    toast.success('Expense deleted successfully!');
  };

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense
  };
};
