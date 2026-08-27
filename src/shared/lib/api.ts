import { http } from './http';
export const api = {
  get: (path: string) => http.get(path),
  post: (path: string, data: any) => http.post(path, data),
  put: (path: string, data: any) => http.put(path, data),
};
