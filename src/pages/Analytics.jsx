import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/analytics?period=${timeRange}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-12">No analytics data available</div>;
  }

  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(analytics.total_income)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(analytics.total_expenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Savings</p>
              <p className={`text-2xl font-bold ${analytics.net_savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(analytics.net_savings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.total_transactions}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Expenses by Category</h2>
          {analytics.expenses_by_category.length > 0 ? (
            <div className="space-y-3">
              {analytics.expenses_by_category.map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{category.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(category.amount / analytics.total_expenses) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No expenses in this period</p>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Monthly Trend</h2>
          {analytics.monthly_trend.length > 0 ? (
            <div className="space-y-3">
              {analytics.monthly_trend.map((month, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{month.month}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(month.net)}
                    </span>
                    {month.net >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No data available</p>
          )}
        </div>
      </div>

      {/* Top Expenses */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Expenses</h2>
        {analytics.top_expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-700 dark:text-gray-300">Description</th>
                  <th className="text-left py-2 text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-left py-2 text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-right py-2 text-gray-700 dark:text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {analytics.top_expenses.map((expense, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 text-gray-900 dark:text-white">{expense.description}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-400">{expense.category}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-400">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No expenses in this period</p>
        )}
      </div>

      {/* Budget Performance */}
      {analytics.budget_performance && analytics.budget_performance.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Budget Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.budget_performance.map((budget, index) => {
              const utilization = (budget.spent / budget.budget) * 100;
              const isOverBudget = utilization > 100;

              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{budget.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Spent</span>
                      <span className="font-medium">{formatCurrency(budget.spent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Budget</span>
                      <span className="font-medium">{formatCurrency(budget.budget)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                        {utilization.toFixed(1)}% used
                      </span>
                      {isOverBudget && (
                        <span className="text-red-600 font-medium">
                          Over by {formatCurrency(budget.spent - budget.budget)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;