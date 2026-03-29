import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/api/budgets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, amount: parseFloat(formData.amount) };

      if (editingBudget) {
        await axios.put(`/api/budgets/${editingBudget.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('/api/budgets', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }

      fetchBudgets();
      setShowForm(false);
      setEditingBudget(null);
      resetForm();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      amount: budget.amount.toString(),
      category_id: budget.category_id || '',
      start_date: new Date(budget.start_date).toISOString().split('T')[0],
      end_date: new Date(budget.end_date).toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axios.delete(`/api/budgets/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      category_id: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const getBudgetStatus = (budget) => {
    const utilization = budget.spent / budget.amount;
    if (utilization >= 0.9) return { status: 'danger', color: 'text-red-600', bg: 'bg-red-100' };
    if (utilization >= 0.75) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
        <button
          onClick={() => {
            setEditingBudget(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {editingBudget ? 'Edit Budget' : 'Add Budget'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category (Optional)
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {editingBudget ? 'Update' : 'Add'} Budget
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBudget(null);
                  resetForm();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const status = getBudgetStatus(budget);
          const utilization = (budget.spent / budget.amount * 100).toFixed(1);

          return (
            <div key={budget.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{budget.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {budget.category?.name || 'All Categories'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Spent</span>
                  <span className="font-medium">₹{budget.spent.toFixed(2)} / ₹{budget.amount.toFixed(2)}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full ${status.status === 'danger' ? 'bg-red-500' : status.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${status.color}`}>
                    {utilization}% used
                  </span>
                  {status.status === 'danger' && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Create your first budget to start tracking your spending.</p>
        </div>
      )}
    </div>
  );
};

export default Budgets;