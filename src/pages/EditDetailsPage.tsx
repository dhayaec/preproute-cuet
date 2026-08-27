import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { tokens } from '@/shared/design-system/tokens'
import { useTests } from '@/features/tests/hooks/useTests'

export default function EditDetailsPage() {
  const { data: tests = [], isLoading } = useTests()
  const [editing, setEditing] = useState<{ id: string; name: string; subject: string } | null>(null)
  const [draftName, setDraftName] = useState('')
  const [draftSubject, setDraftSubject] = useState('')

  const start = (t: { id: string; name: string; subject: string }) => {
    setEditing(t)
    setDraftName(t.name)
    setDraftSubject(t.subject)
  }

  const save = () => {
    if (!editing) return
    alert(`Saved: ${draftName} / ${draftSubject}`)
    setEditing(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className={tokens.heading}>Edit Test Details</h2>
        <p className={`${tokens.subheading} mt-1`}>
          Update name, subject, topics and marking scheme
        </p>
      </div>
      {isLoading ? (
        <p className={tokens.subheading}>Loading tests...</p>
      ) : (
        <div className="space-y-3">
          {(tests || []).map((t) => (
            <div key={t.id} className={`${tokens.cardDark} p-5 flex items-center justify-between`}>
              <div>
                <div className="font-semibold text-[#000A3A]">{t.name}</div>
                <div className="text-sm text-[#374151] mt-0.5">
                  {t.subject} · {Array.isArray(t.topics) ? t.topics.join(', ') : ''}
                </div>
              </div>
              <button
                onClick={() => start({ id: String(t.id), name: t.name, subject: t.subject })}
                className={`${tokens.btnSecondary} flex items-center gap-2 text-sm`}
              >
                <Pencil size={14} /> Edit
              </button>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className={`${tokens.card} p-6 w-full max-w-md`}>
            <h3 className="text-lg font-bold mb-5 text-[#000A3A]">Edit: {editing.name}</h3>
            <div className="space-y-4">
              <div>
                <label className={tokens.label}>Name</label>
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className={tokens.input}
                />
              </div>
              <div>
                <label className={tokens.label}>Subject</label>
                <input
                  value={draftSubject}
                  onChange={(e) => setDraftSubject(e.target.value)}
                  className={tokens.input}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditing(null)}
                className={`${tokens.btnSecondary} px-4 py-2 text-sm`}
              >
                Cancel
              </button>
              <button onClick={save} className={`${tokens.btnPrimary} px-4 py-2 text-sm`}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
