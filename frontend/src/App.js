import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VoterDashboard from './pages/VoterDashboard';
import ECDashboard from './pages/ECDashboard';
import { AuthContextProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;  // or a spinner
  }
  return user && user.role === role ? children : <Navigate to="/login" />;
};


const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/voter-dashboard" element={<PrivateRoute role="voter"><VoterDashboard /></PrivateRoute>} />
          <Route path="/ec-dashboard" element={<PrivateRoute role="ec"><ECDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default App;