import { useState } from 'react'
import { ExternalLink, Github, Star } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabaseAdmin } from '../lib/supabase'
import { SectionWrap, AdminBtns, AddBtn, Modal, Field, TextArea, ImageUpload, SaveBtn } from './UI'
import toast from 'react-hot-toast'

const EMPTY = { title: '', description: '', tech: '', year: '', github_url: '', live_url: '', image_url: '', featured: false }

export default function ProjectsSection({ data, onUpdate }) {
  const { isAdmin } = useAuth()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openAdd  = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (item) => { setForm(item); setModal('edit') }

  const save = async () => {
    setSaving(true)
    try {
      if (modal === 'add') {
        const { data: row, error } = await supabaseAdmin.from('projects').insert(form).select().single()
        if (error) throw error
        onUpdate([...data, row])
      } else {
        const { error } = await supabaseAdmin.from('projects').update(form).eq('id', form.id)
        if (error) throw error
        onUpdate(data.map(x => x.id === form.id ? { ...x, ...form } : x))
      }
      setModal(null); toast.success('Saved!')
    } catch (e) { toast.error(e.message) }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('Delete project?')) return
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    onUpdate(data.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  return (
    <SectionWrap id="projects" title="Projects">
      {isAdmin && <AddBtn onClick={openAdd} label="Add Project"/>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map(p => (
          <div key={p.id} className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-cyan-400/20 transition flex flex-col group">
            {p.image_url ? (
              <div className="h-40 overflow-hidden">
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              </div>
            ) : (
              <div className="h-40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center">
                <span className="text-4xl font-black text-white/10">{p.title.charAt(0)}</span>
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-sm">{p.title}</h3>
                  {p.featured && <Star size={12} className="text-yellow-400 fill-yellow-400"/>}
                </div>
                {isAdmin && <AdminBtns onEdit={() => openEdit(p)} onDelete={() => del(p.id)}/>}
              </div>
              <p className="text-white/50 text-xs leading-relaxed flex-1 mb-4">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-400/70 bg-cyan-400/10 rounded-full px-2.5 py-0.5">{p.year}</span>
                <div className="flex gap-2">
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition"><Github size={15}/></a>}
                  {p.live_url   && <a href={p.live_url}   target="_blank" rel="noreferrer" className="text-white/30 hover:text-cyan-400 transition"><ExternalLink size={15}/></a>}
                </div>
              </div>
              <p className="text-white/20 text-xs mt-2 font-mono truncate">{p.tech}</p>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <ImageUpload label="Project Image" value={form.image_url} onChange={v => set('image_url', v)} folder="projects"/>
          <Field label="Title" value={form.title} onChange={v => set('title', v)}/>
          <TextArea label="Description" value={form.description} onChange={v => set('description', v)} rows={3}/>
          <Field label="Tech Stack" value={form.tech} onChange={v => set('tech', v)} placeholder="React, Node.js, …"/>
          <Field label="Year" value={form.year} onChange={v => set('year', v)} placeholder="2025"/>
          <Field label="GitHub URL" value={form.github_url} onChange={v => set('github_url', v)} placeholder="https://github.com/…"/>
          <Field label="Live URL" value={form.live_url} onChange={v => set('live_url', v)} placeholder="https://…"/>
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-cyan-400"/>
            <span className="text-xs text-white/60">Featured project</span>
          </label>
          <SaveBtn onClick={save} loading={saving}/>
        </Modal>
      )}
    </SectionWrap>
  )
}
