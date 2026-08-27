import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { tokens } from '@/shared/design-system/tokens'

type Question = { id: number; text: string; options: string[]; correct: string }

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: 'What is the value of 2+2?', options: ['3', '4', '5', '6'], correct: '4' },
  ])

  const add = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: '', options: ['', '', '', ''], correct: '' },
    ])
  }
  const remove = (id: number) => setQuestions(questions.filter((q) => q.id !== id))

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className={tokens.heading}>Add Questions</h2>
          <p className={`${tokens.subheading} mt-1`}>MCQ-format questions with options</p>
        </div>
        <button
          onClick={add}
          className={`${tokens.btnPrimary} flex items-center gap-2 px-4 py-2 text-sm`}
        >
          <Plus size={16} /> Add Question
        </button>
      </div>
      <div className="space-y-5">
        {questions.map((q) => (
          <div key={q.id} className={`${tokens.cardDark} p-6 relative`}>
            <button
              onClick={() => remove(q.id)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#DC2626] transition"
            >
              <Trash2 size={16} />
            </button>
            <textarea
              defaultValue={q.text}
              placeholder="Question text"
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1B5DEF]/40 resize-none min-h-[80px] mb-3"
            />
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-2"
                >
                  <span className="text-xs text-[#1B5DEF] font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input
                    defaultValue={opt}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="bg-transparent text-sm w-full text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
