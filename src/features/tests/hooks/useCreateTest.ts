import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testApi } from '../api/testApi';
import { queryKeys } from '@/shared/hooks/useQueryKeys';
import type { Test } from '@/shared/types';

export function useCreateTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...queryKeys.tests.all, 'create'],
    mutationFn: (data: Partial<Test>) => testApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tests.list() }),
  });
}
