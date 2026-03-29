import { useState } from "react";

const STORAGE_KEY = "expense_tracker_users";

const getSavedUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export default function Register({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Fill all fields before registering.");
      return;
    }

    const users = getSavedUsers();
    const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      setError("That email is already registered. Please use another email or log in.");
      return;
    }

    const newUser = { name: name.trim(), email: email.trim().toLowerCase(), password };
    users.push(newUser);
    saveUsers(users);

    setName("");
    setEmail("");
    setPassword("");

    onRegister(newUser);
  };

  return (
    <div className="w-full max-w-md bg-blue-50 rounded-2xl shadow-lg p-8 border border-blue-200 hover:scale-110 transition-all duration-300 ease-out hover:shadow-[0_0_25px_rgb(57,255,20)] animate-[pulse_2s_ease-in-out_infinite]">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      {error && <p className="mb-3 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Full Name</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm">Email</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm">Password</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
          />
        </div>

        <button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          type="submit"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <button className="text-blue-600 underline" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </div>
  );
}
