import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
         <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <div>
                     <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Welcome to Nexus, {user?.name}</h2>
                     <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Role: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user?.role}</span> | Company: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user?.company?.name}</span></p>
                 </div>
                 <button className="btn-primary" onClick={logout}>Sign Out</button>
             </div>
             
             <div className="glass-panel" style={{ padding: '3rem', marginTop: '2rem', textAlign: 'center' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>Expense Modules Instantiating...</h3>
                <p style={{ color: 'var(--text-secondary)' }}>The submission layouts, multi-approver nodes, and real-time history charts will populate here according to industry-standard designs.</p>
             </div>
         </div>
    );
};

export default Dashboard;
