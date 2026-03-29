import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="auth-container">
            <div className="glass-panel auth-card" style={{ textAlign: 'center' }}>
                <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Initiate Company Setup</h1>
                <p style={{ color: 'var(--text-secondary)' }}>This advanced registration form will connect to the RESTCountries API and set up your initial admin tenant structure.</p>
                
                <div style={{ marginTop: '2rem' }}>
                    <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', gap: '0.5rem' }}>
                        Go Back to Login Node
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default Register;
