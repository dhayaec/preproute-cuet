import { http, type ApiResponse } from '@/shared/lib/http';
import type { Question } from '@/shared/types';

export const questionApi = {
  bulkCreate: (questions: Omit<Question, 'id'>[]) =>
    http.post<ApiResponse<Question[]>>('/questions/bulk', { questions }),
  fetchBulk: (question_ids: string[]) =>
    http.post<ApiResponse<Question[]>>('/questions/fetchBulk', { question_ids }),
};
