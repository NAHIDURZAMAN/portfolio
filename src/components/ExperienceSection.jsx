import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { supabaseAdmin } from '../lib/supabase'
import { SectionWrap, AdminBtns, AddBtn, Modal, Field, TextArea, SaveBtn } from './UI'
import toast from 'react-hot-toast'

const EMPTY = { role: '', company: '', period: '', points: '' }

export default function ExperienceSection({ data, onUpdate }) {
  const { isAdmin } = useAuth()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      if (modal === 'add') {
        const { data: row, error } = await supabaseAdmin.from('experience').insert(form).select().single()
        if (error) throw error
        onUpdate([...data, row])
      } else {
        const { error } = await supabaseAdmin.from('experience').update(form).eq('id', form.id)
        if (error) throw error
        onUpdate(data.map(x => x.id === form.id ? { ...x, ...form } : x))
      }
      setModal(null); toast.success('Saved!')
    } catch (e) { toast.error(e.message) }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('Delete?')) return
    await supabaseAdmin.from('experience').delete().eq('id', id)
    onUpdate(data.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  return (
    <SectionWrap id="experience" title="Experience">
      {isAdmin && <AddBtn onClick={() => { setForm(EMPTY); setModal('add') }} label="Add Experience"/>}
      <div className="space-y-8">
        {data.map(e => (
          <div key={e.id} className="border-l-2 border-cyan-400/20 pl-6 relative">
            <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"/>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-white font-bold">{e.role}</h3>
                <p className="text-cyan-400 text-sm mt-0.5">{e.company} · <span className="text-white/40">{e.period}</span></p>
              </div>
              {isAdmin && <AdminBtns onEdit={() => { setForm(e); setModal('edit') }} onDelete={() => del(e.id)}/>}
            </div>
            <ul className="mt-3 space-y-1.5">
              {e.points.split('. ').filter(Boolean).map((pt, i) => (
                <li key={i} className="text-white/60 text-sm flex gap-2">
                  <span className="text-cyan-400 mt-0.5 shrink-0">›</span>
                  {pt.replace(/\.$/, '')}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Experience' : 'Edit Experience'} onClose={() => setModal(null)}>
          <Field label="Role" value={form.role} onChange={v => set('role', v)}/>
          <Field label="Company" value={form.company} onChange={v => set('company', v)}/>
          <Field label="Period" value={form.period} onChange={v => set('period', v)} placeholder="Jan 2024 – Present"/>
          <TextArea label="Bullet points (separate with '. ')" value={form.points} onChange={v => set('points', v)} rows={5}/>
          <SaveBtn onClick={save} loading={saving}/>
        </Modal>
      )}
    </SectionWrap>
  )
}
