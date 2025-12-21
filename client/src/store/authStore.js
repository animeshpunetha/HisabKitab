import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, loading: false });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.error || 'Registration failed'
            });
            throw error;
        }
    },

    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, loading: false });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.error || 'Login failed'
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
