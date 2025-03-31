
import { create } from 'zustand';

export type UserRole = 'user' | 'police' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// For demo purposes, hardcoded users
export const mockUsers = [
  {
    id: '1',
    name: 'John Citizen',
    email: 'john@example.com',
    password: 'password123',
    role: 'user' as UserRole,
  },
  {
    id: '2',
    name: 'Officer Smith',
    email: 'smith@police.gov',
    password: 'police123',
    role: 'police' as UserRole,
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@system.gov',
    password: 'admin123',
    role: 'admin' as UserRole,
  },
];

// Check login credentials against mock users
export const checkCredentials = (email: string, password: string) => {
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};
