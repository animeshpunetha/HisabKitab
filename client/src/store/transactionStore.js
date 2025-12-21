import { create } from 'zustand';
import api from '../services/api';

const useTransactionStore = create((set) => ({
    transactions: [],
    customer: null,
    stats: { totalToCollect: 0, totalToPay: 0 },
    loading: false,
    error: null,

    fetchTransactions: async (customerId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/transactions/${customerId}`);
            set({
                customer: response.data,
                transactions: response.data.transactions,
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.error || 'Failed to fetch transactions'
            });
        }
    },

    addTransaction: async (transactionData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/transactions', transactionData);
            set((state) => ({
                transactions: [response.data, ...state.transactions],
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.error || 'Failed to add transaction'
            });
            throw error;
        }
    },

    fetchDashboardStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/transactions/stats');
            set({ stats: response.data, loading: false });
        } catch (error) {
            console.error(error);
            set({ loading: false });
        }
    },

    deleteTransaction: async (transactionId) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/transactions/${transactionId}`);
            set((state) => ({
                transactions: state.transactions.filter((t) => t.id !== transactionId),
                loading: false
            }));
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.error || 'Failed to delete transaction'
            });
            throw error;
        }
    },

    updateTransaction: async (transactionId, transactionData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`/transactions/${transactionId}`, transactionData);
            set((state) => ({
                transactions: state.transactions.map((t) =>
                    t.id === transactionId ? { ...t, ...response.data } : t
                ),
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.error || 'Failed to update transaction'
            });
            throw error;
        }
    },

    // Messages
    messages: [],

    fetchMessages: async (customerId) => {
        // Don't set global loading true to avoid flickering if already loaded
        try {
            const response = await api.get(`/messages/${customerId}`);
            set({ messages: response.data });
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    },

    addMessage: async (formData) => {
        // formData must be FormData object for file upload
        try {
            const response = await api.post('/messages', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            set((state) => ({
                messages: [...state.messages, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error('Failed to send message', error);
            throw error;
        }
    }
}));

export default useTransactionStore;
