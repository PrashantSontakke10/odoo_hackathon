import React from 'react';
import { useNavigate } from 'react-router-dom';

const RulesConfig = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Dashboard</button>
                <h2 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>Workflow Engine Matrix</h2>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--warning)', fontWeight: '600', marginBottom: '0.2rem' }}>SYSTEM CONFIG ENDPOINT:</p>
                    <code style={{ color: 'white' }}>POST /api/admin/rules</code>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>This instantly updates the internal evaluation algorithms handling multi-approvers.</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    <div>
                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Algorithm Conditional Style</label>
                        <select className="input-field" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', cursor: 'pointer' }}>
                            <option value="None">Strict Sequential Hierarchy</option>
                            <option value="Percentage">Group Consensus (Percentage based)</option>
                            <option value="Specific">VIP Execution Line (Instant Override)</option>
                            <option value="Hybrid">Hybrid Intelligence Matrix</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Threshold Limits</label>
                        <input type="number" className="input-field" placeholder="e.g. 60 for 60% approvals..." disabled style={{ opacity: 0.6 }} />
                    </div>

                    <div>
                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Sequential Order Tree</label>
                        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', color: 'var(--accent-secondary)' }}>
                            Step 1: <strong>Direct Mapping</strong> <br/>
                            Step 2: <strong>Finance Role</strong> <br/>
                            Step 3: <strong>CFO Role Override</strong>
                        </div>
                    </div>

                    <button className="btn-primary" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Commit Active Rules</button>
                </div>
            </div>
        </div>
    );
};
export default RulesConfig;
