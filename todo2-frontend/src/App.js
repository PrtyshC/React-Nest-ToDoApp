import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import ToDoPage from './components/ToDoPage';
import HomePage from './pages/HomePage';
import Clarity from '@microsoft/clarity';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const projectID = "qrj3a2q014";

  Clarity.init(projectID)

  // Check if the token exists in localStorage when the app loads
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);  // Stop loading after checking token
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <HomePage /> : <Navigate to="/todo" replace />}
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/todo" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/todo" replace /> : <RegisterPage />}
        />

        <Route
          path="/todo"
          element={isAuthenticated ? <ToDoPage setIsAuthenticated={setIsAuthenticated} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
