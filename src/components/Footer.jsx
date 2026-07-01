import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, Lock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-black text-cyan-400 text-sm">NZT<span className="text-white/20">.</span></span>
        <p className="text-white/20 text-xs">© {new Date().getFullYear()} Nahidur Zaman Tushar</p>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-1.5 text-xs text-cyan-400 border border-cyan-400/30 rounded-lg px-3 py-1.5 hover:bg-cyan-400/10 transition">
            <Lock size={13}/> Admin
          </Link>
          <a href="https://github.com/NAHIDURZAMAN" target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition"><Github size={16}/></a>
          <a href="https://linkedin.com/in/NahidurZamanTushar" target="_blank" rel="noreferrer" className="text-white/30 hover:text-cyan-400 transition"><Linkedin size={16}/></a>
          <a href="mailto:nahidurzaman1903@gmail.com" className="text-white/30 hover:text-cyan-400 transition"><Mail size={16}/></a>
        </div>
      </div>
    </footer>
  )
}
