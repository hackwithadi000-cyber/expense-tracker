import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Plus, Minus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total_income: 0,
    total_expenses: 0,
    net_balance: 0,
    transaction_count: 0,
    budget_utilization: 0,
    recent_transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.total_income.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.total_expenses.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Balance</p>
              <p className={`text-2xl font-bold ${stats.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{stats.net_balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PieChart className="w-8 h-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.budget_utilization.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {stats.recent_transactions.map((transaction) => (
            <li key={transaction.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <Plus className="w-4 h-4 text-green-600" />
                    ) : (
                      <Minus className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.category?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {stats.recent_transactions.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            No transactions yet. Start by adding your first expense or income.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;