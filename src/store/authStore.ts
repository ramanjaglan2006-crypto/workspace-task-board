import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  loginAt: number | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loginAt: null,
      setAuth: (token, user) => set({ token, user, loginAt: Date.now() }),
      logout: () => set({ token: null, user: null, loginAt: null }),
    }),
    { name: 'auth-storage' }
  )
);
