import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RulesConfig = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [users, setUsers] = useState([]);

    const [ruleData, setRuleData] = useState({
        isManagerApprover: true,
        conditionFlow: 'None',
        percentageRule: 0,
        specificApprovers: [], 
        sequence: [] 
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const usersData = await api.get('/admin/users');
                setUsers(usersData.data);
            } catch (err) {
                console.error("Failed to load potential potential execution users");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleChange = (e) => {
        setRuleData({ ...ruleData, [e.target.name]: e.target.value });
    };

    const handleSpecificApproverChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setRuleData({ ...ruleData, specificApprovers: selectedOptions });
    };

    // Sequential UI Tree Builder Methods
    const addSequenceStep = () => {
        setRuleData({
            ...ruleData, 
            sequence: [...ruleData.sequence, { approverRole: 'Manager' }]
        });
    };

    const updateSequenceStep = (index, roleVal) => {
        const newSeq = [...ruleData.sequence];
        newSeq[index].approverRole = roleVal;
        setRuleData({...ruleData, sequence: newSeq});
    };

    const removeSequenceStep = (index) => {
        const newSeq = [...ruleData.sequence];
        newSeq.splice(index, 1);
        setRuleData({...ruleData, sequence: newSeq});
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const payload = {
                ...ruleData,
                percentageRule: Number(ruleData.percentageRule)
            };
            
            await api.post('/admin/rules', payload);
            
            setMessage({ text: 'Workflow mathematical matrix rules committed securely to MongoDB Engine!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to map rules to database.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Dashboard</button>
                <h2 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>Workflow Engine Matrix</h2>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--warning)', fontWeight: '600', marginBottom: '0.2rem' }}>PDF WORKFLOW CONFIGURATION TARGET:</p>
                    <code style={{ color: 'white' }}>POST /api/admin/rules</code>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Construct custom array sequence trees mapping perfectly to Step 1 -&gt; Manager, Step 2 -&gt; Finance PDF examples.</p>
                </div>

                {message.text && (
                    <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', fontWeight: '500' }}>
                        {message.text}
                    </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '8px' }}>
                        <input 
                            type="checkbox" 
                            id="isManagerApprover" 
                            checked={ruleData.isManagerApprover} 
                            onChange={(e) => setRuleData({...ruleData, isManagerApprover: e.target.checked})}
                            style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                        />
                        <label htmlFor="isManagerApprover" style={{ color: 'white', fontWeight: '500', cursor: 'pointer' }}>Global Default: Force Direct Manager IS MANAGER APPROVER first step before sequence array mapping</label>
                    </div>

                    <div>
                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Algorithm Conditional Style Mode</label>
                        <select name="conditionFlow" value={ruleData.conditionFlow} onChange={handleChange} className="input-field" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', cursor: 'pointer' }}>
                            <option value="None">Strict Configured Sequential Hierarchy Array</option>
                            <option value="Percentage">Group Consensus (Percentage Evaluation)</option>
                            <option value="Specific">VIP Execution Engine (Instant Rule Override)</option>
                            <option value="Hybrid">Hybrid Intelligence Matrix</option>
                        </select>
                    </div>

                    {/* Sequential Array Engine Mapping directly handling PDF requirement */}
                    {(ruleData.conditionFlow === 'None' || ruleData.conditionFlow === 'Hybrid') && (
                         <div style={{ animation: 'slideUp 0.3s ease' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Custom Structural Sequence (E.g. Step 1 → Finance, Step 2 → Director)</label>
                            
                            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                {ruleData.sequence.map((step, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Step {index + 1}:</span>
                                        <select 
                                            value={step.approverRole} 
                                            onChange={(e) => updateSequenceStep(index, e.target.value)}
                                            className="input-field" 
                                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '8px 12px', flex: 1, cursor: 'pointer' }}
                                        >
                                            <option value="Manager">Direct Workflow Manager (If not trapped by Global rule)</option>
                                            <option value="Finance">Finance Executive / Accountant</option>
                                            <option value="Director">Senior Director Board</option>
                                            <option value="Admin">Master System Admin</option>
                                        </select>
                                        <button 
                                            className="btn-primary" 
                                            onClick={() => removeSequenceStep(index)} 
                                            style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '8px 12px', minWidth: '40px' }}
                                        > X </button>
                                    </div>
                                ))}

                                <button 
                                    className="btn-primary" 
                                    onClick={addSequenceStep} 
                                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    + Bind New Layout Step
                                </button>
                            </div>
                        </div>
                    )}

                    {(ruleData.conditionFlow === 'Percentage' || ruleData.conditionFlow === 'Hybrid') && (
                        <div style={{ animation: 'slideUp 0.3s ease' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Target Approval Requirement (%)</label>
                            <input type="number" name="percentageRule" value={ruleData.percentageRule} onChange={handleChange} className="input-field" placeholder="E.g. entering 60 evaluates to: 60% approvals met" min="0" max="100" />
                        </div>
                    )}

                    {(ruleData.conditionFlow === 'Specific' || ruleData.conditionFlow === 'Hybrid') && (
                        <div style={{ animation: 'slideUp 0.3s ease' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Specific Override Approvers</label>
                            <select multiple value={ruleData.specificApprovers} onChange={handleSpecificApproverChange} className="input-field" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', minHeight: '120px', cursor: 'pointer' }}>
                                {users.filter(u => u.role === 'Admin' || u.role === 'Manager').map(u => (
                                    <option key={u._id} value={u._id} style={{ padding: '4px' }}>{u.name} (Role: {u.role})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button className="btn-primary" onClick={handleSave} disabled={isSaving || loading} style={{ marginTop: '1.5rem', fontSize: '1.1rem', opacity: (isSaving || loading) ? 0.7 : 1, padding: '1rem' }}>
                        {isSaving ? 'Injecting Matrix...' : 'Commit Active Engine Sequence to Database'}
                    </button>
                    
                </div>
            </div>
        </div>
    );
};
export default RulesConfig;
