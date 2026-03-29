import { useState, useEffect } from "react";

const EXPENSE_KEY_BASE = "expense_tracker_expenses";

const getExpensesStorageKey = (email) => `${EXPENSE_KEY_BASE}_${email.toLowerCase()}`;

const loadExpenses = (email) => {
  try {
    const raw = localStorage.getItem(getExpensesStorageKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveExpenses = (email, expenses) => {
  localStorage.setItem(getExpensesStorageKey(email), JSON.stringify(expenses));
};

export default function ExpenseTracker({ user, onLogout }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    if (user?.email) {
      setExpenses(loadExpenses(user.email));
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const addExpense = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !amount.toString().trim()) {
      setError("Please provide both title and amount.");
      return;
    }

    const parsed = Number(amount);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    const now = new Date();
    const expenseDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const expenseMonth = now.toLocaleDateString("default", { month: "long", year: "numeric" });

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(parsed.toFixed(2)),
      date: expenseDate,
      month: expenseMonth,
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveExpenses(user.email, updated);

    setTitle("");
    setAmount("");
  };

  const deleteExpense = (expenseId) => {
    const updated = expenses.filter((exp) => exp.id !== expenseId);
    setExpenses(updated);
    saveExpenses(user.email, updated);
  };

  return (
    <div className="w-full max-w-4xl bg-blue-50 rounded-2xl shadow-lg p-8 border border-blue-200 hover:scale-110 transition-all duration-300 ease-out hover:shadow-[0_0_25px_rgb(57,255,20)] animate-[pulse_2s_ease-in-out_infinite]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-sm text-slate-600">Your email: {user.email}</p>
          <p className="text-sm text-slate-500">Current Time: {currentTime}</p>
        </div>
        <button
          className="px-4 py-2 rounded-md border text-sm hover:bg-blue-100 transition-colors duration-200"
          onClick={() => {
            onLogout();
          }}
        >
          Logout
        </button>
      </div>

      <form onSubmit={addExpense} className="mb-6 space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.01"
          />
          <button
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
            type="submit"
          >
            Add Expense
          </button>
        </div>
      </form>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-xl font-semibold">Recent Expenses</p>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-lg hover:bg-green-200 transition-colors duration-200">Total Expenses: ₹{total.toFixed(2)}</div>
      </div>

      {expenses.length === 0 ? (
        <p className="text-slate-500">No expenses yet. Add one to start tracking!</p>
      ) : (
        <div className="overflow-y-auto max-h-[420px]">
          <table className="w-full border-collapse text-left border border-blue-300">
            <thead>
              <tr className="bg-blue-100 border-b-2 border-blue-300">
                <th className="px-3 py-2 border-r-2 border-blue-300">Title</th>
                <th className="px-3 py-2 border-r-2 border-blue-300">Amount</th>
                <th className="px-3 py-2 border-r-2 border-blue-300">Date</th>
                <th className="px-3 py-2 border-r-2 border-blue-300">Month</th>
                <th className="px-3 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="odd:bg-white even:bg-white border-b border-blue-200 hover:bg-blue-50 hover:shadow-[0_0_12px_rgb(57,255,20)] transition-all duration-200">
                  <td className="px-3 py-2 border-r-2 border-blue-300">{exp.title}</td>
                  <td className="px-3 py-2 border-r-2 border-blue-300">₹{exp.amount.toFixed(2)}</td>
                  <td className="px-3 py-2 border-r-2 border-blue-300">{exp.date}</td>
                  <td className="px-3 py-2 border-r-2 border-blue-300">{exp.month}</td>
                  <td className="px-3 py-2">
                    <button
                      className="px-2 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 hover:scale-110 transition-all duration-200"
                      onClick={() => deleteExpense(exp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
