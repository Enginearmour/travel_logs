import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Mock data for demo purposes
const mockExpenses = [
  {
    id: '1',
    type: 'fuel',
    title: 'Shell Gas Station',
    amount: 65.50,
    category: 'Fuel',
    date: new Date('2024-01-15'),
    description: 'Business trip fuel',
    location: '123 Main St, Toronto, ON',
    odometerReading: 45230,
    receiptNumber: 'SH-001234'
  },
  {
    id: '2',
    type: 'meal',
    title: 'Client Lunch',
    amount: 85.75,
    category: 'Meals',
    date: new Date('2024-01-14'),
    description: 'Business lunch with ABC Corp',
    location: 'The Keg Restaurant',
    attendees: 'John Smith, Sarah Johnson',
    businessPurpose: 'Contract negotiation meeting'
  },
  {
    id: '3',
    type: 'accommodation',
    title: 'Hilton Hotel',
    amount: 189.99,
    category: 'Accommodation',
    date: new Date('2024-01-13'),
    description: 'Overnight stay for client meetings',
    location: 'Downtown Toronto',
    checkIn: new Date('2024-01-13'),
    checkOut: new Date('2024-01-14')
  },
  {
    id: '4',
    type: 'miscellaneous',
    title: 'Parking Fee',
    amount: 15.00,
    category: 'Parking',
    date: new Date('2024-01-12'),
    description: 'Client meeting parking',
    location: 'Bay Street Parking',
    businessPurpose: 'Client visit'
  }
];

const mockMileageEntries = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    startOdometer: 45180,
    endOdometer: 45230,
    totalKm: 50,
    startLocation: 'Home Office',
    endLocation: 'ABC Corp, Toronto',
    businessPurpose: 'Client meeting',
    attendees: 'John Smith, Sarah Johnson',
    rate: 0.68, // CRA rate per km
    amount: 34.00
  },
  {
    id: '2',
    date: new Date('2024-01-14'),
    startOdometer: 45130,
    endOdometer: 45180,
    totalKm: 50,
    startLocation: 'Home Office',
    endLocation: 'XYZ Industries, Mississauga',
    businessPurpose: 'Project consultation',
    attendees: 'Mike Wilson',
    rate: 0.68,
    amount: 34.00
  }
];

export function useBusinessExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [mileageEntries, setMileageEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setExpenses(mockExpenses);
      setMileageEntries(mockMileageEntries);
      setLoading(false);
    }, 1000);
  }, []);

  const addExpense = async (expenseData) => {
    try {
      const newExpense = {
        id: Date.now().toString(),
        ...expenseData,
        date: new Date(expenseData.date)
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      toast.success('Expense added successfully!');
      return newExpense;
    } catch (error) {
      toast.error('Failed to add expense');
      throw error;
    }
  };

  const addMileageEntry = async (mileageData) => {
    try {
      const totalKm = mileageData.endOdometer - mileageData.startOdometer;
      const rate = 0.68; // Current CRA rate
      const amount = totalKm * rate;

      const newEntry = {
        id: Date.now().toString(),
        ...mileageData,
        totalKm,
        rate,
        amount,
        date: new Date(mileageData.date)
      };
      
      setMileageEntries(prev => [newEntry, ...prev]);
      toast.success('Mileage entry added successfully!');
      return newEntry;
    } catch (error) {
      toast.error('Failed to add mileage entry');
      throw error;
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
      toast.success('Expense deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete expense');
      throw error;
    }
  };

  const deleteMileageEntry = async (entryId) => {
    try {
      setMileageEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Mileage entry deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete mileage entry');
      throw error;
    }
  };

  return {
    expenses,
    mileageEntries,
    loading,
    addExpense,
    addMileageEntry,
    deleteExpense,
    deleteMileageEntry
  };
}
