import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, ClipboardList, LayoutDashboard, PlusSquare, Eye, FileEdit } from 'lucide-react'
import { palette } from '@/shared/design-system/tokens'

export default function RootLayout() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className={`min-h-screen ${palette.bg} text-[#000A3A]`}>
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-[#60A5FA]/60 z-50 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-[#60A5FA]/40">
          <img src="/img/logo.svg" alt="Logo" className="w-9 h-9" />
          <span className="font-bold text-lg text-[#000A3A]">Preproute</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-[#1B5DEF]/10 text-[#1B5DEF]' : 'text-[#374151] hover:text-[#000A3A] hover:bg-slate-50'}`
            }
            end
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/tests/create"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-[#1B5DEF]/10 text-[#1B5DEF]' : 'text-[#374151] hover:text-[#000A3A] hover:bg-slate-50'}`
            }
          >
            <PlusSquare size={18} /> Create Test
          </NavLink>
          <NavLink
            to="/tests/edit"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-[#1B5DEF]/10 text-[#1B5DEF]' : 'text-[#374151] hover:text-[#000A3A] hover:bg-slate-50'}`
            }
          >
            <FileEdit size={18} /> Edit Details
          </NavLink>
          <NavLink
            to="/tests/questions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-[#1B5DEF]/10 text-[#1B5DEF]' : 'text-[#374151] hover:text-[#000A3A] hover:bg-slate-50'}`
            }
          >
            <ClipboardList size={18} /> Questions
          </NavLink>
          <NavLink
            to="/tests/preview"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-[#1B5DEF]/10 text-[#1B5DEF]' : 'text-[#374151] hover:text-[#000A3A] hover:bg-slate-50'}`
            }
          >
            <Eye size={18} /> Preview & Publish
          </NavLink>
        </nav>
        <div className="p-3 border-t border-[#60A5FA]/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#DC2626] hover:bg-red-50 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <div className="md:ml-64 min-h-screen">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#60A5FA]/40 px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/img/logo.svg" alt="Logo" className="w-8 h-8 md:hidden" />
            <h1 className="text-xl font-semibold tracking-tight text-[#000A3A]">Preproute</h1>
          </div>
          <div className="flex items-center gap-3">
            <img src="/img/user.svg" alt="" className="w-7 h-7 rounded-full bg-slate-100" />
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#1B5DEF]/10 text-[#1B5DEF] font-medium">
              Admin
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-md text-xs font-medium text-[#DC2626] hover:bg-red-50 transition"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>
        <main className="px-6 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
