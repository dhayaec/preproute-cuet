import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { tokens } from '@/shared/design-system/tokens'
import { useCreateTest } from '@/features/tests/hooks/useCreateTest'
import { useTest } from '@/features/tests/hooks/useTest'
import { useSubjects, useTopics, useSubTopics } from '@/features/subjects/hooks/useSubjects'
import { testApi } from '@/features/tests/api/testApi'

const schema = z.object({
  name: z.string().min(1, 'Test name required'),
  subject: z.string().min(1, 'Subject required'),
  topic: z.string().min(1, 'Topic required'),
  subTopic: z.string().optional(),
  duration: z.coerce.number().min(1, 'Duration required'),
  difficulty: z.enum(['Easy', 'Medium', 'Difficult']),
  correctMarks: z.coerce.number().min(0),
  wrongMarks: z.coerce.number(),
  unattemptedMarks: z.coerce.number().min(0),
  totalQuestions: z.coerce.number().min(1),
  totalMarks: z.coerce.number().min(1),
})

type FormData = z.infer<typeof schema>

export default function CreateTestPage() {
  const [tabType, setTabType] = useState<'chapterwise' | 'pyq' | 'mock'>('chapterwise')
  const [apiError, setApiError] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const { id: editId } = useParams<{ id?: string }>()
  const isEdit = !!editId

  const { data: test, isLoading: testLoading } = useTest(editId)
  const createTest = useCreateTest()

  const { register, handleSubmit, control, reset, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: '',
      subject: '',
      topic: '',
      subTopic: '',
      duration: 60,
      difficulty: 'Medium',
      correctMarks: 5,
      wrongMarks: -1,
      unattemptedMarks: 0,
      totalQuestions: 50,
      totalMarks: 250,
    },
  })

  const selectedSubject = useWatch({ control, name: 'subject' })
  const selectedTopic = useWatch({ control, name: 'topic' })
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects()
  const { data: topics = [], isLoading: topicsLoading } = useTopics(selectedSubject || undefined)
  const { data: subTopics = [], isLoading: subTopicsLoading } = useSubTopics(selectedTopic || undefined)

  // Populate form when editing
  useEffect(() => {
    if (isEdit && test && subjects.length) {
      // /api/test/:id returns the subject as a UUID; map to its name for display
      const subjectMatch = (subjects as any[]).find((s) => s.id === test.subject || s.name === test.subject)
      const subjectId = subjectMatch?.id || test.subject
      // topics[0] may be UUID or name; match against loaded topics
      const topicMatch = (topics as any[]).find((t) => t.id === test.topics?.[0] || t.name === test.topics?.[0])
      const topicId = topicMatch?.id || test.topics?.[0] || ''
      const subTopicMatch = (subTopics as any[]).find((st) => {
        const apiValue = (test.sub_topics?.[0] !== undefined && test.sub_topics?.[0] !== null)
          ? test.sub_topics?.[0]
          : test.topics?.[1]
        return st.id === apiValue || st.name === apiValue
      })
      const subTopicId = subTopicMatch?.id || (test.sub_topics?.[0] || test.topics?.[1]) || ''
      reset({
        name: test.name || '',
        subject: subjectId,
        topic: topicId,
        subTopic: subTopicId,
        duration: test.duration ?? test.total_time ?? 60,
        difficulty: (test.difficulty === 'easy' ? 'Easy' : test.difficulty === 'medium' ? 'Medium' : 'Difficult') as any,
        correctMarks: test.correct_marks ?? 5,
        wrongMarks: test.wrong_marks ?? -1,
        unattemptedMarks: test.unattempt_marks ?? 0,
        totalQuestions: test.total_questions ?? 50,
        totalMarks: test.total_marks ?? 250,
      })
    }
  }, [isEdit, test, subjects, reset])

  // Reset topic + subTopic when subject changes (skip during initial edit populate)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { if (isEdit && test && subjects.length && selectedSubject) setHydrated(true) }, [isEdit, test, subjects, selectedSubject])
  useEffect(() => { if (hydrated && selectedSubject && selectedSubject !== (test?.subject || '')) reset({ ...getValues(), topic: '', subTopic: '' }) }, [selectedSubject, hydrated, test])
  useEffect(() => { if (hydrated) reset({ ...getValues(), subTopic: '' }) }, [selectedTopic, hydrated])

  const onSubmit = (data: FormData) => {
    if (subjectsLoading || !subjects.length || !topics.length || (selectedTopic && !subTopics.length && data.subTopic)) return
    setApiError({})
    // Map dropdown-bound names back to UUIDs for the API
    const subjectId = data.subject
    const topicId = data.topic
    const subTopicId = data.subTopic
    const payload = {
      name: data.name,
      subject: subjectId,
      topics: [topicId],
      sub_topics: subTopicId ? [subTopicId] : [],
      total_time: data.duration,
      duration: data.duration,
      difficulty: data.difficulty.toLowerCase(),
      correct_marks: data.correctMarks,
      wrong_marks: data.wrongMarks,
      unattempt_marks: data.unattemptedMarks,
      total_questions: data.totalQuestions,
      total_marks: data.totalMarks,
      status: (test as any)?.status ?? 'draft',
    }
    if (isEdit && editId) {
      testApi
        .update(editId, payload)
        .then(() => navigate(`/tests/questions?testId=${editId}`))
        .catch((err: any) => {
          const body = err?.response?.data
          if (body && typeof body === 'object') {
            const fieldErrors: Record<string, string> = {}
            for (const [key, val] of Object.entries(body)) {
              if (Array.isArray(val)) fieldErrors[key] = val.join(' ')
              else if (typeof val === 'string') fieldErrors[key] = val
            }
            if (body.message && Object.keys(fieldErrors).length === 0) {
              setApiError({ _form: body.message })
            } else {
              setApiError(fieldErrors)
            }
          } else {
            setApiError({ _form: err?.message || 'Failed to update test.' })
          }
        })
      return
    }
    createTest.mutate(
      { ...payload, status: isEdit ? (test?.status ?? "draft") : "draft", type: tabType } as any,
      {
        onSuccess: (res: any) => {
          const testId = res?.data?.id
          if (testId) navigate(`/tests/questions?testId=${testId}`)
          else navigate('/tests/questions')
        },
        onError: (err: any) => {
          const status = err?.response?.status
          const body = err?.response?.data
          if (status === 400 && body && typeof body === 'object') {
            const fieldErrors: Record<string, string> = {}
            for (const [key, val] of Object.entries(body)) {
              if (Array.isArray(val)) fieldErrors[key] = val.join(' ')
              else if (typeof val === 'string') fieldErrors[key] = val
            }
            if (body.message && Object.keys(fieldErrors).length === 0) {
              setApiError({ _form: body.message })
            } else {
              setApiError(fieldErrors)
            }
          } else {
            setApiError({ _form: err?.message || 'Failed to create test.' })
          }
        },
      },
    )
  }

  const submitting = createTest.isPending
  const loading = testLoading

  return (
    <div className="w-full">
      <div className="mb-6 flex gap-2">
        {(['Chapterwise', 'PYQ', 'Mock Test'] as const).map((t) => {
          const val = t === 'Chapterwise' ? 'chapterwise' : t === 'PYQ' ? 'pyq' : 'mock'
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTabType(val)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${tabType === val ? 'bg-[#1B5DEF] text-white border-[#1B5DEF]' : 'bg-white text-[#374151] border-[#60A5FA]/40 hover:bg-slate-50'}`}
            >
              {t}
            </button>
          )
        })}
      </div>
      <div className="text-xs text-[#6B7280] mb-2">{isEdit ? 'Edit Test' : 'Create Test'} / Chapter Wise</div>
      <h2 className={tokens.heading}>{isEdit ? 'Edit Test' : 'Chapterwise'}</h2>
      {apiError._form && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{apiError._form}</div>
      )}
      {isEdit && loading ? (
        <p className="text-sm text-[#6B7280]">Loading…</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className={`${tokens.cardDark} p-6 space-y-5`}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={tokens.label}>Subject</label>
                <select {...register('subject')} className={`${tokens.input} bg-white`} disabled={subjectsLoading}>
                  <option value="">{subjectsLoading ? 'Loading subjects…' : 'Choose from Drop-down'}</option>
                  {(subjects || []).map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {errors.subject && <p className={tokens.error}>{errors.subject.message}</p>}
                {apiError.subject && <p className={tokens.error}>{apiError.subject}</p>}
              </div>
              <div>
                <label className={tokens.label}>Name of Test</label>
                <input {...register('name')} placeholder="Enter name of Test" className={tokens.input} />
                {errors.name && <p className={tokens.error}>{errors.name.message}</p>}
              </div>
              <div>
                <label className={tokens.label}>Topic</label>
                <select {...register('topic')} className={`${tokens.input} bg-white`} disabled={!selectedSubject}>
                  <option value="">{selectedSubject ? 'Choose from Drop-down' : 'Select a subject first'}</option>
                  {(topics || []).map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {errors.topic && <p className={tokens.error}>{errors.topic.message}</p>}
              </div>
              <div>
                <label className={tokens.label}>Sub Topic</label>
                <select {...register('subTopic')} className={`${tokens.input} bg-white`} disabled={!selectedTopic}>
                  <option value="">{selectedTopic ? 'Choose from Drop-down' : 'Select a topic first'}</option>
                  {(subTopics || []).map((st: any) => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider mb-4">Test Configuration</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={tokens.label}>Duration (Minutes)</label>
                  <input type="number" {...register('duration')} placeholder="Enter the time" className={tokens.input} />
                  {errors.duration && <p className={tokens.error}>{errors.duration.message}</p>}
                </div>
                <div>
                  <label className={tokens.label}>Test Difficulty Level</label>
                  <div className="flex gap-4 pt-2">
                    {(['Easy', 'Medium', 'Difficult'] as const).map((d) => (
                      <label key={d} className="flex items-center gap-2 text-sm text-[#374151]">
                        <input type="radio" value={d} {...register('difficulty')} className="accent-[#1B5DEF]" />
                        <span>{d}</span>
                      </label>
                    ))}
                  </div>
                  {errors.difficulty && <p className={tokens.error}>{errors.difficulty.message}</p>}
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider mb-4">Marking Scheme</h3>
              <div className="grid gap-4 sm:grid-cols-5">
                <div>
                  <label className={tokens.label}>Wrong Answer</label>
                  <input type="number" {...register('wrongMarks')} className={`${tokens.input} text-center`} defaultValue={-1} />
                </div>
                <div>
                  <label className={tokens.label}>Unattempted</label>
                  <input type="number" {...register('unattemptedMarks')} className={`${tokens.input} text-center`} defaultValue={0} />
                </div>
                <div>
                  <label className={tokens.label}>Correct Answer</label>
                  <input type="number" {...register('correctMarks')} className={`${tokens.input} text-center`} defaultValue={5} />
                </div>
                <div>
                  <label className={tokens.label}>No of Questions</label>
                  <input type="number" {...register('totalQuestions')} placeholder="Ex: 50" className={tokens.input} />
                </div>
                <div>
                  <label className={tokens.label}>Total Marks</label>
                  <input type="number" {...register('totalMarks')} placeholder="Ex: 250" className={tokens.input} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/')} className={`${tokens.btnSecondary} px-5 py-2.5 text-sm`}>
              Cancel
            </button>
            <button type="submit" disabled={submitting || subjectsLoading || topicsLoading || subTopicsLoading || !topics.length || (selectedTopic && !subTopics.length && !!getValues('subTopic'))} className={`${tokens.btnPrimary} flex items-center gap-2 px-6 py-2.5 text-sm`}>
              {submitting ? (isEdit ? 'Saving…' : 'Creating…') : isEdit ? 'Save' : 'Next'} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
