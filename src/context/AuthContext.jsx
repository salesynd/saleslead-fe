import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch(e) {
                console.error("Invalid user data in local storage");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await api.login(email, password);
            
            if (!data || !data.token) {
                console.error("Login response data:", data);
                throw new Error("Invalid response from server: Token missing");
            }
            
            localStorage.setItem('token', data.token);
            
            try {
                const base64Url = data.token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decoded = JSON.parse(jsonPayload);
                const userEmail = decoded.sub || email;
                
                let resolvedRole = 'SuperAdmin';
                const roleId = Number(decoded.roleId);
                const roleStr = String(decoded.role || '').toLowerCase();
                
                if (roleId === 1 || roleStr === 'admin') resolvedRole = 'Admin';
                else if (roleId === 2 || roleStr === 'user') resolvedRole = 'User';
                
                let companyId = decoded.companyId;
                let companyName = null;
                
                try {
                    if (companyId) {
                        const allComps = await api.getCompanies();
                        const dbComp = allComps.find(c => c.id === companyId);
                        if (dbComp) companyName = dbComp.companyname;
                    }
                } catch (err) {
                    console.warn("Could not fetch DB company name", err);
                }
                
                const userInfo = {
                    email: userEmail,
                    role: resolvedRole,
                    companyId: companyId,
                    companyName: companyName
                };
                
                localStorage.setItem('user', JSON.stringify(userInfo));
                setUser(userInfo);
            } catch (jwtError) {
                console.error("JWT Decode Error:", jwtError);
                // Fallback if token decoding fails
                const fallbackUser = { email, role: 'SuperAdmin' };
                localStorage.setItem('user', JSON.stringify(fallbackUser));
                setUser(fallbackUser);
            }
            
            return true;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
