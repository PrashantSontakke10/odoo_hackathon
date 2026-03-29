import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Credentials');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="glass-panel auth-card">
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to manage reimbursements securely.</p>
                
                {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <FiMail style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} size={18} />
                        <input type="email" placeholder="Work Email" className="input-field" style={{ paddingLeft: '42px' }} value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <FiLock style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} size={18} />
                        <input type="password" placeholder="Password" className="input-field" style={{ paddingLeft: '42px' }} value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                        {isSubmitting ? 'Authenticating...' : 'Secure SignIn'} <FiArrowRight />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-secondary)' }}>
                    Don't have a company account? <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}>Register setup</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
