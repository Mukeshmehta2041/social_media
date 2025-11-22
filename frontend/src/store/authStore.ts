import { create } from 'zustand';
import api from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  init: () => void;
}

// Load from localStorage on init
const loadAuthFromStorage = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user, isAuthenticated: !!(token && user) };
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...loadAuthFromStorage(),
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/local', {
        identifier: email,
        password,
      });

      const { jwt, user } = response.data;
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token: jwt, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/local/register', {
        username,
        email,
        password,
      });

      const { jwt, user } = response.data;
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token: jwt, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user, isAuthenticated: !!user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, isAuthenticated: !!token });
  },
  init: () => {
    const { token, user, isAuthenticated } = loadAuthFromStorage();
    set({ token, user, isAuthenticated });
  },
}));

