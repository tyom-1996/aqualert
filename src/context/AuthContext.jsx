// /context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

// создаём контекст
export const AuthContext = createContext({
    isAuth: false,
    login: (token, refreshToken) => {},
    logout: () => {},
    initialized: false,
});

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [initialized, setInitialized] = useState(false);
    // проверяем localStorage при монтировании
    useEffect(() => {
        const hasToken = Boolean(localStorage.getItem('token'));
        setIsAuth(hasToken);
        setInitialized(true);
    }, []);

    // отслеживаем изменения из-других вкладок
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'token') {
                setIsAuth(Boolean(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // методы для входа/выхода
    const login = useCallback((token, refreshToken) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setIsAuth(true);
    }, []);

    const logout = useCallback(() => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('currentContext');
            localStorage.removeItem('otpExpire');
            localStorage.removeItem('otpExpire_login');
            localStorage.removeItem('otpExpire_recover');
            localStorage.removeItem('loginPhone');
        } catch (_) {
            /* ignore */
        }
        setIsAuth(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, login, logout,initialized  }}>
            {children}
        </AuthContext.Provider>
    );
};
