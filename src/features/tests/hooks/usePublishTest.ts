import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testApi } from '../api/testApi';
import { queryKeys } from '@/shared/hooks/useQueryKeys';

export function usePublishTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...queryKeys.tests.all, 'publish'],
    mutationFn: (id: string) => testApi.publish(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.tests.list() });
      qc.invalidateQueries({ queryKey: queryKeys.tests.detail(id) });
    },
  });
}
