import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { socket } from '../services/socket';
import { AuthContext } from './AuthContext';

export const MessContext = createContext();

export const MessProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [messDetails, setMessDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [meals, setMeals] = useState([]);
  const [dailyMealSummary, setDailyMealSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDateState] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user && user.messId) {
      fetchMessDetails();
      fetchSummary();
      fetchMeals();
      fetchDailyMealSummary(selectedDate);
      fetchExpenses();
      fetchDeposits();

      // Connect Socket.io
      const messIdStr = typeof user.messId === 'object' ? user.messId._id : user.messId;
      if (messIdStr) {
        socket.connect();
        socket.emit('join_mess_room', messIdStr);

        socket.on('meal_updated', () => {
          fetchSummary();
          fetchMeals();
          fetchDailyMealSummary(selectedDate);
        });

        socket.on('expense_added', () => {
          fetchSummary();
          fetchExpenses();
        });

        socket.on('expense_deleted', () => {
          fetchSummary();
          fetchExpenses();
        });

        socket.on('deposit_added', () => {
          fetchSummary();
          fetchDeposits();
        });
      }
    }

    return () => {
      socket.off('meal_updated');
      socket.off('expense_added');
      socket.off('expense_deleted');
      socket.off('deposit_added');
      socket.disconnect();
    };
  }, [user, selectedMonth]);

  const fetchMessDetails = async () => {
    try {
      const res = await api.get('/mess/details');
      setMessDetails(res.data.mess);
      setMembers(res.data.members);
    } catch (err) {
      console.log('Error fetching mess details:', err.message);
    }
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/summary?month=${selectedMonth}`);
      setSummary(res.data);
    } catch (err) {
      console.log('Error fetching summary:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyMealSummary = async (dateStr) => {
    try {
      const targetDate = dateStr || selectedDate;
      const res = await api.get(`/meals/daily-summary?date=${targetDate}`);
      setDailyMealSummary(res.data);
    } catch (err) {
      console.log('Error fetching daily meal summary:', err.message);
    }
  };

  const setSelectedDate = (newDate) => {
    setSelectedDateState(newDate);
    fetchDailyMealSummary(newDate);
  };

  const fetchMeals = async () => {
    try {
      const res = await api.get(`/meals?month=${selectedMonth}`);
      setMeals(res.data);
    } catch (err) {
      console.log('Error fetching meals:', err.message);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses?month=${selectedMonth}`);
      setExpenses(res.data);
    } catch (err) {
      console.log('Error fetching expenses:', err.message);
    }
  };

  const fetchDeposits = async () => {
    try {
      const res = await api.get(`/deposits?month=${selectedMonth}`);
      setDeposits(res.data);
    } catch (err) {
      console.log('Error fetching deposits:', err.message);
    }
  };

  const createMess = async (name, address) => {
    const res = await api.post('/mess/create', { name, address });
    await fetchMessDetails();
    return res.data;
  };

  const joinMess = async (joinCode) => {
    const res = await api.post('/mess/join', { joinCode });
    await fetchMessDetails();
    return res.data;
  };

  const logMeal = async (mealData) => {
    const res = await api.post('/meals', mealData);
    await fetchSummary();
    await fetchMeals();
    await fetchDailyMealSummary(mealData.date || selectedDate);
    return res.data;
  };

  const addExpense = async (expenseData) => {
    const res = await api.post('/expenses', expenseData);
    await fetchSummary();
    await fetchExpenses();
    return res.data;
  };

  const addDeposit = async (depositData) => {
    const res = await api.post('/deposits', depositData);
    await fetchSummary();
    await fetchDeposits();
    return res.data;
  };

  return (
    <MessContext.Provider
      value={{
        messDetails,
        members,
        summary,
        meals,
        dailyMealSummary,
        expenses,
        deposits,
        loading,
        selectedMonth,
        setSelectedMonth,
        selectedDate,
        setSelectedDate,
        fetchDailyMealSummary,
        createMess,
        joinMess,
        logMeal,
        addExpense,
        addDeposit,
        refreshData: () => {
          fetchSummary();
          fetchMeals();
          fetchDailyMealSummary(selectedDate);
          fetchExpenses();
          fetchDeposits();
        },
      }}
    >
      {children}
    </MessContext.Provider>
  );
};
