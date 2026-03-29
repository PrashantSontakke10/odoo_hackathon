import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import ExpenseSubmit from './pages/expenses/ExpenseSubmit';
import ExpenseList from './pages/expenses/ExpenseList';

import UsersManage from './pages/admin/UsersManage';
import RulesConfig from './pages/admin/RulesConfig';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return (
      <div className="animated-bg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', fontSize: '1.5rem' }}>
          Loading Architecture Engines...
      </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />; 
  }
  
  return children;
};

const App = () => {
  return (
    <div className="animated-bg">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        <Route path="/expenses/new" element={<ProtectedRoute allowedRoles={['Employee', 'Admin', 'Manager']}><ExpenseSubmit /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
        
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><UsersManage /></ProtectedRoute>} />
        <Route path="/admin/rules" element={<ProtectedRoute allowedRoles={['Admin']}><RulesConfig /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
