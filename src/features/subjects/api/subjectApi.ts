import { http, type ApiResponse } from '@/shared/lib/http';
import type { Subject, Topic, SubTopic } from '@/shared/types';

export const subjectApi = {
  list: () => http.get<ApiResponse<Subject[]>>('/subjects'),
  topics: (subjectId: string) => http.get<ApiResponse<Topic[]>>(`/topics/subject/${subjectId}`),
  subTopics: (topicId: string) => http.get<ApiResponse<SubTopic[]>>(`/sub-topics/topic/${topicId}`),
};
