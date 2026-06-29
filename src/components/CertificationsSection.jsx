import { useState } from 'react'
import { Award, ZoomIn } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabaseAdmin } from '../lib/supabase'
import { SectionWrap, AdminBtns, AddBtn, Modal, Field, ImageUpload, SaveBtn } from './UI'
import toast from 'react-hot-toast'

const EMPTY = { title: '', description: '', issuer: '', date: '', image_url: '' }

export default function CertificationsSection({ data, onUpdate }) {
  const { isAdmin } = useAuth()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      if (modal === 'add') {
        const { data: row, error } = await supabaseAdmin.from('certifications').insert(form).select().single()
        if (error) throw error
        onUpdate([...data, row])
      } else {
        const { error } = await supabaseAdmin.from('certifications').update(form).eq('id', form.id)
        if (error) throw error
        onUpdate(data.map(x => x.id === form.id ? { ...x, ...form } : x))
      }
      setModal(null); toast.success('Saved!')
    } catch (e) { toast.error(e.message) }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('Delete?')) return
    await supabaseAdmin.from('certifications').delete().eq('id', id)
    onUpdate(data.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  return (
    <SectionWrap id="certifications" title="Certifications & Awards">
      {isAdmin && <AddBtn onClick={() => { setForm(EMPTY); setModal('add') }} label="Add Certification"/>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(c => (
          <div key={c.id} className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-cyan-400/20 transition group">
            {c.image_url && (
              <div className="relative h-36 overflow-hidden cursor-pointer" onClick={() => setLightbox(c.image_url)}>
                <img src={c.image_url} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                  <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition"/>
                </div>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {!c.image_url && (
                    <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Award size={14} className="text-yellow-400"/>
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-sm">{c.title}</h3>
                    {c.issuer && <p className="text-white/40 text-xs mt-0.5">{c.issuer}</p>}
                    {c.description && <p className="text-white/50 text-xs mt-1">{c.description}</p>}
                    {c.date && <p className="text-cyan-400/60 text-xs mt-1">{c.date}</p>}
                  </div>
                </div>
                {isAdmin && <AdminBtns onEdit={() => { setForm(c); setModal('edit') }} onDelete={() => del(c.id)}/>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Certificate" className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"/>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Certification' : 'Edit Certification'} onClose={() => setModal(null)}>
          <ImageUpload label="Certificate Image" value={form.image_url} onChange={v => set('image_url', v)} folder="certifications"/>
          <Field label="Title" value={form.title} onChange={v => set('title', v)}/>
          <Field label="Description" value={form.description} onChange={v => set('description', v)}/>
          <Field label="Issuer / Organization" value={form.issuer} onChange={v => set('issuer', v)}/>
          <Field label="Date" value={form.date} onChange={v => set('date', v)} placeholder="Jan 2026"/>
          <SaveBtn onClick={save} loading={saving}/>
        </Modal>
      )}
    </SectionWrap>
  )
}
