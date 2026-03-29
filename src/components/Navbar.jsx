import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { LogOut, User, Settings, BarChart3, CreditCard, Download, PieChart, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ExpenseTracker Pro
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              <Wallet className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/expenses" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">Expenses</Link>
            <Link to="/categories" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">Categories</Link>
            <Link to="/budgets" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              <PieChart className="w-4 h-4" />
              <span>Budgets</span>
            </Link>
            <Link to="/analytics" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
            <Link to="/subscription" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              <CreditCard className="w-4 h-4" />
              <span>Subscription</span>
            </Link>
            <Link to="/export" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;