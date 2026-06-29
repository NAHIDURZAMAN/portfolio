import { useState } from 'react'
import { Mail, Phone, MapPin, Github, Linkedin, Edit2, Save, X, Loader } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabaseAdmin } from '../lib/supabase'
import { ImageUpload } from './UI'
import toast from 'react-hot-toast'

export default function HeroSection({ data, onUpdate }) {
  const { isAdmin } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(data)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    const { error } = await supabaseAdmin.from('hero').update(form).eq('id', data.id)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    onUpdate(form)
    setEditing(false)
    toast.success('Profile updated!')
  }

  return (
    <section id="about" className="min-h-screen flex flex-col justify-center py-32 max-w-6xl mx-auto px-4">
      {/* Admin edit toggle */}
      {isAdmin && !editing && (
        <button onClick={() => { setForm(data); setEditing(true) }}
          className="self-start mb-8 flex items-center gap-2 text-xs text-cyan-400 border border-cyan-400/30 rounded-xl px-4 py-2 hover:bg-cyan-400/10 transition">
          <Edit2 size={13}/> Edit Profile
        </button>
      )}
      {isAdmin && editing && (
        <div className="self-start mb-8 flex gap-2">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 text-xs text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl px-4 py-2 transition font-bold">
            {saving ? <Loader size={13} className="animate-spin"/> : <Save size={13}/>} Save
          </button>
          <button onClick={() => setEditing(false)}
            className="flex items-center gap-2 text-xs text-white/50 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/5 transition">
            <X size={13}/> Cancel
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start gap-12">
        {/* Profile image */}
        <div className="shrink-0">
          {editing ? (
            <div className="w-40">
              <ImageUpload label="Profile Photo" value={form.profile_image_url} onChange={v => set('profile_image_url', v)} folder="profile"/>
            </div>
          ) : data.profile_image_url ? (
            <img src={data.profile_image_url} alt={data.name}
              className="w-36 h-36 md:w-48 md:h-48 rounded-2xl object-cover border border-white/10 shadow-2xl"/>
          ) : (
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-5xl font-black text-white/20">
              {data.name?.charAt(0)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-3 py-1 text-xs text-cyan-400 mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"/>
            {editing
              ? <input value={form.available ? 'Available for opportunities' : 'Not available'}
                  onChange={e => set('available', e.target.value.toLowerCase().includes('available'))}
                  className="bg-transparent focus:outline-none w-48"/>
              : data.available ? 'Available for opportunities' : 'Currently unavailable'
            }
          </div>

          {editing
            ? <input value={form.name} onChange={e => set('name', e.target.value)}
                className="text-4xl md:text-6xl font-black tracking-tight mb-3 bg-transparent border-b border-white/20 focus:outline-none focus:border-cyan-400 text-white w-full block"/>
            : <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 text-white">{data.name}</h1>
          }

          {editing
            ? <input value={form.tagline} onChange={e => set('tagline', e.target.value)}
                className="text-lg md:text-xl text-cyan-400 font-light mb-5 bg-transparent border-b border-white/10 focus:outline-none focus:border-cyan-400 w-full block"/>
            : <p className="text-lg md:text-xl text-cyan-400 font-light mb-5">{data.tagline}</p>
          }

          {editing
            ? <textarea rows={3} value={form.bio} onChange={e => set('bio', e.target.value)}
                className="text-white/60 max-w-2xl mb-8 bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-400 resize-none w-full text-sm leading-relaxed"/>
            : <p className="text-white/60 max-w-2xl mb-8 text-sm leading-relaxed">{data.bio}</p>
          }

          {/* Contacts */}
          {editing ? (
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[['email','Email'],['phone','Phone'],['github','GitHub username'],['linkedin','LinkedIn username'],['location','Location']].map(([k,l]) => (
                <input key={k} value={form[k]||''} onChange={e => set(k,e.target.value)} placeholder={l}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/70 text-xs focus:outline-none focus:border-cyan-400 transition"/>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {data.email && <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition text-xs"><Mail size={14}/>{data.email}</a>}
              {data.phone && <a href={`tel:${data.phone}`} className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition text-xs"><Phone size={14}/>{data.phone}</a>}
              {data.github && <a href={`https://github.com/${data.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition text-xs"><Github size={14}/>{data.github}</a>}
              {data.linkedin && <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition text-xs"><Linkedin size={14}/>{data.linkedin}</a>}
              {data.location && <span className="flex items-center gap-2 text-white/50 text-xs"><MapPin size={14}/>{data.location}</span>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
