import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsersManage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Dashboard</button>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>Hierarchy Architect</h2>
                </div>
                <button className="btn-primary">+ Create Profile</button>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', margin: 0 }}>
                        <strong style={{ color: 'var(--success)' }}>ADMIN ACTIVE ENDPOINTS:</strong><br/>
                        1. <code>POST /api/admin/users</code> (Creation)<br/>
                        2. <code>PUT /api/admin/users/:id/role</code> (Promotion/Demotion)<br/>
                        3. <code>PUT /api/admin/users/:id/manager</code> (Assigns tree graph)
                    </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', color: 'white', textAlign: 'left', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Full Name</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>System Role</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Direct Manager</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', textAlign: 'right' }}>Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <p style={{fontSize: '1.1rem'}}>Company tree populating from DB...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default UsersManage;
