import { useState } from "react";

function ExpenseTracker({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const addExpense = () => {
    if (!title || !amount) return;
    setExpenses([...expenses, { title, amount }]);
    setTitle("");
    setAmount("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>{user}, welcome to your Expense Tracker</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Expense Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>

      <h2>Expenses:</h2>
      <ul>
        {expenses.map((exp, index) => (
          <li key={index}>
            {exp.title}: ${exp.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseTracker;