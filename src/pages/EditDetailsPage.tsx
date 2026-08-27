import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { tokens } from '@/shared/design-system/tokens'
import { useTest } from '@/features/tests/hooks/useTest'
import { testApi } from '@/features/tests/api/testApi'

const schema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  topic: z.string().min(1),
  subTopic: z.string().optional(),
  duration: z.coerce.number().min(1),
  difficulty: z.enum(['Easy', 'Medium', 'Difficult']),
  correctMarks: z.coerce.number().min(0),
  wrongMarks: z.coerce.number().min(0),
  unattemptedMarks: z.coerce.number().min(0),
  totalQuestions: z.coerce.number().min(1),
  totalMarks: z.coerce.number().min(1),
})

type FormData = z.infer<typeof schema>

export default function EditDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const { data: test, isLoading } = useTest(id)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: '', subject: '', topic: '', subTopic: '', duration: 60,
      difficulty: 'Medium', correctMarks: 5, wrongMarks: -1, unattemptedMarks: 0,
      totalQuestions: 50, totalMarks: 250,
    },
  })

  useEffect(() => {
    if (test) {
      reset({
        name: test.name || '',
        subject: test.subject || '',
        topic: (test.topics?.[0] || ''),
        subTopic: (test.topics?.[1] || ''),
        duration: test.duration ?? 60,
        difficulty: (test.difficulty === 'easy' ? 'Easy' : test.difficulty === 'medium' ? 'Medium' : 'Difficult') as any,
        correctMarks: test.correct_marks ?? 5,
        wrongMarks: test.wrong_marks ?? -1,
        unattemptedMarks: test.unattempt_marks ?? 0,
        totalQuestions: test.total_questions ?? 50,
        totalMarks: test.total_marks ?? 250,
      })
    }
  }, [test, reset])

  const onSubmit = async (data: FormData) => {
    if (!id) return
    setSaving(true)
    try {
      await testApi.update(id, {
        name: data.name,
        subject: data.subject,
        topics: [data.topic, ...(data.subTopic ? [data.subTopic] : [])],
        duration: data.duration,
        difficulty: data.difficulty.toLowerCase(),
        correct_marks: data.correctMarks,
        wrong_marks: data.wrongMarks,
        unattempt_marks: data.unattemptedMarks,
        total_questions: data.totalQuestions,
        total_marks: data.totalMarks,
      })
      navigate('/')
    } catch {
      alert('Failed to update.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex gap-2">
        {['Chapterwise', 'PYQ', 'Mock Test'].map((t) => (
          <button
            key={t}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${t === 'Chapterwise' ? 'bg-[#1B5DEF] text-white border-[#1B5DEF]' : 'bg-white text-[#374151] border-[#60A5FA]/40 hover:bg-slate-50'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <h2 className={tokens.heading}>Edit Test / Chapter Wise</h2>
      {isLoading ? <p>Loading…</p> : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className={`${tokens.cardDark} p-6 space-y-5`}>
              <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider">Basic Details</h3>
              <div><label className={tokens.label}>Subject</label>
                <select {...register('subject')} className={`${tokens.input} bg-white`}>
                  <option>Mathematics</option><option>Physics</option><option>Chemistry</option></select>
                {errors.subject && <p className={tokens.error}>{errors.subject.message}</p>}
              </div>
              <div><label className={tokens.label}>Name of Test</label>
                <input {...register('name')} className={tokens.input} />
                {errors.name && <p className={tokens.error}>{errors.name.message}</p>}
              </div>
              <div><label className={tokens.label}>Topic</label>
                <select {...register('topic')} className={`${tokens.input} bg-white`}>
                  <option>Algebra</option><option>Geometry</option><option>Trigonometry</option></select>
                {errors.topic && <p className={tokens.error}>{errors.topic.message}</p>}
              </div>
              <div><label className={tokens.label}>Sub Topic</label>
                <select {...register('subTopic')} className={`${tokens.input} bg-white`}>
                  <option>Linear Equations</option><option>Quadratic Equations</option></select>
              </div>
            </div>
            <div className={`${tokens.cardDark} p-6 space-y-5`}>
              <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider">Test Configuration</h3>
              <div><label className={tokens.label}>Duration (Minutes)</label>
                <input type="number" {...register('duration')} className={tokens.input} />
                {errors.duration && <p className={tokens.error}>{errors.duration.message}</p>}
              </div>
              <div><label className={tokens.label}>Test Difficulty Level</label>
                <div className="flex gap-4">
                  {(['Easy','Medium','Difficult'] as const).map(d => (
                    <label key={d} className="flex items-center gap-2 text-sm text-[#374151]"><input type="radio" value={d} {...register('difficulty')} className="accent-[#1B5DEF]" />{d}</label>
                  ))}
                </div>
                {errors.difficulty && <p className={tokens.error}>{errors.difficulty.message}</p>}
              </div>
            </div>
          </div>
          <div className={`${tokens.cardDark} p-6`}>
            <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider mb-4">Marking Scheme</h3>
            <div className="grid gap-4 sm:grid-cols-5">
              <div><label className={tokens.label}>Wrong Answer</label><input type="number" {...register('wrongMarks')} className={`${tokens.input} text-center`} /></div>
              <div><label className={tokens.label}>Unattempted</label><input type="number" {...register('unattemptedMarks')} className={`${tokens.input} text-center`} /></div>
              <div><label className={tokens.label}>Correct Answer</label><input type="number" {...register('correctMarks')} className={`${tokens.input} text-center`} /></div>
              <div><label className={tokens.label}>No of Questions</label><input type="number" {...register('totalQuestions')} placeholder="Ex: 50" className={tokens.input} /></div>
              <div><label className={tokens.label}>Total Marks</label><input type="number" {...register('totalMarks')} placeholder="Ex: 250" className={tokens.input} /></div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/')} className={`${tokens.btnSecondary} px-5 py-2.5 text-sm`}><ArrowLeft size={16} className="mr-1 inline"/>Back</button>
            <button type="submit" disabled={saving} className={`${tokens.btnPrimary} px-6 py-2.5 text-sm`}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      )}
    </div>
  )
}
