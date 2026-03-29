import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UsersManage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form modal state
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Employee', managerId: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch internal developers/users");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert("Role mutation failed on server");
        }
    };

    const handleManagerChange = async (userId, newManagerId) => {
        try {
            const { data } = await api.put(`/admin/users/${userId}/manager`, { managerId: newManagerId === "none" ? null : newManagerId });
            setUsers(users.map(u => u._id === userId ? data : u));
        } catch (error) {
            alert("Manager assignment layout failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...formData };
            if (!payload.managerId) delete payload.managerId; // Clean non-assigned strings
            const { data } = await api.post('/admin/users', payload);
            setUsers([...users, data]);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'Employee', managerId: '' }); // Reset
        } catch (error) {
            alert(error.response?.data?.message || "Creation failed due to a server error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Precalculate available manager nodes (Admins or System Managers only)
    const potentialManagers = users.filter(u => u.role === 'Admin' || u.role === 'Manager');

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Dashboard</button>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>Hierarchy Architect</h2>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Create Profile</button>
            </div>

            {/* Premium Create Profile Modal Overlay */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
                    <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '450px' }}>
                        <h3 className="gradient-text" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>New User Sequence</h3>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <input type="text" className="input-field" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            <input type="email" className="input-field" placeholder="Work Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            <input type="password" className="input-field" placeholder="Assign Secure Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                            
                            <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', cursor: 'pointer' }}>
                                <option value="Employee">System Employee</option>
                                <option value="Manager">Workflow Manager</option>
                                <option value="Admin">Global Admin</option>
                            </select>

                            <select className="input-field" value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})} style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', cursor: 'pointer' }}>
                                <option value="">-- Assign Direct Supervisor (Optional) --</option>
                                {potentialManagers.map(m => (
                                    <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
                                ))}
                            </select>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ flex: 1 }}>{isSubmitting ? 'Pushing Profile...' : 'Inject Record'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', margin: 0 }}>
                        <strong style={{ color: 'var(--success)' }}>ADMIN ACTIVE ENDPOINTS:</strong><br/>
                        0. <code>GET /api/admin/users</code> (Live Layout Serialization)<br/>
                        1. <code>POST /api/admin/users</code> (Creation Modal)<br/>
                        2. <code>PUT /api/admin/users/:id/role</code> (Realtime Demotion)<br/>
                        3. <code>PUT /api/admin/users/:id/manager</code> (Assigns tree graph)
                    </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', color: 'white', textAlign: 'left', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', width: '30%' }}>Full Name & Identity</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', width: '25%' }}>System Role</th>
                                <th style={{ padding: '1rem 0', color: 'var(--text-secondary)', width: '45%' }}>Direct Manager Routing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        <p style={{fontSize: '1.1rem'}}>Company tree populating from Backend DB...</p>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No entries configured globally.</td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1.5rem 0' }}>
                                            <div style={{ fontWeight: 500, fontSize: '1.1rem' }}>{u.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{u.email}</div>
                                        </td>
                                        <td style={{ padding: '1.5rem 0' }}>
                                            <select 
                                                value={u.role} 
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', color: 'white', border: '1px solid var(--glass-border)', cursor: 'pointer', fontFamily: 'inherit' }}
                                            >
                                                <option value="Employee">Employee Node</option>
                                                <option value="Manager">Manager Node</option>
                                                <option value="Admin">Admin Node</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1.5rem 0' }}>
                                            <select 
                                                value={u.manager?._id || "none"}
                                                onChange={(e) => handleManagerChange(u._id, e.target.value)}
                                                style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', color: 'white', border: '1px solid var(--glass-border)', width: '100%', maxWidth: '250px', cursor: 'pointer', fontFamily: 'inherit' }}
                                            >
                                                <option value="none">-- Unassigned Supervisor --</option>
                                                {potentialManagers.filter(m => m._id !== u._id).map(m => (
                                                    <option key={m._id} value={m._id}>{m.name}</option>
                                                ))}
                                            </select>
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
export default UsersManage;
