import { useQuery } from '@tanstack/react-query';
import { testApi } from '../api/testApi';
import { queryKeys } from '@/shared/hooks/useQueryKeys';
export function useTests() { return useQuery({ queryKey: queryKeys.tests.list(), queryFn: () => testApi.list().then(r=>r.data?.data ?? []) }); }
