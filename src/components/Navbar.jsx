import { useState } from 'react'
import { Menu, X, LogOut, Save } from 'lucide-react'
import { useAuth } from '../lib/auth'

const NAV_ITEMS = ['about','skills','projects','experience','education','clubs','certifications','gallery']

export default function Navbar({ saved }) {
  const { isAdmin, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#080b12]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-black tracking-tight text-cyan-400 text-base">NZT<span className="text-white/20">.</span></span>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(n => (
              <button key={n} onClick={() => scrollTo(n)}
                className="text-xs uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors">
                {n}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {saved && (
              <span className="hidden md:flex items-center gap-1 text-xs text-cyan-400 animate-pulse">
                <Save size={12}/> Saved
              </span>
            )}
            {isAdmin ? (
              <button onClick={logout}
                className="flex items-center gap-1.5 text-xs text-red-400 border border-red-400/30 rounded-lg px-3 py-1.5 hover:bg-red-400/10 transition">
                <LogOut size={13}/> Exit Admin
              </button>
            ) : null}
            <button className="md:hidden text-white/50 hover:text-white transition" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0a0d14] border-t border-white/5 px-4 py-4 flex flex-col gap-4 animate-fade-in">
            {NAV_ITEMS.map(n => (
              <button key={n} onClick={() => scrollTo(n)}
                className="text-xs uppercase tracking-widest text-white/50 hover:text-cyan-400 text-left transition">
                {n}
              </button>
            ))}
          </div>
        )}
      </header>

    </>
  )
}
