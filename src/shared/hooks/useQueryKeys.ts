export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  tests: {
    all: ['tests'] as const,
    list: () => [...queryKeys.tests.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.tests.all, 'detail', id] as const,
  },
  questions: {
    all: ['questions'] as const,
    list: (testId: string) => [...queryKeys.questions.all, 'list', testId] as const,
    bulk: (ids: string[]) => [...queryKeys.questions.all, 'bulk', ...ids.sort()] as const,
  },
  subjects: {
    all: ['subjects'] as const,
    list: () => [...queryKeys.subjects.all, 'list'] as const,
    topics: (subjectId: string) => [...queryKeys.subjects.all, 'topics', subjectId] as const,
    subTopics: (topicId: string) => [...queryKeys.subjects.all, 'subTopics', topicId] as const,
  },
} as const;
