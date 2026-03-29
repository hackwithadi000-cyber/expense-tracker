import React, { useState } from 'react';
import axios from 'axios';
import { Download, FileText, FileSpreadsheet, Calendar, Filter } from 'lucide-react';

const Export = () => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [includeCategories, setIncludeCategories] = useState(true);
  const [includeBudgets, setIncludeBudgets] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = {
        format: exportFormat,
        start_date: dateRange.start,
        end_date: dateRange.end,
        include_categories: includeCategories,
        include_budgets: includeBudgets
      };

      const response = await axios.get('/api/export/data', {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const fileName = `expense-tracker-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert('Export completed successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportOptions = [
    {
      format: 'csv',
      name: 'CSV',
      description: 'Comma-separated values, compatible with Excel and most spreadsheet applications',
      icon: FileSpreadsheet
    },
    {
      format: 'json',
      name: 'JSON',
      description: 'JavaScript Object Notation, great for developers and data analysis',
      icon: FileText
    },
    {
      format: 'pdf',
      name: 'PDF',
      description: 'Portable Document Format, perfect for reports and printing',
      icon: FileText
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Export Data</h1>
        <p className="text-gray-600 dark:text-gray-400">Download your expense tracking data in various formats</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Export Format Selection */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Export Format</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportOptions.map((option) => (
              <div
                key={option.format}
                onClick={() => setExportFormat(option.format)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  exportFormat === option.format
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <option.icon className={`w-6 h-6 ${
                    exportFormat === option.format ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    exportFormat === option.format ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                  }`}>
                    {option.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Date Range
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Data Options */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Data Options
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="include-categories"
                type="checkbox"
                checked={includeCategories}
                onChange={(e) => setIncludeCategories(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="include-categories" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Include category information
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="include-budgets"
                type="checkbox"
                checked={includeBudgets}
                onChange={(e) => setIncludeBudgets(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="include-budgets" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Include budget information
              </label>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Export Summary</h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p><strong>Format:</strong> {exportOptions.find(opt => opt.format === exportFormat)?.name}</p>
            <p><strong>Date Range:</strong> {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}</p>
            <p><strong>Includes:</strong> Transactions{includeCategories ? ', Categories' : ''}{includeBudgets ? ', Budgets' : ''}</p>
          </div>
        </div>

        {/* Export Button */}
        <div className="text-center">
          <button
            onClick={handleExport}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
          >
            <Download className="w-5 h-5" />
            {loading ? 'Exporting...' : 'Export Data'}
          </button>
        </div>

        {/* Export Tips */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Export Tips</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>• CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</li>
            <li>• JSON files are perfect for developers or importing into other applications</li>
            <li>• PDF files provide a formatted report suitable for printing or sharing</li>
            <li>• Large date ranges may take longer to process</li>
            <li>• Your data is exported securely and remains private</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Export;