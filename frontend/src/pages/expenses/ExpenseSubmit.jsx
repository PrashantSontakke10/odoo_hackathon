import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ExpenseSubmit = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // UI State
    const [isExtracting, setIsExtracting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    // Extracted OCR / Payload Mapped State
    const [expenseData, setExpenseData] = useState({
        amountOriginal: '',
        currencyOriginal: 'USD', // Users can rewrite the 3-letter target code
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        receiptUrl: 'local_upload_reference'
    });
    
    const [rawLines, setRawLines] = useState('');

    // Hidden input click trigger
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    // Implements POST /api/expenses/ocr
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('receipt', file);

        setIsExtracting(true);
        setError('');
        
        try {
            // Fires instantly upon receipt drop/select
            const { data } = await api.post('/expenses/ocr', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Maps the OCR extracted structural JSON directly into user editable state
            setExpenseData(prev => ({
                ...prev,
                amountOriginal: data.amount || prev.amountOriginal,
                category: data.expenseType || prev.category,
                description: data.description || prev.description,
                date: data.date || prev.date
            }));
            
            setRawLines(data.expenseLines ? data.expenseLines.join('\n') : data.rawOcrText);

        } catch (err) {
            console.error("OCR API Mapping Failed:", err);
            setError(err.response?.data?.message || 'Tesseract API Extraction failed. Check backend console.');
        } finally {
            setIsExtracting(false);
        }
        
        e.target.value = '';
    };

    // Implements POST /api/expenses
    const handleFinalize = async () => {
        if (!expenseData.amountOriginal) {
            setError("Missing Core Data: Original Expense Amount cannot be successfully mapped.");
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
             // Commits the verified subset of mapping state instantly into backend workflow pool
            await api.post('/expenses', expenseData);
            navigate('/'); // Routes dynamically back to central dashboard
        } catch (err) {
            console.error("Workflow push failed:", err);
            setError(err.response?.data?.message || 'Currency or Engine Evaluation failure.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Discard</button>
                <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Automatic Reimbursement Parser</h2>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem' }}>
                {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

                <div 
                    onClick={handleUploadClick}
                    style={{ 
                        padding: '2rem', 
                        border: '2px dashed rgba(99, 102, 241, 0.6)', 
                        borderRadius: '12px', 
                        textAlign: 'center', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s', 
                        backgroundColor: isExtracting ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        borderColor: isExtracting ? 'rgba(99, 102, 241, 1)' : 'rgba(99, 102, 241, 0.6)'
                    }} 
                    className="ocr-dropzone"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                        accept="image/*,application/pdf"
                    />
                    <p style={{ color: 'white', fontWeight: '500', fontSize: '1.2rem' }}>
                        {isExtracting ? 'Scanning Visual Structure... (Tesseract OCR Active)' : 'Upload Receipt Here for Engine Parsing'}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Endpoint Maps to <code>POST /api/expenses/ocr</code>
                    </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '4px' }}>Detected Original Currency Node</label>
                            <input type="text" className="input-field" placeholder="USD, EUR, INR..." value={expenseData.currencyOriginal} onChange={e => setExpenseData({...expenseData, currencyOriginal: e.target.value.toUpperCase()})} />
                        </div>
                        <div style={{ flex: 2 }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '4px' }}>Extracted Amount Layout</label>
                            <input type="number" className="input-field" placeholder="0.00" value={expenseData.amountOriginal} onChange={e => setExpenseData({...expenseData, amountOriginal: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '4px' }}>Inferred Receipt Category</label>
                        <input type="text" className="input-field" placeholder="e.g., Meals, Travel" value={expenseData.category} onChange={e => setExpenseData({...expenseData, category: e.target.value})} />
                    </div>

                    <div>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '4px' }}>Structural Object Lines Extract (Raw)</label>
                        <textarea className="input-field" rows="3" placeholder="Awaiting backend structural evaluation..." value={rawLines} readOnly style={{ resize: 'none' }}></textarea>
                    </div>

                    <button 
                        onClick={handleFinalize} 
                        disabled={isExtracting || isSubmitting} 
                        className="btn-primary" 
                        style={{ marginTop: '1.5rem', width: '100%', fontSize: '1.1rem', opacity: (isExtracting || isSubmitting) ? 0.6 : 1 }}
                    >
                        {isSubmitting ? 'Submitting to Workflow Threshold Manager...' : 'Finalize Module & Commit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseSubmit;
