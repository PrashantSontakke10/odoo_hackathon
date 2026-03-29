import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard & Expenses Endpoints
import Dashboard from './pages/Dashboard';
import ExpenseSubmit from './pages/expenses/ExpenseSubmit';

// Admin System Endpoints
import UsersManage from './pages/admin/UsersManage';
import RulesConfig from './pages/admin/RulesConfig';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return (
      <div className="animated-bg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', fontSize: '1.5rem' }}>
          Initializing Routes...
      </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  // Advanced Role Checker
  if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />; // Kicks unauthorized users back to their root dashboard
  }
  
  return children;
};

const App = () => {
  return (
    <div className="animated-bg">
      <Routes>
        {/* Auth Domain Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Core Authenticated Route mapping to GET /api/expenses */}
        <Route path="/" element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        } />
        
        {/* Expenses Sub-domain mapping to POST /api/expenses & POST /api/expenses/ocr */}
        <Route path="/expenses/new" element={
            <ProtectedRoute allowedRoles={['Employee', 'Admin', 'Manager']}>
                <ExpenseSubmit />
            </ProtectedRoute>
        } />
        
        {/* Admin Explicit Domain mapping to /api/admin/... */ }
        <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['Admin']}>
                <UsersManage />
            </ProtectedRoute>
        } />
        
        <Route path="/admin/rules" element={
            <ProtectedRoute allowedRoles={['Admin']}>
                <RulesConfig />
            </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default App;
