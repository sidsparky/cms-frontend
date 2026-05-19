import { useState } from 'react'

const EMPTY = { name: '', email: '', role: 'client' }

const ROLES = [
  { value: 'client',    label: 'Client Admin',  desc: 'Access to Videos, Slides, Survey, App Text, Responses and Link Generator' },
  { value: 'sparkslab', label: 'SparksLab',     desc: 'Full access to all CMS pages including User Management' },
]

export default function InviteUserForm({ onInvite, onCancel }) {
  const [form, setForm]   = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setError('A valid email is required')
      return
    }
    setLoading(true)
    try {
      await onInvite(form)
      setForm(EMPTY)
      setError('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Invite New User</h3>

      {/* Name */}
      <div style={styles.field}>
        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Sara Al Hashimi"
        />
      </div>

      {/* Email */}
      <div style={styles.field}>
        <label style={styles.label}>Email Address</label>
        <input
          type="email"
          style={styles.input}
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="e.g. sara@adnec.ae"
        />
      </div>

      {/* Role */}
      <div style={styles.field}>
        <label style={styles.label}>Role</label>
        <div style={styles.roleOptions}>
          {ROLES.map(r => (
            <div
              key={r.value}
              onClick={() => set('role', r.value)}
              style={{
                ...styles.roleCard,
                border: `1.5px solid ${form.role === r.value ? '#1a1a2e' : '#e8e4dc'}`,
                background: form.role === r.value ? '#f7f5f0' : 'white',
              }}
            >
              <div style={styles.roleTop}>
                <div style={{
                  ...styles.roleRadio,
                  borderColor: form.role === r.value ? '#1a1a2e' : '#e8e4dc',
                }}>
                  {form.role === r.value && <div style={styles.roleRadioDot}/>}
                </div>
                <span style={styles.roleName}>{r.label}</span>
              </div>
              <p style={styles.roleDesc}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.actions}>
        <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={styles.inviteBtn}
        >
          {loading ? 'Sending invite...' : 'Send invite'}
        </button>
      </div>

      <p style={styles.hint}>
        An email will be sent to the user with a link to set their password and access the CMS.
      </p>
    </div>
  )
}

const styles = {
  wrapper:       { background: '#f7f5f0', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' },
  title:         { fontSize: '13px', fontWeight: '600', color: '#1a1a2e' },
  field:         { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:         { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  input:         { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none' },
  roleOptions:   { display: 'flex', flexDirection: 'column', gap: '8px' },
  roleCard:      { borderRadius: '10px', padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s' },
  roleTop:       { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
  roleRadio:     { width: '16px', height: '16px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  roleRadioDot:  { width: '8px', height: '8px', borderRadius: '50%', background: '#1a1a2e' },
  roleName:      { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  roleDesc:      { fontSize: '11px', color: '#888899', lineHeight: '1.5', paddingLeft: '26px' },
  error:         { fontSize: '12px', color: '#c0392b', background: '#fde8e8', padding: '8px 12px', borderRadius: '6px' },
  actions:       { display: 'flex', justifyContent: 'flex-end', gap: '8px' },
  cancelBtn:     { padding: '8px 18px', borderRadius: '8px', border: '1px solid #e8e4dc', background: 'white', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#888899' },
  inviteBtn:     { padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  hint:          { fontSize: '11px', color: '#888899', lineHeight: '1.5' },
}