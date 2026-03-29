import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from storage on mount
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        
        const userData = { ...data };
        delete userData.token;
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return data;
    };

    const registerCompany = async (payload) => {
        const { data } = await api.post('/auth/register', payload);
        localStorage.setItem('token', data.token);
        
        const userData = { ...data };
        delete userData.token;
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, registerCompany, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
