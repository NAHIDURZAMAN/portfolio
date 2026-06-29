import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { supabaseAdmin } from '../lib/supabase'
import { SectionWrap, AdminBtns, AddBtn, Modal, Field, TextArea, SaveBtn } from './UI'
import toast from 'react-hot-toast'

const EMPTY = { category: '', items: '' }

export default function SkillsSection({ data, onUpdate }) {
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
        const { data: row, error } = await supabaseAdmin.from('skills').insert(form).select().single()
        if (error) throw error
        onUpdate([...data, row])
      } else {
        const { error } = await supabaseAdmin.from('skills').update(form).eq('id', form.id)
        if (error) throw error
        onUpdate(data.map(x => x.id === form.id ? { ...x, ...form } : x))
      }
      setModal(null); toast.success('Saved!')
    } catch (e) { toast.error(e.message) }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('Delete?')) return
    const { error } = await supabaseAdmin.from('skills').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    onUpdate(data.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  return (
    <SectionWrap id="skills" title="Skills">
      {isAdmin && <AddBtn onClick={openAdd} label="Add Skill Category"/>}
      <div className="grid md:grid-cols-2 gap-4">
        {data.map(s => (
          <div key={s.id} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-cyan-400/20 transition">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">{s.category}</h3>
              {isAdmin && <AdminBtns onEdit={() => openEdit(s)} onDelete={() => del(s.id)}/>}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.items.split(',').map((item, i) => (
                <span key={i} className="text-xs text-white/60 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                  {item.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Skill Category' : 'Edit Skill'} onClose={() => setModal(null)}>
          <Field label="Category" value={form.category} onChange={v => set('category', v)}/>
          <TextArea label="Skills (comma-separated)" value={form.items} onChange={v => set('items', v)} rows={3}/>
          <SaveBtn onClick={save} loading={saving}/>
        </Modal>
      )}
    </SectionWrap>
  )
}
