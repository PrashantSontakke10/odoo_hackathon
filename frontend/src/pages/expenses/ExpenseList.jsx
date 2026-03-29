import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ExpenseList = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            // Evaluates to specific user constraints handled efficiently in backend
            const { data } = await api.get('/expenses');
            setExpenses(data.reverse()); // Put newest on top
        } catch (error) {
            console.error("Failed to fetch vault expenses");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setActionLoading(id);
        try {
            // Triggers the heavy workflow condition analysis on the node.js backend
            await api.put(`/expenses/${id}/action`, { status, comments: `Manager Engine Action: ${status}` });
            fetchExpenses(); // Refresh visually
        } catch (error) {
            alert(error.response?.data?.message || "Workflow engine push failed.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Dashboard</button>
                <h2 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>Reimbursement Vault</h2>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', margin: 0 }}>
                        <strong style={{ color: 'var(--accent-primary)' }}>ACTIVE VAULT ROUTING:</strong><br/>
                        1. <code>GET /api/expenses</code> (Retrieves subset isolating view based on Role limitations)<br/>
                        {(user?.role === 'Manager' || user?.role === 'Admin') && (
                            <>2. <code>PUT /api/expenses/:id/action</code> (Mathematical Engine evaluation triggers)</>
                        )}
                    </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', color: 'white', textAlign: 'left', borderCollapse: 'collapse', minWidth: '950px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Originator Code</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Inferred Category</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Local Amount</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Global Context Amount</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Workflow Status</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', textAlign: 'right' }}>Engine Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        <p style={{fontSize: '1.1rem'}}>Vault logic populating safely from DB Engine...</p>
                                    </td>
                                </tr>
                            ) : expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No active reimbursements found intersecting your access level.</td>
                                </tr>
                            ) : (
                                expenses.map(exp => (
                                    <tr key={exp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', ':hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                                        <td style={{ padding: '1rem 0' }}>
                                            <div style={{ fontWeight: 500, fontSize: '1.05rem' }}>{exp.employee?.name || 'Unknown Reference'}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{new Date(exp.date).toLocaleDateString()}</div>
                                        </td>
                                        <td style={{ padding: '1rem 0', color: 'var(--text-primary)' }}>{exp.category || 'General Trace'}</td>
                                        <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{exp.amountOriginal.toFixed(2)} <strong style={{color: 'white'}}>{exp.currencyOriginal}</strong></td>
                                        <td style={{ padding: '1rem 0', fontWeight: '500', color: 'var(--accent-secondary)' }}>{exp.amountCompanyCurrency.toFixed(2)}</td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{ 
                                                padding: '6px 12px', 
                                                borderRadius: '6px', 
                                                fontSize: '0.85rem', 
                                                fontWeight: '600',
                                                background: exp.status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : exp.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: exp.status === 'Approved' ? 'var(--success)' : exp.status === 'Rejected' ? 'var(--danger)' : 'var(--warning)',
                                                border: `1px solid ${exp.status === 'Approved' ? 'var(--success)' : exp.status === 'Rejected' ? 'var(--danger)' : 'var(--warning)'}`
                                            }}>
                                                {exp.status === 'Pending' ? `Pending (Node ${exp.currentApprovalStep})` : exp.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                            {(user?.role === 'Manager' || user?.role === 'Admin') && exp.status === 'Pending' ? (
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        disabled={actionLoading === exp._id}
                                                        onClick={() => handleAction(exp._id, 'Approved')} 
                                                        style={{ padding: '6px 16px', borderRadius: '6px', background: 'var(--success)', border: 'none', color: '#0f172a', fontWeight: '600', cursor: 'pointer', opacity: actionLoading === exp._id ? 0.6 : 1 }}
                                                    >
                                                        {actionLoading === exp._id ? '...' : 'Approve'}
                                                    </button>
                                                    <button 
                                                        disabled={actionLoading === exp._id}
                                                        onClick={() => handleAction(exp._id, 'Rejected')} 
                                                        style={{ padding: '6px 16px', borderRadius: '6px', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', fontWeight: '600', cursor: 'pointer', opacity: actionLoading === exp._id ? 0.6 : 1 }}
                                                    >
                                                        Drop
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>-- Locked State --</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default ExpenseList;
