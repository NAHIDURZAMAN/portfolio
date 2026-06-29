import { useState, useRef } from 'react'
import { X, Edit2, Trash2, Plus, Save, Upload, Loader } from 'lucide-react'
import { uploadImage } from '../lib/supabase'
import toast from 'react-hot-toast'

// ── Section Wrapper ────────────────────────────────────────────────────────────
export function SectionWrap({ id, title, children }) {
  return (
    <section id={id} className="py-20 max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h2>
        <div className="flex-1 h-px bg-white/5"/>
      </div>
      {children}
    </section>
  )
}

// ── Admin Action Buttons ───────────────────────────────────────────────────────
export function AdminBtns({ onEdit, onDelete }) {
  return (
    <div className="flex gap-1 shrink-0 ml-2">
      <button onClick={onEdit}
        className="p-1.5 text-white/30 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition">
        <Edit2 size={14}/>
      </button>
      <button onClick={onDelete}
        className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
        <Trash2 size={14}/>
      </button>
    </div>
  )
}

// ── Add Button ─────────────────────────────────────────────────────────────────
export function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick}
      className="mb-6 flex items-center gap-2 text-xs text-cyan-400 border border-cyan-400/30 rounded-xl px-4 py-2 hover:bg-cyan-400/10 transition">
      <Plus size={14}/>{label}
    </button>
  )
}

// ── Modal ──────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#0f1117] z-10">
          <h3 className="font-semibold text-white text-sm">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition"><X size={18}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ── Form Fields ────────────────────────────────────────────────────────────────
export function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/60 transition"/>
    </div>
  )
}

export function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">{label}</label>
      <textarea rows={rows} value={value || ''} onChange={e => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/60 transition resize-none"/>
    </div>
  )
}

// ── Image Upload Field ─────────────────────────────────────────────────────────
export function ImageUpload({ label, value, onChange, folder = 'general' }) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef()

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return }
    setUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">{label}</label>
      {value && (
        <div className="relative mb-2 inline-block">
          <img src={value} alt="preview" className="w-24 h-24 object-cover rounded-xl border border-white/10"/>
          <button onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 text-white hover:bg-red-400 transition">
            <X size={12}/>
          </button>
        </div>
      )}
      <div onClick={() => ref.current?.click()}
        className="flex items-center gap-2 cursor-pointer bg-white/5 border border-dashed border-white/20 rounded-xl px-4 py-3 hover:border-cyan-400/40 transition">
        {uploading ? <Loader size={16} className="animate-spin text-cyan-400"/> : <Upload size={16} className="text-white/40"/>}
        <span className="text-xs text-white/40">{uploading ? 'Uploading…' : 'Click to upload (max 5MB)'}</span>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
      {value && !uploading && (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="Or paste URL"
          className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/50 text-xs focus:outline-none focus:border-cyan-400/60 transition"/>
      )}
    </div>
  )
}

// ── Save Button ────────────────────────────────────────────────────────────────
export function SaveBtn({ onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold rounded-xl py-2.5 text-sm transition flex items-center justify-center gap-2">
      {loading ? <Loader size={16} className="animate-spin"/> : <Save size={16}/>}
      {loading ? 'Saving…' : 'Save'}
    </button>
  )
}
