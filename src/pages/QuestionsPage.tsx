import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { tokens } from '@/shared/design-system/tokens'
import { useTest } from '@/features/tests/hooks/useTest'
import { questionApi } from '@/features/questions/api/questionApi'

export default function QuestionsPage() {
  const [searchParams] = useSearchParams()
  const testId = searchParams.get('testId') || ''
  const navigate = useNavigate()

  const { data: test } = useTest(testId)

  const [questions, setQuestions] = useState(() => {
    const id = crypto.randomUUID()
    return [{ id, type: 'mcq', question: '', option1: '', option2: '', option3: '', option4: '', correct_option: '', explanation: '', difficulty: 'easy', status: 'draft', test_id: testId }]
  })
  const [current, setCurrent] = useState<string>('') as any
  useEffect(() => { if (!current && questions.length) setCurrent(questions[0].id) }, [current, questions])
  const [errors, setErrors] = useState<Record<string | number, string>>({})
  const questionRef = useRef<HTMLTextAreaElement>(null)

  const currentQ = questions.find((q) => q.id === current) || questions[0]

  const add = () => {
    const nextId = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
      ? (crypto as any).randomUUID()
      : `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const blank = { id: nextId, type: 'mcq', question: '', option1: '', option2: '', option3: '', option4: '', correct_option: '', explanation: '', difficulty: 'easy', status: 'draft', test_id: testId }
    setQuestions([...questions, blank])
    setCurrent(nextId as any)
  }

  const remove = (id: string | number) => {
    const filtered = questions.filter((q) => q.id !== id)
    setQuestions(filtered)
    if (filtered.length === 0) {
      add()
      return
    }
    if (!filtered.find((q) => q.id === current)) setCurrent(filtered[0].id)
    setErrors((e) => { const n = { ...e }; delete n[id]; return n })
  }

  const updateCurrent = (patch: Partial<typeof currentQ>) => {
    setQuestions(questions.map((q) => q.id === current ? { ...q, ...patch } : q))
    setErrors((e) => { const n = { ...e }; delete n[current]; return n })
  }

  const validate = (): boolean => {
    const newErrors: Record<number, string> = {}
    questions.forEach((q, i) => {
      if (!q.question.trim()) newErrors[q.id] = `Q${i + 1}: question is required`
      else if (!q.option1.trim() || !q.option2.trim() || !q.option3.trim() || !q.option4.trim())
        newErrors[q.id] = `Q${i + 1}: all 4 options required`
      else if (!q.correct_option)
        newErrors[q.id] = `Q${i + 1}: select correct option`
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const questionsPayload = questions.map((q) => ({
      type: q.type,
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      correct_option: q.correct_option,
      explanation: q.explanation,
      difficulty: q.difficulty,
      status: q.status,
      test_id: testId,
      subject: subjectId || subjectName,
    }))
    questionApi.bulkCreate(questionsPayload)
      .then((res: any) => navigate(`/tests/preview?testId=${testId}`))
      .catch((err: any) => setErrors({ _form: err?.response?.data?.message || err?.message || 'Failed to save questions' }))
  }

  const getCorrectLetter = () => {
    const idx = ['option1','option2','option3','option4'].findIndex((k) => k === currentQ?.correct_option)
    return idx >= 0 ? String.fromCharCode(65 + idx) : ''
  }

  const rawSubject = (test as any)?.subject
  const subjectObj = typeof rawSubject === 'object' && rawSubject !== null ? rawSubject : null
  const subjectId = (typeof rawSubject === 'string' ? rawSubject : subjectObj?.id) || ''
  const subjectName = (typeof rawSubject === 'string' ? rawSubject : (rawSubject as any)?.name) || ''
  const rawTopic = (test as any)?.topics?.[0]
  const topicName = (typeof rawTopic === 'object' && rawTopic !== null ? (rawTopic as any)?.name : rawTopic) || ''
  const rawSubTopic = (test as any)?.sub_topics?.[0]
  const subTopicName = (typeof rawSubTopic === 'object' && rawSubTopic !== null ? (rawSubTopic as any)?.name : rawSubTopic) || ''
  const duration = (test as any)?.total_time || 60
  const totalQ = (test as any)?.total_questions || 50
  const totalMarks = (test as any)?.total_marks || 250
  const difficulty = (test as any)?.difficulty || 'Easy'

  return (
    <div className="w-full">
      <div className="text-xs text-[#6B7280] mb-3">Test Creation / Create Test / Chapter Wise</div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={tokens.heading}>Chapterwise</h2>
        <button onClick={() => navigate(`/tests/preview?testId=${testId}`)} className={`${tokens.btnPrimary} px-4 py-2 text-sm`}>Preview</button>
      </div>

      {errors._form && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errors._form}</div>
      )}

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <aside className="bg-white border border-[#60A5FA]/40 rounded-xl p-3 h-fit overflow-y-auto max-h-[600px]">
          <div className="flex flex-col gap-1">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrent(q.id)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition whitespace-nowrap flex items-center gap-2 ${current === q.id ? 'bg-[#1B5DEF] text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
              >
                <span className="w-6 h-6 rounded-full bg-emerald-400 text-white text-[10px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                <span className="truncate">{q.question ? q.question.slice(0, 20) + (q.question.length > 20 ? '…' : '') : `Q${i + 1}`}</span>
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-[#6B7280]">{questions.length} questions</div>
          <button onClick={add} className={`${tokens.btnSecondary} text-xs px-3 py-1.5 mt-2 w-full`}>+ Add Question</button>
        </aside>

        <div>
          <input type="hidden" name="test_id" value={testId} />
          <input type="hidden" name="subject" value={subjectId || subjectName} />
          <input type="hidden" name="subject_name_display" value={subjectName} />
          <input type="hidden" name="topic" value={topicName} />
          <input type="hidden" name="sub_topic" value={subTopicName} />
          <div className={`${tokens.cardDark} p-6 mb-6 grid md:grid-cols-3 gap-4`}>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Subject</div>
              <div className="font-semibold text-[#000A3A]">{subjectName || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Topic</div>
              <div className="text-xs"><span className="bg-[#EAEAEA] px-1.5 py-0.5 rounded text-[10px]">{topicName || '—'}</span></div>
              {subTopicName && <div className="text-xs mt-1"><span className="bg-[#EAEAEA] px-1.5 py-0.5 rounded text-[10px]">{subTopicName}</span></div>}
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Duration</div>
              <div className="text-sm font-medium text-[#000A3A]">{duration} Min</div>
              <div className="flex gap-3 text-xs text-[#6B7280] mt-1"><span>{totalQ} Q's</span><span>{totalMarks} Marks</span></div>
            </div>
          </div>

          <div className={`${tokens.cardDark} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#000A3A]">Question {questions.findIndex((q) => q.id === current) + 1} / {questions.length}</h3>
            </div>

            {errors[current] && (
              <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">{errors[current]}</div>
            )}

            <button onClick={() => remove(current)} className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 mb-3">
              <Trash2 size={14} /> Delete
            </button>

            <textarea
              ref={questionRef}
              value={currentQ?.question || ''}
              onChange={(e) => updateCurrent({ question: e.target.value })}
              placeholder="Type your question here"
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1B5DEF]/40 resize-none min-h-[120px] mb-4"
            />

            <div className="mb-4">
              <h4 className="text-sm font-medium text-[#374151] mb-2">Options</h4>
              <div className="space-y-2">
                {['option1','option2','option3','option4'].map((k, i) => (
                  <div key={k} className="flex items-center gap-3 bg-white border border-slate-300 rounded-lg px-3 py-2.5">
                    <input
                      type="radio"
                      name="correct"
                      checked={currentQ?.correct_option === k}
                      onChange={() => updateCurrent({ correct_option: k })}
                      className="accent-[#1B5DEF]"
                    />
                    <span className="text-xs font-bold text-[#374151] w-4">{String.fromCharCode(65+i)}</span>
                    <input
                      value={(currentQ as any)?.[k] || ''}
                      onChange={(e) => updateCurrent({ [k]: e.target.value } as any)}
                      className="bg-transparent text-sm w-full text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none"
                      placeholder={`Option ${String.fromCharCode(65+i)}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-[#374151] mb-2">Solution / Explanation</h4>
              <textarea
                value={currentQ?.explanation || ''}
                onChange={(e) => updateCurrent({ explanation: e.target.value })}
                placeholder="Type explanation"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1B5DEF]/40 resize-none min-h-[80px]"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className={`${tokens.label} text-xs`}>Difficulty</label>
                <select
                  className={`${tokens.input} text-sm`}
                  value={currentQ?.difficulty || 'easy'}
                  onChange={(e) => updateCurrent({ difficulty: e.target.value })}
                >
                  <option>easy</option><option>medium</option><option>hard</option>
                </select>
              </div>
              <div>
                <label className={`${tokens.label} text-xs`}>Status</label>
                <select
                  className={`${tokens.input} text-sm`}
                  value={currentQ?.status || 'draft'}
                  onChange={(e) => updateCurrent({ status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                  <option value="unpublished">Unpublished</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div>
                <label className={`${tokens.label} text-xs`}>Correct Option</label>
                <input readOnly className={`${tokens.input} text-sm bg-slate-100`} value={getCorrectLetter()} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  const idx = questions.findIndex((q) => q.id === current)
                  if (idx > 0) setCurrent(questions[idx - 1].id)
                  setTimeout(() => questionRef.current?.focus(), 0)
                }}
                disabled={questions.findIndex((q) => q.id === current) === 0}
                className="bg-white hover:bg-slate-50 text-[#374151] font-semibold py-2.5 rounded-lg transition disabled:opacity-60 px-6 border border-slate-300 text-sm"
              >Prev</button>
              <button
                onClick={() => {
                  const idx = questions.findIndex((q) => q.id === current)
                  if (idx >= questions.length - 1) add()
                  else setCurrent(questions[idx + 1].id)
                  setTimeout(() => questionRef.current?.focus(), 0)
                }}
                className="bg-[#1B5DEF] hover:bg-[#1747B5] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 px-6 text-sm"
              >Next</button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => navigate(`/tests/create/${testId}`)} className={`${tokens.btnSecondary} px-5 py-2.5 text-sm`}>Exit</button>
            <button onClick={handleSave} className={`${tokens.btnPrimary} px-6 py-2.5 text-sm`}>Save & Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
