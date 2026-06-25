import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { user, token } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      
      set({ user, token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials.';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, loading: false });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.user, token, isAuthenticated: true, loading: false });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  }
}));