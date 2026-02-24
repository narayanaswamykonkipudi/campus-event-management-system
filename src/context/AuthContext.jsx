import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('cems_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('cems_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const foundUser = users.find(
            u => u.email === email && u.password === password
        );
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('cems_user', JSON.stringify(foundUser));
            return { success: true, role: foundUser.role };
        }
        return { success: false };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cems_user');
    };

    const getDashboardPath = (role) => {
        if (role === 'admin') return '/admin/dashboard';
        if (role === 'faculty') return '/faculty/dashboard';
        return '/student/dashboard';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, getDashboardPath }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
