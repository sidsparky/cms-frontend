import { useState, useEffect } from 'react'
import { useToastContext } from '../shared/CMSLayout'
import api from '../../services/api'

const SCREENS = ['screen-1', 'screen-2', 'screen-3', 'screen-4']

const SCREEN_LABELS = {
  'screen-1': 'Screen 1 — Welcome',
  'screen-2': 'Screen 2 — Corporate',
  'screen-3': 'Screen 3 — Leadership',
  'screen-4': 'Screen 4 — Department Journey',
}

const MOCK_CONFIG = {
  'screen-1': { enabled: true,  type: 'female', mode: 'full' },
  'screen-2': { enabled: true,  type: 'female', mode: 'full' },
  'screen-3': { enabled: true,  type: 'female', mode: 'full' },
  'screen-4': { enabled: true,  type: 'female', mode: 'intro-only' },
}

export default function AvatarConfig() {
  const showToast = useToastContext()
  const [config, setConfig]   = useState(MOCK_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    async function load() {
  try {
    const res = await api.get('/journey/avatar-config')
    setConfig(res.data.data)
  } catch {
    showToast('Failed to load avatar config', 'error')
  } finally {
    setLoading(false)
  }
}
    load()
  }, [])

  function update(screenId, key, value) {
    setConfig(prev => ({
      ...prev,
      [screenId]: { ...prev[screenId], [key]: value }
    }))
  }

  async function handleSave() {
  setSaving(true)
  try {
    await api.put('/journey/avatar-config', config)
    showToast('Avatar settings saved')
  } catch {
    showToast('Failed to save avatar settings', 'error')
  } finally {
    setSaving(false)
  }
}

  if (loading) return <p style={{ fontSize: '12px', color: '#888899' }}>Loading...</p>

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <p style={styles.title}>Avatar Settings</p>
          <p style={styles.desc}>Configure the avatar overlay per screen</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </div>

      <div style={styles.grid}>
        {SCREENS.map(screenId => {
          const sc = config[screenId] || { enabled: false, type: 'female', mode: 'full' }
          return (
            <div key={screenId} style={styles.card}>
              <div style={styles.cardTop}>
                <p style={styles.cardTitle}>{SCREEN_LABELS[screenId]}</p>
                <div
                  onClick={() => update(screenId, 'enabled', !sc.enabled)}
                  style={{
                    ...styles.toggle,
                    background: sc.enabled ? '#1a1a2e' : '#e8e4dc',
                  }}
                >
                  <div style={{
                    ...styles.toggleKnob,
                    transform: sc.enabled ? 'translateX(18px)' : 'translateX(2px)',
                  }}/>
                </div>
              </div>

              {sc.enabled && (
                <div style={styles.cardBody}>
                  {/* Gender */}
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Gender</label>
                    <div style={styles.btnGroup}>
                      {['female', 'male'].map(g => (
                        <button
                          key={g}
                          onClick={() => update(screenId, 'type', g)}
                          style={{
                            ...styles.optionBtn,
                            background: sc.type === g ? '#1a1a2e' : 'white',
                            color: sc.type === g ? 'white' : '#888899',
                            border: `1.5px solid ${sc.type === g ? '#1a1a2e' : '#e8e4dc'}`,
                          }}
                        >
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode */}
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Mode</label>
                    <div style={styles.btnGroup}>
                      {[
                        { value: 'full',       label: 'Full' },
                        { value: 'intro-only', label: 'Intro only' },
                      ].map(m => (
                        <button
                          key={m.value}
                          onClick={() => update(screenId, 'mode', m.value)}
                          style={{
                            ...styles.optionBtn,
                            background: sc.mode === m.value ? '#1a1a2e' : 'white',
                            color: sc.mode === m.value ? 'white' : '#888899',
                            border: `1.5px solid ${sc.mode === m.value ? '#1a1a2e' : '#e8e4dc'}`,
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!sc.enabled && (
                <p style={styles.hiddenNote}>Avatar hidden on this screen</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrapper:    { display: 'flex', flexDirection: 'column', gap: '14px' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title:      { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '2px' },
  desc:       { fontSize: '11px', color: '#888899' },
  saveBtn:    { padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' },
  card:       { background: 'white', border: '1px solid #e8e4dc', borderRadius: '10px', padding: '14px' },
  cardTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cardTitle:  { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  toggle:     { width: '40px', height: '22px', borderRadius: '100px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 },
  toggleKnob: { position: 'absolute', top: '3px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'transform 0.2s' },
  cardBody:   { display: 'flex', flexDirection: 'column', gap: '10px' },
  field:      { display: 'flex', flexDirection: 'column', gap: '5px' },
  fieldLabel: { fontSize: '11px', fontWeight: '600', color: '#888899' },
  btnGroup:   { display: 'flex', gap: '6px' },
  optionBtn:  { flex: 1, padding: '6px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
  hiddenNote: { fontSize: '11px', color: '#888899', fontStyle: 'italic' },
}