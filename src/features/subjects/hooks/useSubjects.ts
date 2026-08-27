import { useQuery } from '@tanstack/react-query';
import { subjectApi } from '../api/subjectApi';
import { queryKeys } from '@/shared/hooks/useQueryKeys';

export function useSubjects() {
  return useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: () => subjectApi.list().then((r) => (r.data?.data ? r.data.data : r.data ?? [])),
  });
}

export function useTopics(subjectId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subjects.topics(subjectId ?? ''),
    queryFn: () => subjectApi.topics(subjectId!).then((r) => (r.data?.data ? r.data.data : r.data ?? [])),
    enabled: !!subjectId,
  });
}

export function useSubTopics(topicId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subjects.subTopics(topicId ?? ''),
    queryFn: () => subjectApi.subTopics(topicId!).then((r) => (r.data?.data ? r.data.data : r.data ?? [])),
    enabled: !!topicId,
  });
}
