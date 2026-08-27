import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { tokens } from '@/shared/design-system/tokens'

export default function PreviewPublishPage() {
  const navigate = useNavigate()
  const handlePublish = () => {
    alert('Published to backend!')
  }
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className={tokens.heading}>Preview & Publish</h2>
        <p className={`${tokens.subheading} mt-1`}>Review and publish the test</p>
      </div>
      <div className={`w-full max-w-3xl ${tokens.card} p-8 mb-8`}>
        <h3 className="font-bold text-lg mb-1 text-[#000A3A]">Math Midterm</h3>
        <p className="text-sm text-[#374151] mb-4">Mathematics · Algebra, Geometry</p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
          <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">Marking Scheme</div>
          <div className="flex gap-6 text-sm text-[#000A3A]">
            <span>
              Correct: <b>+4</b>
            </span>
            <span>
              Incorrect: <b>-1</b>
            </span>
            <span>
              Unattempted: <b>0</b>
            </span>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold mb-2 text-[#000A3A]">Sample Question</h4>
          <p className="text-sm mb-3 text-[#000A3A]">What is the value of 2+2?</p>
          <ul className="text-sm space-y-1 text-[#374151]">
            <li>A. 3</li>
            <li>
              B. 4 <span className="text-emerald-600 font-bold">(correct)</span>
            </li>
            <li>C. 5</li>
            <li>D. 6</li>
          </ul>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/tests/create')}
          className={`${tokens.btnSecondary} flex items-center gap-2 px-5 py-2.5 text-sm`}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handlePublish}
          className={`${tokens.btnPrimary} flex items-center gap-2 px-5 py-2.5 text-sm`}
        >
          <Send size={16} /> Publish
        </button>
      </div>
    </div>
  )
}
