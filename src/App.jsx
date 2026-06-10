import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadsPage';
import LeadDetail from './pages/LeadDetail';
import CommentsPage from './pages/CommentsPage';
import CustomMessage from './pages/CustomMessage';
import Insights from './pages/Insights';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/leads" element={<PrivateRoute><LeadsPage /></PrivateRoute>} />
          <Route path="/lead/:id" element={<PrivateRoute><LeadDetail /></PrivateRoute>} />
          <Route path="/comments" element={<PrivateRoute><CommentsPage /></PrivateRoute>} />
          <Route path="/custom-message" element={<PrivateRoute><CustomMessage /></PrivateRoute>} />
          <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
