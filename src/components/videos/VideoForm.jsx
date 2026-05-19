import { useState, useEffect } from 'react'
import VideoPreview from './VideoPreview'

const EMPTY = {
  title:    '',
  screenId: 'screen-1',
  layer:    'content',
  loop:     false,
  muted:    false,
  active:   true,
}

const SCREENS = [
  { value: 'screen-1', label: 'Screen 1 — Welcome' },
  { value: 'screen-2', label: 'Screen 2 — Corporate' },
  { value: 'screen-3', label: 'Screen 3 — Leadership' },
]

const LAYERS = [
  { value: 'content',    label: 'Content — Main video' },
  { value: 'background', label: 'Background — Ambient loop' },
]

export default function VideoForm({ initial, onSave, onCancel }) {
  const [form, setForm]       = useState(initial || EMPTY)
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(initial || null)
  const [error, setError]     = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setForm(initial || EMPTY)
    setPreview(initial || null)
    setFile(null)
    setError('')
  }, [initial])

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return

    // Validate format
    const allowed = ['video/mp4', 'video/webm']
    if (!allowed.includes(selected.type)) {
      setError('Only MP4 and WebM files are accepted')
      return
    }

    // Validate size — 500MB max
    if (selected.size > 500 * 1024 * 1024) {
      setError('File size must be under 500MB')
      return
    }

    setFile(selected)
    setError('')

    // Local preview
    const localUrl = URL.createObjectURL(selected)
    setPreview({ ...form, url: localUrl })
  }

  function handleSubmit() {
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    if (!initial && !file) {
      setError('Please select a video file')
      return
    }
    onSave(form, file)
  }

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>
        {initial ? 'Edit Video' : 'Upload New Video'}
      </h3>

      <div style={styles.body}>
        <div style={styles.left}>

          {/* Title */}
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Welcome Content"
            />
          </div>

          {/* Screen */}
          <div style={styles.field}>
            <label style={styles.label}>Screen</label>
            <select
              style={styles.select}
              value={form.screenId}
              onChange={(e) => set('screenId', e.target.value)}
            >
              {SCREENS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Layer */}
          <div style={styles.field}>
            <label style={styles.label}>Layer</label>
            <select
              style={styles.select}
              value={form.layer}
              onChange={(e) => {
                const layer = e.target.value
                set('layer', layer)
                // Background is always muted and looping
                if (layer === 'background') {
                  set('muted', true)
                  set('loop', true)
                }
              }}
            >
              {LAYERS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div style={styles.toggleGroup}>
            {[
              { key: 'loop',   label: 'Loop video' },
              { key: 'muted',  label: 'Muted' },
              { key: 'active', label: 'Active' },
            ].map(({ key, label }) => (
              <div key={key} style={styles.toggleRow}>
                <span style={styles.toggleLabel}>{label}</span>
                <div
                  onClick={() => set(key, !form[key])}
                  style={{
                    ...styles.toggle,
                    background: form[key] ? '#1a1a2e' : '#e8e4dc',
                  }}
                >
                  <div style={{
                    ...styles.toggleKnob,
                    transform: form[key] ? 'translateX(18px)' : 'translateX(2px)',
                  }}/>
                </div>
              </div>
            ))}
          </div>

          {/* File upload */}
          <div style={styles.field}>
            <label style={styles.label}>
              {initial ? 'Replace video file (optional)' : 'Video file'}
            </label>
            <label style={styles.fileLabel}>
              {file ? file.name : 'Choose MP4 or WebM — max 500MB'}
              <input
                type="file"
                accept="video/mp4,video/webm"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          {/* Actions */}
          <div style={styles.actions}>
            <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              style={styles.saveBtn}
            >
              {uploading ? 'Uploading...' : initial ? 'Save changes' : 'Upload video'}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={styles.right}>
          <VideoPreview video={preview} />
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper:      { background: '#f7f5f0', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '20px' },
  title:        { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' },
  body:         { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' },
  left:         { display: 'flex', flexDirection: 'column', gap: '14px' },
  right:        { background: 'white', borderRadius: '10px', border: '1px solid #e8e4dc', padding: '14px' },
  field:        { display: 'flex', flexDirection: 'column', gap: '5px' },
  label:        { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  input:        { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none' },
  select:       { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none', background: 'white' },
  toggleGroup:  { display: 'flex', flexDirection: 'column', gap: '10px' },
  toggleRow:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  toggleLabel:  { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  toggle:       { width: '40px', height: '22px', borderRadius: '100px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' },
  toggleKnob:   { position: 'absolute', top: '3px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'transform 0.2s' },
  fileLabel:    { padding: '9px 12px', borderRadius: '8px', border: '1.5px dashed #e8e4dc', fontSize: '12px', color: '#888899', cursor: 'pointer', background: 'white' },
  error:        { fontSize: '12px', color: '#c0392b', background: '#fde8e8', padding: '8px 12px', borderRadius: '6px' },
  actions:      { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' },
  cancelBtn:    { padding: '8px 18px', borderRadius: '8px', border: '1px solid #e8e4dc', background: 'white', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#888899' },
  saveBtn:      { padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
}