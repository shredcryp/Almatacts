import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home"; // Import your Home component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import AddContact from "./components/Addcontact"; // Fixed import
import ManageContact from "./components/Managecontacts"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Navbar setSearchQuery={setSearchQuery} onLogin={handleLogin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} /> {/* Pass searchQuery */}
        <Route path="/addcontact" element={<AddContact />} /> {/* Fixed component import */}
        <Route path="/managecontacts" element={<ManageContact />} /> {/* Fixed component import */}

        {/* Add other routes as necessary */}
      </Routes>
    </Router>
  );
}

export default App;
