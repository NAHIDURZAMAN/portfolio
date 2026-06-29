import { useState } from 'react'
import { Users } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabaseAdmin } from '../lib/supabase'
import { SectionWrap, AdminBtns, AddBtn, Modal, Field, SaveBtn } from './UI'
import toast from 'react-hot-toast'

const EMPTY = { role: '', org: '', period: '' }

export default function ClubsSection({ data, onUpdate }) {
  const { isAdmin } = useAuth()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      if (modal === 'add') {
        const { data: row, error } = await supabaseAdmin.from('clubs').insert(form).select().single()
        if (error) throw error
        onUpdate([...data, row])
      } else {
        const { error } = await supabaseAdmin.from('clubs').update(form).eq('id', form.id)
        if (error) throw error
        onUpdate(data.map(x => x.id === form.id ? { ...x, ...form } : x))
      }
      setModal(null); toast.success('Saved!')
    } catch (e) { toast.error(e.message) }
    setSaving(false)
  }

  const del = async (id) => {
    if (!confirm('Delete?')) return
    await supabaseAdmin.from('clubs').delete().eq('id', id)
    onUpdate(data.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  return (
    <SectionWrap id="clubs" title="Club Roles">
      {isAdmin && <AddBtn onClick={() => { setForm(EMPTY); setModal('add') }} label="Add Club Role"/>}
      <div className="grid md:grid-cols-2 gap-4">
        {data.map(c => (
          <div key={c.id} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-cyan-400/20 transition">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Users size={16} className="text-purple-400"/>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-bold text-sm">{c.role}</h3>
                    <p className="text-purple-400 text-xs mt-0.5">{c.org}</p>
                    <p className="text-white/40 text-xs">{c.period}</p>
                  </div>
                  {isAdmin && <AdminBtns onEdit={() => { setForm(c); setModal('edit') }} onDelete={() => del(c.id)}/>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Club Role' : 'Edit Club Role'} onClose={() => setModal(null)}>
          <Field label="Role" value={form.role} onChange={v => set('role', v)} placeholder="Vice President"/>
          <Field label="Organization" value={form.org} onChange={v => set('org', v)} placeholder="MIST Computer Club"/>
          <Field label="Period" value={form.period} onChange={v => set('period', v)} placeholder="2025 – Present"/>
          <SaveBtn onClick={save} loading={saving}/>
        </Modal>
      )}
    </SectionWrap>
  )
}
