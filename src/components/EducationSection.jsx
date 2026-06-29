import { useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabaseAdmin } from '../lib/supabase'
import { SectionWrap, AdminBtns, AddBtn, Modal, Field, TextArea, SaveBtn } from './UI'
import toast from 'react-hot-toast'

const EMPTY = { degree: '', institution: '', period: '', note: '' }

export default function EducationSection({ data, onUpdate }) {
  const { isAdmin } = useAuth()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      if (modal === 'add') {
        const { data: row, error } = await supabaseAdmin.from('education').insert(form).select().single()
        if (error) throw error
        onUpdate([...data, row])
      } else {
        const { error } = await supabaseAdmin.from('education').update(form).eq('id', form.id)
        if (error) throw error
        onUpdate(data.map(x => x.id === form.id ? { ...x, ...form } : x))
      }
      setModal(null); toast.success('Saved!')
    } catch (e) { toast.error(e.message) }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('Delete?')) return
    await supabaseAdmin.from('education').delete().eq('id', id)
    onUpdate(data.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  return (
    <SectionWrap id="education" title="Education">
      {isAdmin && <AddBtn onClick={() => { setForm(EMPTY); setModal('add') }} label="Add Education"/>}
      <div className="space-y-4">
        {data.map(e => (
          <div key={e.id} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-cyan-400/20 transition">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
                <GraduationCap size={18} className="text-cyan-400"/>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-bold">{e.degree}</h3>
                    <p className="text-cyan-400 text-sm mt-0.5">{e.institution}</p>
                    <p className="text-white/40 text-xs mt-1">{e.period}</p>
                    {e.note && <p className="text-white/50 text-sm mt-3">{e.note}</p>}
                  </div>
                  {isAdmin && <AdminBtns onEdit={() => { setForm(e); setModal('edit') }} onDelete={() => del(e.id)}/>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Education' : 'Edit Education'} onClose={() => setModal(null)}>
          <Field label="Degree" value={form.degree} onChange={v => set('degree', v)}/>
          <Field label="Institution" value={form.institution} onChange={v => set('institution', v)}/>
          <Field label="Period" value={form.period} onChange={v => set('period', v)} placeholder="2022 – 2026"/>
          <TextArea label="Notes / Modules" value={form.note} onChange={v => set('note', v)} rows={3}/>
          <SaveBtn onClick={save} loading={saving}/>
        </Modal>
      )}
    </SectionWrap>
  )
}
