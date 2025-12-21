import { create } from 'zustand';
import api from '../services/api';

const useCustomerStore = create((set) => ({
    customers: [],
    loading: false,
    error: null,

    fetchCustomers: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/customers');
            set({ customers: response.data, loading: false });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.error || 'Failed to fetch customers'
            });
        }
    },

    addCustomer: async (customerData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/customers', customerData);
            set((state) => ({
                customers: [response.data, ...state.customers],
                loading: false
            }));
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.error || 'Failed to add customer'
            });
            throw error;
        }
    },
}));

export default useCustomerStore;
