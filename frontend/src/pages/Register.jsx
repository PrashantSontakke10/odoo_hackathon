import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FiMail, FiLock, FiUser, FiBriefcase, FiGlobe, FiArrowRight } from 'react-icons/fi';

const Register = () => {
    const { registerCompany } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Pagination state
    const [step, setStep] = useState(1); 
    
    // RESTCountries API state mapping
    const [countries, setCountries] = useState([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);

    const [formData, setFormData] = useState({
        companyName: '',
        country: '',
        currency: '',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                // Instantly grabs parsed data from our explicit backend country service
                const { data } = await api.get('/auth/countries');
                // Auto-sort alphabetically mapping
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(sorted);
                
                // Precompile selection variables 
                if(sorted.length > 0) {
                    setFormData(prev => ({ 
                        ...prev, 
                        country: sorted[0].name, 
                        currency: sorted[0].currencyCode 
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch countries');
                setError('Failed to establish link with global RESTCountries node.');
            } finally {
                setIsLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    const handleCountryChange = (e) => {
        const selectedName = e.target.value;
        const mappedCountry = countries.find(c => c.name === selectedName);
        setFormData(prev => ({ 
            ...prev, 
            country: selectedName,
            // Visually instantly maps dynamically according to PDF requirement 
            currency: mappedCountry ? mappedCountry.currencyCode : ''
        }));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await registerCompany(formData);
            navigate('/'); // Maps directly authorized redirect back to populated Dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Registration transaction failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel auth-card" style={{ maxWidth: '540px' }}>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Initialize Nexus</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Configure your system tenant globally.</p>
                
                {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    
                    {step === 1 ? (
                        <>
                            <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.2rem' }}>1. Company Configuration</h3>
                            
                            <div style={{ position: 'relative' }}>
                                <FiBriefcase style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} size={18} />
                                <input type="text" name="companyName" placeholder="Organization Name" className="input-field" style={{ paddingLeft: '42px' }} value={formData.companyName} onChange={handleChange} required />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <FiGlobe style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} size={18} />
                                <select 
                                    name="country" 
                                    className="input-field" 
                                    style={{ paddingLeft: '42px', appearance: 'none', backgroundColor: 'rgba(15, 23, 42, 0.8)', cursor: 'pointer', color: isLoadingCountries ? 'var(--text-secondary)' : 'white' }} 
                                    value={formData.country} 
                                    onChange={handleCountryChange} 
                                    disabled={isLoadingCountries}
                                    required
                                >
                                    {isLoadingCountries ? <option>Loading Global Matrices...</option> : 
                                        countries.map(c => (
                                            <option key={c.name} value={c.name}>{c.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mapping Auto-Detected Currency: </span>
                                <strong style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>{formData.currency || '---'}</strong>
                            </div>

                            <button type="button" onClick={() => setStep(2)} className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }} disabled={!formData.companyName || isLoadingCountries}>
                                Configure Admin Identity <FiArrowRight />
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 style={{ color: 'white', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem' }}>
                                2. Admin Initialization
                                <span onClick={() => setStep(1)} style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', cursor: 'pointer', opacity: 0.8 }}>Edit Company Base</span>
                            </h3>

                            <div style={{ position: 'relative' }}>
                                <FiUser style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} size={18} />
                                <input type="text" name="adminName" placeholder="Full Administrator Name" className="input-field" style={{ paddingLeft: '42px' }} value={formData.adminName} onChange={handleChange} required />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} size={18} />
                                <input type="email" name="adminEmail" placeholder="Master Admin Email" className="input-field" style={{ paddingLeft: '42px' }} value={formData.adminEmail} onChange={handleChange} required />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--text-secondary)' }} size={18} />
                                <input type="password" name="adminPassword" placeholder="Secure Password" className="input-field" style={{ paddingLeft: '42px' }} value={formData.adminPassword} onChange={handleChange} required />
                            </div>

                            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                                {isSubmitting ? 'Instantiating Server...' : 'Launch Master Tenant Node'} <FiArrowRight />
                            </button>
                        </>
                    )}
                </form>

                <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-secondary)' }}>
                    Already configured a company? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}>Login securely</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
