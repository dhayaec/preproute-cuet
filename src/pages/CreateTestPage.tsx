import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'
import { tokens } from '@/shared/design-system/tokens'
import { useCreateTest } from '@/features/tests/hooks/useCreateTest'

const markingSchema = z.object({
  correctMarks: z.coerce.number().min(0),
  incorrectMarks: z.coerce.number().lte(0),
  unattemptedMarks: z.coerce.number().lte(0),
})

const schema = z.object({
  name: z.string().min(1, 'Test name required'),
  subject: z.string().min(1, 'Subject required'),
  topics: z.string().min(1, 'Topics required'),
  marking: markingSchema,
})

type FormData = z.infer<typeof schema>

export default function CreateTestPage() {
  const navigate = useNavigate()
  const createTest = useCreateTest()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      subject: '',
      topics: '',
      marking: { correctMarks: 4, incorrectMarks: -1, unattemptedMarks: 0 },
    },
  })

  const onSubmit = (data: FormData) => {
    const topics = data.topics
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    createTest.mutate(
      {
        name: data.name,
        subject: data.subject,
        topics,
        correct_marks: data.marking.correctMarks,
        wrong_marks: data.marking.incorrectMarks,
        unattempt_marks: data.marking.unattemptedMarks,
      },
      {
        onSuccess: () => navigate('/tests/questions'),
        onError: () => alert('Failed to create test.'),
      },
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className={tokens.heading}>Create Test</h2>
        <p className={`${tokens.subheading} mt-1`}>
          Set the name, subject, topics and marking scheme
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className={`${tokens.cardDark} p-6 space-y-5`}>
          <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider">
            Basic Details
          </h3>
          <div>
            <label className={tokens.label}>Test Name</label>
            <input
              {...register('name')}
              placeholder="e.g. Semester 1 Final"
              className={tokens.input}
            />
            {errors.name && <p className={tokens.error}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={tokens.label}>Subject</label>
            <input
              {...register('subject')}
              placeholder="e.g. Mathematics"
              className={tokens.input}
            />
            {errors.subject && <p className={tokens.error}>{errors.subject.message}</p>}
          </div>
          <div>
            <label className={tokens.label}>
              Topics <span className="text-[#6B7280] font-normal">(comma-separated)</span>
            </label>
            <input
              {...register('topics')}
              placeholder="e.g. Algebra, Geometry, Trigonometry"
              className={tokens.input}
            />
            {errors.topics && <p className={tokens.error}>{errors.topics.message}</p>}
          </div>
        </div>
        <div className={`${tokens.cardDark} p-6 space-y-5`}>
          <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wider">
            Marking Scheme
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={tokens.label}>Correct Answer</label>
              <input type="number" {...register('marking.correctMarks')} className={tokens.input} />
            </div>
            <div>
              <label className={tokens.label}>Incorrect Answer</label>
              <input
                type="number"
                {...register('marking.incorrectMarks')}
                className={tokens.input}
              />
            </div>
            <div>
              <label className={tokens.label}>Unattempted</label>
              <input
                type="number"
                {...register('marking.unattemptedMarks')}
                className={tokens.input}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={createTest.isPending}
            className={`${tokens.btnPrimary} flex items-center gap-2 px-6`}
          >
            {createTest.isPending ? 'Creating…' : 'Next: Add Questions'} <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}
