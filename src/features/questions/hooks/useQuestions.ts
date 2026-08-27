import { useQuery } from '@tanstack/react-query';
import { questionApi } from '../api/questionApi';
import { queryKeys } from '@/shared/hooks/useQueryKeys';

export function useQuestions(testId?: string) {
  return useQuery({
    queryKey: testId ? queryKeys.questions.list(testId) : queryKeys.questions.all,
    queryFn: () => (testId ? questionApi.listByTest(testId).then((r: any) => r.data?.data || r.data || []) : Promise.resolve([])),
    enabled: !!testId,
  });
}
