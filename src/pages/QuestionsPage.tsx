import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { tokens } from '@/shared/design-system/tokens'

export default function QuestionsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const testId = searchParams.get('testId') || ''

  const [questions, setQuestions] = useState([
    { id: 1, text: '', options: ['', '', '', ''], correct: '', explanation: '' },
  ])
  const [current, setCurrent] = useState(1)
  const [added, setAdded] = useState(false)

  const currentQ = questions.find((q) => q.id === current) || questions[0]
  const isFilled = !!(currentQ?.text?.trim() || currentQ?.options?.some((o: string) => o.trim()))

  const add = () => {
    if (!isFilled) return
    setAdded(true)
    const nextId = Date.now()
    setQuestions([...questions, { id: nextId, text: '', options: ['', '', '', ''], correct: '', explanation: '' }])
    setCurrent(nextId)
  }

  const remove = (id: number) => {
    const filtered = questions.filter((q) => q.id !== id)
    setQuestions(filtered)
    if (current > filtered.length) setCurrent(Math.max(1, filtered.length))
  }

  const canAdd = isFilled && questions.length < 50

  return (
    <div className="w-full">
      <div className="text-xs text-[#6B7280] mb-3">Test Creation / Create Test / Chapter Wise</div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={tokens.heading}>Chapterwise</h2>
        <button onClick={() => navigate(`/tests/preview?testId=${testId}`)} className={`${tokens.btnPrimary} px-4 py-2 text-sm`}>Publish</button>
      </div>

      <div className="grid md:grid-cols-[180px_1fr] gap-6">
        {/* Smaller left sidebar */}
        <aside className="bg-white border border-[#60A5FA]/40 rounded-xl p-3 h-fit">
          <h3 className="text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wide">Questions</h3>
          <div className="space-y-1">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrent(q.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center gap-2 transition ${current === q.id ? 'bg-[#1B5DEF]/10 text-[#1B5DEF] font-medium' : 'bg-slate-50 text-[#374151] hover:bg-slate-100'}`}
              >
                <span className="w-4 h-4 rounded-full bg-[#1B5DEF] text-white text-[9px] flex items-center justify-center font-bold">{i + 1}</span>
                <span className="truncate">{q.text || `Q${i + 1}`}</span>
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-[#6B7280]">{questions.length} questions</div>
        </aside>

        {/* Main editor */}
        <div>
          {/* Test info card */}
          <div className={`${tokens.cardDark} p-6 mb-6 grid md:grid-cols-3 gap-4`}>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Chapter</div>
              <div className="font-semibold text-[#000A3A]">Chapter 1</div>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">Easy</span>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Subject</div>
              <div className="font-medium text-[#374151]">English</div>
              <div className="text-xs text-[#6B7280] mt-1">Topic: <span className="bg-[#EAEAEA] px-1.5 py-0.5 rounded text-[10px]">Grammar</span> <span className="bg-[#EAEAEA] px-1.5 py-0.5 rounded text-[10px]">Writing</span></div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Sub Topic</div>
              <div className="text-xs"><span className="bg-[#EAEAEA] px-1.5 py-0.5 rounded text-[10px]">Application</span></div>
              <div className="flex gap-3 text-xs text-[#6B7280] mt-2">
                <span>60 Min</span><span>50 Q's</span><span>250 Marks</span>
              </div>
            </div>
          </div>

          {/* Question editor */}
          <div className={`${tokens.cardDark} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#000A3A]">Question {questions.findIndex((q) => q.id === current) + 1} / {questions.length}</h3>
              <div className="flex gap-2">
                <button onClick={() => add()} disabled={!canAdd} className={`${tokens.btnPrimary} text-xs px-3 py-1.5 disabled:opacity-40`}><Plus size={12}/> MCQ</button>
                <button className={`${tokens.btnSecondary} text-xs px-3 py-1.5`}>CSV</button>
              </div>
            </div>

            <button onClick={() => remove(current)} className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 mb-3">
              <Trash2 size={14} /> Delete All Edits
            </button>

            <textarea
              value={currentQ?.text || ''}
              onChange={(e) => {
                const val = e.target.value
                setQuestions(questions.map((q) => q.id === current ? { ...q, text: val } : q))
              }}
              placeholder="Type here"
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1B5DEF]/40 resize-none min-h-[120px] mb-4"
            />

            <div className="mb-4">
              <h4 className="text-sm font-medium text-[#374151] mb-2">Type the options below</h4>
              <div className="space-y-2">
                {currentQ?.options.map((opt: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-300 rounded-lg px-3 py-2.5">
                    <input type="radio" name="correct" checked={currentQ.correct === String.fromCharCode(65+i)} onChange={() => {
                      setQuestions(questions.map((q) => q.id === current ? { ...q, correct: String.fromCharCode(65+i) } : q))
                    }} className="accent-[#1B5DEF]" />
                    <input value={opt} onChange={(e) => {
                      const opts = [...currentQ.options]
                      opts[i] = e.target.value
                      setQuestions(questions.map((q) => q.id === current ? { ...q, options: opts } : q))
                    }} className="bg-transparent text-sm w-full text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none" placeholder="Type Option here" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-[#374151] mb-2">Add Solution</h4>
              <textarea
                value={currentQ?.explanation || ''}
                onChange={(e) => setQuestions(questions.map((q) => q.id === current ? { ...q, explanation: e.target.value } : q))}
                placeholder="Type here"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1B5DEF]/40 resize-none min-h-[80px]"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-6">
              <div>
                <label className={`${tokens.label} text-xs`}>Level of Difficulty</label>
                <select className={`${tokens.input} text-sm`}><option>Easy</option><option>Medium</option><option>Difficult</option></select>
              </div>
              <div>
                <label className={`${tokens.label} text-xs`}>Topic</label>
                <select className={`${tokens.input} text-sm`}><option>Grammar</option><option>Writing</option></select>
              </div>
              <div>
                <label className={`${tokens.label} text-xs`}>Sub-topic</label>
                <select className={`${tokens.input} text-sm`}><option>Application</option></select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button onClick={() => setCurrent((c) => Math.max(1, c - 1))} className={`${tokens.btnSecondary} px-3 py-1.5 text-xs`}><ChevronLeft size={14}/> Prev</button>
              <button onClick={() => setCurrent((c) => Math.min(questions.length, c + 1))} className={`${tokens.btnPrimary} px-3 py-1.5 text-xs`}>Next <ChevronRight size={14}/></button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => navigate(`/tests/create/${testId}`)} className={`${tokens.btnSecondary} px-5 py-2.5 text-sm`}>Exit Test Creation</button>
            <button onClick={() => navigate(`/tests/preview?testId=${testId}`)} className={`${tokens.btnPrimary} px-6 py-2.5 text-sm`}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
