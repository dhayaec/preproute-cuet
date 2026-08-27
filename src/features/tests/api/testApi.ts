import { http, type ApiResponse } from '@/shared/lib/http';
import type { Test } from '@/shared/types';

export const testApi = {
  list: () => http.get<ApiResponse<Test[]>>('/tests'),
  get: (id: string) => http.get<ApiResponse<Test>>(`/tests/${id}`),
  create: (data: Partial<Test>) => http.post<ApiResponse<Test>>('/tests', data),
  update: (id: string, data: Partial<Test>) => http.put<ApiResponse<Test>>(`/tests/${id}`, data),
  publish: (id: string) => http.put<ApiResponse<Test>>(`/tests/${id}`, { status: 'live' }),
};
