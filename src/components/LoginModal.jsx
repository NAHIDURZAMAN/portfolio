import { useState } from 'react'
import { X, Lock } from 'lucide-react'
import { useAuth } from '../lib/auth'
import toast from 'react-hot-toast'

export default function LoginModal({ onClose }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = login(email, pass)
    if (ok) { toast.success('Admin mode activated'); onClose() }
    else toast.error('Invalid credentials')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-cyan-400"/>
            <h3 className="font-semibold text-white text-sm">Admin Login</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/60 transition"/>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/60 transition"/>
          </div>
          <button type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl py-2.5 text-sm transition">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
