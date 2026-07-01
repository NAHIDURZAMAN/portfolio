import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Shield, LogOut, FolderKanban, Users, GraduationCap, Image as ImageIcon, PenSquare } from 'lucide-react'
import { useAuth } from '../lib/auth'
import toast from 'react-hot-toast'

const DASHBOARD_ITEMS = [
  { label: 'Projects', icon: FolderKanban, href: '/#projects' },
  { label: 'Experience', icon: Users, href: '/#experience' },
  { label: 'Education', icon: GraduationCap, href: '/#education' },
  { label: 'Gallery', icon: ImageIcon, href: '/#gallery' },
]

export default function AdminDashboard() {
  const { isAdmin, logout, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const stats = useMemo(() => ([
    { label: 'Editing mode', value: isAdmin ? 'Enabled' : 'Locked' },
    { label: 'Sections', value: '8' },
    { label: 'Auth', value: 'Session-based' },
  ]), [isAdmin])

  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 text-cyan-400">
            <Shield size={18} />
            <span className="text-xs uppercase tracking-[0.3em]">Admin Access</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h1 className="text-2xl font-black text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/50 text-sm mb-5">Sign in to edit your portfolio content.</p>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                const ok = login(email, password)
                if (ok) {
                  toast.success('Admin mode activated')
                } else {
                  toast.error('Invalid credentials')
                }
              }}
            >
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/60 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/60 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl py-2.5 text-sm transition"
              >
                Login
              </button>
            </form>
          </div>
          <div className="mt-4 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-cyan-400 transition">
              <ArrowLeft size={14} /> Back to portfolio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 text-cyan-400 mb-3 text-xs uppercase tracking-[0.3em]">
            <PenSquare size={14} /> Admin Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Manage your portfolio</h1>
          <p className="text-white/50 mt-3 max-w-2xl">Use this dashboard to jump into each content section and update your site.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition text-sm">
            <ArrowLeft size={14} /> Portfolio
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-400/20 text-red-400 hover:bg-red-400/10 transition text-sm">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {stats.map(item => (
          <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-[0.25em] mb-2">{item.label}</p>
            <p className="text-white text-2xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_ITEMS.map(({ label, icon: Icon, href }) => (
          <a key={label} href={href} className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition">
            <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
              <Icon size={18} />
            </div>
            <h2 className="text-white font-semibold text-lg">{label}</h2>
            <p className="text-white/45 text-sm mt-2">Open this section on the main portfolio and edit its content.</p>
          </a>
        ))}
      </div>
    </section>
  )
}