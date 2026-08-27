import { useTests } from '@/features/tests/hooks/useTests'
import { tokens } from '@/shared/design-system/tokens'

export default function DashboardPage() {
  const { data: tests = [], isLoading } = useTests()

  return (
    <div>
      <h2 className={tokens.heading}>Dashboard</h2>
      <p className={`${tokens.subheading} mb-8`}>Overview of all tests</p>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Total Tests', value: String(tests?.length ?? 0), sub: 'Published' },
          { title: 'Active Questions', value: '86', sub: 'MCQ format' },
          { title: 'Pending Reviews', value: '3', sub: 'Awaiting approval' },
        ].map((card) => (
          <div key={card.title} className={`${tokens.cardDark} p-6`}>
            <div className="text-sm text-[#374151] font-medium">{card.title}</div>
            <div className="text-3xl font-extrabold mt-1 text-[#000A3A]">{card.value}</div>
            <div className="text-xs text-[#6B7280] mt-2">{card.sub}</div>
          </div>
        ))}
      </div>
      <div className={`mt-8 ${tokens.cardDark} overflow-hidden`}>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-[#374151] font-medium text-xs uppercase">
            <tr>
              <th className="px-5 py-3">Test Name</th>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Topics</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-5 py-4 text-[#6B7280]">
                  Loading tests...
                </td>
              </tr>
            ) : (
              (tests || []).map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-medium text-[#000A3A]">{t.name}</td>
                  <td className="px-5 py-3 text-[#374151]">{t.subject}</td>
                  <td className="px-5 py-3 text-[#374151]">
                    {Array.isArray(t.topics) ? t.topics.join(', ') : ''}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${t.status === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
