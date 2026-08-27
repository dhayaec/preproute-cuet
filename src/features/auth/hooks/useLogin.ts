import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { queryKeys } from '@/shared/hooks/useQueryKeys';

export function useLogin() {
  return useMutation({
    mutationKey: queryKeys.auth.all,
    mutationFn: authApi.login,
    onSuccess: (res) => {
      if (res.data?.data?.token) localStorage.setItem('token', res.data.data.token);
    },
  });
}
