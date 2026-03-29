import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExpenseSubmit = () => {
    const navigate = useNavigate();
    
    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Back</button>
                <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Submit Reimbursement</h2>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', margin: 0 }}>
                        <strong style={{ color: 'var(--warning)' }}>BACKEND ROUTE MAP:</strong><br/>
                        1. <code>POST /api/expenses/ocr</code> (Fires instantly on upload)<br/>
                        2. <code>POST /api/expenses</code> (Fires on Finalize button)
                    </p>
                </div>

                <div style={{ padding: '2rem', border: '2px dashed rgba(99, 102, 241, 0.6)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }} className="ocr-dropzone">
                    <p style={{ color: 'white', fontWeight: '500', fontSize: '1.2rem' }}>Drop receipt image here for Auto-OCR parsing</p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>or click to browse local files</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '2rem' }}>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '4px' }}>Detected Amount (Converted)</label>
                        <input type="text" className="input-field" placeholder="0.00" disabled />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '4px' }}>Inferred Category</label>
                        <input type="text" className="input-field" placeholder="e.g., Meals, Travel" disabled />
                    </div>
                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '4px' }}>Extracted Line Items (Raw)</label>
                        <textarea className="input-field" rows="3" placeholder="Waiting for OCR extraction..." disabled style={{ resize: 'none' }}></textarea>
                    </div>
                    <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%', fontSize: '1.1rem' }}>Finalize & Push to Approval Manager</button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseSubmit;
