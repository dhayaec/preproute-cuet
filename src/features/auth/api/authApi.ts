import { http, type ApiResponse } from '@/shared/lib/http';
import { type AuthUser } from '@/shared/types';

export const authApi = {
  login: (data: { userId: string; password: string }) =>
    http.post<ApiResponse<{ token: string; user: AuthUser }>>('/auth/login', data),
  me: () => http.get<ApiResponse<AuthUser>>('/auth/me'),
};
