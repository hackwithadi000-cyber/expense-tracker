import { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import ExpenseTracker from "./ExpenseTracker";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [user, setUser] = useState(null);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    setCurrentPage("tracker");
  };

  const handleRegister = (registeredUser) => {
    setUser(registeredUser);
    setCurrentPage("tracker");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      {currentPage === "register" && (
        <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage("login")} />
      )}

      {currentPage === "login" && (
        <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage("register")} />
      )}

      {currentPage === "tracker" && user && (
        <ExpenseTracker user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
