import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { tokens } from '@/shared/design-system/tokens'
import { testApi } from '@/features/tests/api/testApi'

export default function PreviewPublishPage() {
  const [searchParams] = useSearchParams()
  const testId = searchParams.get('testId') || ''
  const navigate = useNavigate()

  const [test, setTest] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!testId) { setLoading(false); return }
    Promise.all([
      testApi.get(testId).catch((e) => { console.error('testApi.get failed', e); return null }),
    ]).then(([t]: any) => {
      setTest(t?.data || t || null)
      const qs = (t?.data || t)?.questions || t?.questions || []
      setQuestions(Array.isArray(qs) ? qs : [])
      setLoading(false)
    })
  }, [testId])

  const handlePublish = () => {
    if (!testId) { setStatus('error'); setMessage('No test ID found.'); return }
    testApi.publish(testId)
      .then(() => { setStatus('success'); setMessage('Test published successfully!') })
      .catch((err: any) => { setStatus('error'); setMessage(err?.message || 'Failed to publish test.') })
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-8"><h2 className={tokens.heading}>Preview & Publish</h2></div>
        <p className="text-sm text-[#6B7280]">Loading…</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className={tokens.heading}>Preview & Publish</h2>
        <p className={`${tokens.subheading} mt-1`}>Review and publish the test</p>
      </div>

      {status === 'success' && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">{message}</div>
      )}
      {status === 'error' && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{message}</div>
      )}

      <div className={`w-full max-w-3xl ${tokens.card} p-8 mb-8`}>
        <h3 className="font-bold text-lg mb-1 text-[#000A3A]">{test?.name || 'Test Preview'}</h3>
        <p className="text-sm text-[#374151] mb-4">{test?.subject || ''}</p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
          <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">Marking Scheme</div>
          <div className="flex gap-6 text-sm text-[#000A3A]">
            <span>Correct: <b>+{test?.correct_marks ?? 5}</b></span>
            <span>Incorrect: <b>{test?.wrong_marks ?? -1}</b></span>
            <span>Unattempted: <b>{test?.unattempt_marks ?? 0}</b></span>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold mb-3 text-[#000A3A]">Questions ({questions.length})</h4>
          {questions.length > 0 ? (
            <div className="space-y-2">
              {questions.map((q: any, i: number) => (
                <div key={q.id || i} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#1B5DEF] text-white text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm text-[#000A3A] font-medium mb-2">{q.question || '(No question text)'}</p>
                      <div className="grid grid-cols-2 gap-1 text-xs text-[#374151]">
                        {['option1','option2','option3','option4'].map((k) => (
                          <div key={k} className={`px-2 py-1 rounded ${q.correct_option === k ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'bg-slate-50'}`}>
                            {k === 'option1' ? 'A' : k === 'option2' ? 'B' : k === 'option3' ? 'C' : 'D'}. {q[k] || '—'}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <p className="text-xs text-[#6B7280] mt-2 italic">💡 {q.explanation}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-[#374151]">{q.difficulty || 'easy'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{q.status || 'draft'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">No questions added yet. <button onClick={() => navigate('/tests/questions/' + testId)} className="text-[#1B5DEF] underline">Add questions →</button></p>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate('/tests/questions/' + testId)} className={`${tokens.btnSecondary} flex items-center gap-2 px-5 py-2.5 text-sm`}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={handlePublish} className={`${tokens.btnPrimary} flex items-center gap-2 px-5 py-2.5 text-sm`}>
          <Send size={16} /> Publish
        </button>
      </div>
    </div>
  )
}
