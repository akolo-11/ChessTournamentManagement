import type { UserRole } from '../types';

interface AuthState {
  role: UserRole;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  // TODO: заменить на реальную авторизацию
  const isAdmin = true;
  return {
    role: isAdmin ? 'admin' : 'viewer',
    isAdmin,
  };
}