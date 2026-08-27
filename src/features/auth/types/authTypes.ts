import type { AuthUser } from '@/shared/types';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}
