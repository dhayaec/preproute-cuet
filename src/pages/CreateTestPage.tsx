import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { tokens } from '@/shared/design-system/tokens'
import { useCreateTest } from '@/features/tests/hooks/useCreateTest'

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
  const navigate = useNavigate()
  const createTest = useCreateTest()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
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

  const onSubmit = (data: FormData) => {
    createTest.mutate(
      {
        name: data.name,
        subject: data.subject,
        type: tabType,
        topics: [data.topic, ...(data.subTopic ? [data.subTopic] : [])],
        duration: data.duration,
        difficulty: data.difficulty.toLowerCase(),
        correct_marks: data.correctMarks,
        wrong_marks: data.wrongMarks,
        unattempt_marks: data.unattemptedMarks,
        total_questions: data.totalQuestions,
        total_marks: data.totalMarks,
      },
      { onSuccess: () => navigate('/tests/questions'), onError: () => alert('Failed to create test.') },
    )
  }

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
      <div className="text-xs text-[#6B7280] mb-2">Create Test / Chapter Wise</div>
      <h2 className={tokens.heading}>Chapterwise</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className={`${tokens.cardDark} p-6 space-y-5`}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={tokens.label}>Subject</label>
              <select {...register('subject')} className={`${tokens.input} bg-white`}>
                <option value="">Choose from Drop-down</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
              {errors.subject && <p className={tokens.error}>{errors.subject.message}</p>}
            </div>
            <div>
              <label className={tokens.label}>Name of Test</label>
              <input {...register('name')} placeholder="Enter name of Test" className={tokens.input} />
              {errors.name && <p className={tokens.error}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={tokens.label}>Topic</label>
              <select {...register('topic')} className={`${tokens.input} bg-white`}>
                <option value="">Choose from Drop-down</option>
                <option>Algebra</option>
                <option>Geometry</option>
                <option>Trigonometry</option>
              </select>
              {errors.topic && <p className={tokens.error}>{errors.topic.message}</p>}
            </div>
            <div>
              <label className={tokens.label}>Sub Topic</label>
              <select {...register('subTopic')} className={`${tokens.input} bg-white`}>
                <option value="">Choose from Drop-down</option>
                <option>Linear Equations</option>
                <option>Quadratic Equations</option>
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
          <button type="submit" disabled={createTest.isPending} className={`${tokens.btnPrimary} flex items-center gap-2 px-6 py-2.5 text-sm`}>
            {createTest.isPending ? 'Creating…' : 'Next'} <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}
