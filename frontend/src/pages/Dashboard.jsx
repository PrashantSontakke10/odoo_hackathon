import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
         <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Module */}
             <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <div>
                     <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Welcome to Nexus, {user?.name}</h2>
                     <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                         Role: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user?.role}</span> | 
                         Company: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user?.company?.name || 'Loading'}</span>
                     </p>
                 </div>
                 <button className="btn-primary" onClick={logout}>Secure Signout</button>
             </div>
             
             {/* Feature Hub */}
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                 
                 {/* Standard Module: Always accessible mapping to GET /api/expenses */}
                 <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     <h3 style={{ color: 'white', fontSize: '1.4rem' }}>My Expense Flow</h3>
                     <p style={{ color: 'var(--text-secondary)', flex: 1 }}>Tracks <code>GET /api/expenses</code>. See history and active approval states evaluated by the engine.</p>
                     
                     <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                         <Link to="/expenses/new" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>+ Submit New</Link>
                         <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', flex: 1 }}>View Vault</button>
                     </div>
                 </div>

                 {/* Admin Only Modules */}
                 {user?.role === 'Admin' && (
                     <>
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(rgba(30, 41, 59, 0.7), rgba(99, 102, 241, 0.1))' }}>
                            <h3 style={{ color: 'var(--accent-secondary)', fontSize: '1.4rem' }}>Admin: User Control</h3>
                            <p style={{ color: 'var(--text-secondary)', flex: 1 }}>Links to <code>/api/admin/users</code>. Map exact structural overrides.</p>
                            <Link to="/admin/users" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>Manage Organization</Link>
                        </div>
                        
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(rgba(30, 41, 59, 0.7), rgba(245, 158, 11, 0.1))' }}>
                            <h3 style={{ color: 'var(--warning)', fontSize: '1.4rem' }}>Admin: Rules Core</h3>
                            <p style={{ color: 'var(--text-secondary)', flex: 1 }}>Links to <code>/api/admin/rules</code>. Re-align the mathematical approval states live.</p>
                            <Link to="/admin/rules" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center', background: 'var(--warning)' }}>Configure Matrix</Link>
                        </div>
                     </>
                 )}
                 
                 {/* Manager Only Tools targeting PUT /api/expenses/:id/action */}
                 {user?.role === 'Manager' && (
                      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(rgba(30, 41, 59, 0.7), rgba(16, 185, 129, 0.1))' }}>
                          <h3 style={{ color: 'var(--success)', fontSize: '1.4rem' }}>Approvals Inbox</h3>
                          <p style={{ color: 'var(--text-secondary)', flex: 1 }}>Evaluates nodes matching <code>PUT /api/expenses/:id/action</code> required for your level.</p>
                          <button className="btn-primary" style={{ background: 'var(--success)', color: '#0f172a' }}>Review Requests</button>
                      </div>
                 )}
             </div>
         </div>
    );
};

export default Dashboard;
