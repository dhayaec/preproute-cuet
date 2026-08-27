import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useTests } from '@/features/tests/hooks/useTests'
import { tokens } from '@/shared/design-system/tokens'

export default function DashboardPage() {
  const { data: tests = [], isLoading } = useTests()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 5

  const filtered = (tests || []).filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      (t.subject || '').toLowerCase().includes(query.toLowerCase()),
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="w-full">
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search tests..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              className="pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-sm text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1B5DEF]/30 w-72"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium text-[#374151] hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-sm text-[#374151] font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium text-[#374151] hover:bg-slate-100 disabled:opacity-40 transition"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

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
              <tr><td colSpan={4} className="px-5 py-4 text-[#6B7280]">Loading tests...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-4 text-[#6B7280]">No tests found.</td></tr>
            ) : (
              paginated.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-medium text-[#000A3A]">{t.name}</td>
                  <td className="px-5 py-3 text-[#374151]">{t.subject}</td>
                  <td className="px-5 py-3 text-[#374151]">{Array.isArray(t.topics) ? t.topics.join(', ') : ''}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${t.status === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{t.status}</span>
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
