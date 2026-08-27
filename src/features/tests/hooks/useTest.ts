import { useQuery } from '@tanstack/react-query'
import { testApi } from '../api/testApi'
import { queryKeys } from '@/shared/hooks/useQueryKeys'

export function useTest(id?: string) {
  return useQuery({
    queryKey: id ? queryKeys.tests.detail(id) : queryKeys.tests.all,
    queryFn: () => testApi.get(id!).then((r) => r.data?.data),
    enabled: !!id,
  })
}
