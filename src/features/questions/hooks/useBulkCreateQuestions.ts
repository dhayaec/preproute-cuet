import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionApi } from '../api/questionApi';
import { queryKeys } from '@/shared/hooks/useQueryKeys';
import type { Question } from '@/shared/types';

export function useBulkCreateQuestions() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...queryKeys.questions.all, 'bulkCreate'],
    mutationFn: (questions: Omit<Question, 'id'>[]) => questionApi.bulkCreate(questions),
    onSuccess: (_res, questions) => {
      const testId = questions[0]?.test_id;
      if (testId) qc.invalidateQueries({ queryKey: queryKeys.questions.list(testId) });
    },
  });
}
