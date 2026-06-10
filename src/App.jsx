import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadsPage';
import LeadDetail from './pages/LeadDetail';
import CommentsPage from './pages/CommentsPage';
import CustomMessage from './pages/CustomMessage';
import Insights from './pages/Insights';
import UsersPage from './pages/UsersPage';
import POsPage from './pages/POsPage';
import CompaniesPage from './pages/CompaniesPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import ViewUser from './pages/ViewUser';
import ViewPO from './pages/ViewPO';
import ViewCompany from './pages/ViewCompany';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/leads" element={<PrivateRoute><LeadsPage /></PrivateRoute>} />
          <Route path="/lead/:id" element={<PrivateRoute><LeadDetail /></PrivateRoute>} />
          <Route path="/comments" element={<PrivateRoute><CommentsPage /></PrivateRoute>} />
          <Route path="/custom-message" element={<PrivateRoute><CustomMessage /></PrivateRoute>} />
          <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path="/pos" element={<PrivateRoute><POsPage /></PrivateRoute>} />
          <Route path="/companies" element={<PrivateRoute><CompaniesPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/user/:id" element={<PrivateRoute><ViewUser /></PrivateRoute>} />
          <Route path="/po/:id" element={<PrivateRoute><ViewPO /></PrivateRoute>} />
          <Route path="/company/:id" element={<PrivateRoute><ViewCompany /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
