import { useState } from 'react'
import { ZoomIn, Image } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabaseAdmin } from '../lib/supabase'
import { SectionWrap, AdminBtns, AddBtn, Modal, Field, TextArea, ImageUpload, SaveBtn } from './UI'
import toast from 'react-hot-toast'

const EMPTY = { title: '', description: '', image_url: '', category: 'general' }
const CATEGORIES = ['general', 'event', 'achievement', 'team', 'competition']

export default function GallerySection({ data, onUpdate }) {
  const { isAdmin } = useAuth()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [filter, setFilter] = useState('all')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.image_url) { toast.error('Please upload an image'); return }
    setSaving(true)
    try {
      if (modal === 'add') {
        const { data: row, error } = await supabaseAdmin.from('gallery').insert(form).select().single()
        if (error) throw error
        onUpdate([...data, row])
      } else {
        const { error } = await supabaseAdmin.from('gallery').update(form).eq('id', form.id)
        if (error) throw error
        onUpdate(data.map(x => x.id === form.id ? { ...x, ...form } : x))
      }
      setModal(null); toast.success('Saved!')
    } catch (e) { toast.error(e.message) }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('Delete photo?')) return
    await supabaseAdmin.from('gallery').delete().eq('id', id)
    onUpdate(data.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  const filtered = filter === 'all' ? data : data.filter(x => x.category === filter)

  return (
    <SectionWrap id="gallery" title="Gallery">
      {isAdmin && <AddBtn onClick={() => { setForm(EMPTY); setModal('add') }} label="Add Photo"/>}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition capitalize ${filter === cat ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-400' : 'border-white/10 text-white/40 hover:text-white'}`}>
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/20">
          <Image size={40} className="mx-auto mb-3 opacity-30"/>
          <p className="text-sm">No photos yet{isAdmin ? ' — add some above!' : '.'}</p>
        </div>
      )}

      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {filtered.map(item => (
          <div key={item.id} className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer border border-white/8 hover:border-cyan-400/30 transition"
            onClick={() => setLightbox(item)}>
            <img src={item.image_url} alt={item.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                {item.description && <p className="text-white/60 text-xs truncate">{item.description}</p>}
              </div>
              <ZoomIn size={20} className="absolute top-3 right-3 text-white"/>
            </div>
            {isAdmin && (
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition" onClick={e => e.stopPropagation()}>
                <AdminBtns onEdit={() => { setForm(item); setModal('edit') }} onDelete={() => del(item.id)}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.image_url} alt={lightbox.title} className="w-full max-h-[75vh] object-contain rounded-xl"/>
            <div className="mt-4 text-center">
              <h3 className="text-white font-bold">{lightbox.title}</h3>
              {lightbox.description && <p className="text-white/60 text-sm mt-1">{lightbox.description}</p>}
              <span className="inline-block mt-2 text-xs text-cyan-400/60 capitalize bg-cyan-400/10 px-3 py-1 rounded-full">{lightbox.category}</span>
            </div>
            <button onClick={() => setLightbox(null)} className="mt-4 w-full text-white/40 text-sm hover:text-white transition">Close</button>
          </div>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Photo' : 'Edit Photo'} onClose={() => setModal(null)}>
          <ImageUpload label="Photo *" value={form.image_url} onChange={v => set('image_url', v)} folder="gallery"/>
          <Field label="Title" value={form.title} onChange={v => set('title', v)} placeholder="Award Ceremony 2025"/>
          <TextArea label="Description" value={form.description} onChange={v => set('description', v)} rows={2}/>
          <div className="mb-4">
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-widest">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/60">
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0f1117] capitalize">{c}</option>)}
            </select>
          </div>
          <SaveBtn onClick={save} loading={saving}/>
        </Modal>
      )}
    </SectionWrap>
  )
}
