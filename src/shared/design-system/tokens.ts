// Design tokens extracted from figma/login.svg
// Run any page through these instead of hardcoded classes.

export const palette = {
  bg: '#F7FBFF', // page background
  surface: '#FFFFFF', // card / panel surface
  border: '#60A5FA', // 0.5px card border in figma
  primary: '#1B5DEF', // CTA, links, accents
  primaryHover: '#1747B5',
  text: '#000A3A', // primary text
  textMuted: '#374151', // secondary text
  textSubtle: '#6B7280', // placeholder
  danger: '#DC2626',
  success: '#10B981',
} as const

// Tailwind utility class tokens for direct application
export const tokens = {
  page: 'min-h-screen bg-[#F7FBFF] text-[#000A3A] overflow-hidden',
  card: 'bg-white border border-[#60A5FA]/60 rounded-2xl shadow-sm',
  cardDark: 'bg-white border border-slate-200 rounded-2xl shadow-sm',
  input:
    'w-full rounded-lg bg-white border border-slate-300 px-4 py-2.5 text-sm text-[#000A3A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1B5DEF]/40 focus:border-[#1B5DEF]',
  label: 'block text-sm font-medium text-[#000A3A] mb-1',
  btnPrimary:
    'bg-[#1B5DEF] hover:bg-[#1747B5] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60',
  btnSecondary:
    'bg-white hover:bg-slate-50 text-[#000A3A] border border-slate-300 font-medium py-2.5 rounded-lg transition',
  heading: 'text-2xl font-bold text-[#000A3A]',
  subheading: 'text-sm text-[#374151]',
  error: 'text-[#DC2626] text-xs mt-1',
} as const
