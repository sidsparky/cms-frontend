import { useState, useEffect } from 'react'

const BUTTON_ACTIONS = [
  { value: 'next_slide', label: 'Go to next slide' },
  { value: 'open_link',  label: 'Open a link' },
  { value: 'play_audio', label: 'Play audio' },
]

const EMPTY = {
  title:        '',
  body:         '',
  subtitleText: '',
  buttonLabel:  'Next',
  buttonAction: 'next_slide',
  images:       [],
  audio:        [],
}

export default function SlideForm({ initial, onSave, onCancel, onChange }) {
  const [form, setForm]   = useState(initial || EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(initial || EMPTY)
    setError('')
  }, [initial])

  function set(key, value) {
    const updated = { ...form, [key]: value }
    setForm(updated)
    onChange?.(updated)
  }

  // Images
  function addImages(files) {
    const newImages = Array.from(files).map((file, i) => ({
      id:      `img-new-${Date.now()}-${i}`,
      url:     URL.createObjectURL(file),
      caption: '',
      order:   form.images.length + i + 1,
      file,
    }))
    set('images', [...form.images, ...newImages])
  }

  function updateCaption(index, caption) {
    const updated = form.images.map((img, i) =>
      i === index ? { ...img, caption } : img
    )
    set('images', updated)
  }

  function removeImage(index) {
    set('images', form.images.filter((_, i) => i !== index))
  }

  // Audio
  function addAudio(files) {
    const newAudio = Array.from(files).map((file, i) => ({
      id:    `aud-new-${Date.now()}-${i}`,
      url:   URL.createObjectURL(file),
      label: '',
      order: form.audio.length + i + 1,
      file,
    }))
    set('audio', [...form.audio, ...newAudio])
  }

  function updateAudioLabel(index, label) {
    const updated = form.audio.map((a, i) =>
      i === index ? { ...a, label } : a
    )
    set('audio', updated)
  }

  function removeAudio(index) {
    set('audio', form.audio.filter((_, i) => i !== index))
  }

  function handleSubmit() {
    if (!form.title.trim()) {
      setError('Slide title is required')
      return
    }
    if (!form.body.trim()) {
      setError('Slide body text is required')
      return
    }
    onSave(form)
  }

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>
        {initial ? 'Edit Slide' : 'New Slide'}
      </h3>

      {/* Title */}
      <div style={styles.field}>
        <label style={styles.label}>Slide Title</label>
        <input
          style={styles.input}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Welcome to Technology"
        />
      </div>

      {/* Body */}
      <div style={styles.field}>
        <label style={styles.label}>Body Text</label>
        <textarea
          style={styles.textarea}
          value={form.body}
          onChange={(e) => set('body', e.target.value)}
          placeholder="Main content of the slide..."
          rows={3}
        />
      </div>

      {/* Subtitle */}
      <div style={styles.field}>
        <label style={styles.label}>Subtitle Text <span style={styles.optional}>(optional)</span></label>
        <input
          style={styles.input}
          value={form.subtitleText}
          onChange={(e) => set('subtitleText', e.target.value)}
          placeholder="e.g. Use the arrows to navigate"
        />
      </div>

      {/* Button */}
      <div style={styles.twoCol}>
        <div style={styles.field}>
          <label style={styles.label}>Button Label</label>
          <input
            style={styles.input}
            value={form.buttonLabel}
            onChange={(e) => set('buttonLabel', e.target.value)}
            placeholder="Next"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Button Action</label>
          <select
            style={styles.select}
            value={form.buttonAction}
            onChange={(e) => set('buttonAction', e.target.value)}
          >
            {BUTTON_ACTIONS.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Images */}
      <div style={styles.field}>
        <label style={styles.label}>
          Images <span style={styles.optional}>(optional — JPG or PNG, max 10MB each)</span>
        </label>

        {form.images.length > 0 && (
          <div style={styles.mediaList}>
            {form.images.map((img, i) => (
              <div key={img.id || i} style={styles.mediaRow}>
                <div style={styles.mediaThumb}>
                  {img.url
                    ? <img src={img.url} alt="" style={styles.thumbImg}/>
                    : <span style={styles.thumbFallback}>🖼</span>
                  }
                </div>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  value={img.caption || ''}
                  onChange={(e) => updateCaption(i, e.target.value)}
                  placeholder="Caption (optional)"
                />
                <button onClick={() => removeImage(i)} style={styles.removeBtn}>✕</button>
              </div>
            ))}
          </div>
        )}

        <label style={styles.fileLabel}>
          + Add images
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => addImages(e.target.files)}
          />
        </label>
      </div>

      {/* Audio */}
      <div style={styles.field}>
        <label style={styles.label}>
          Audio <span style={styles.optional}>(optional — MP3, max 20MB each)</span>
        </label>

        {form.audio.length > 0 && (
          <div style={styles.mediaList}>
            {form.audio.map((a, i) => (
              <div key={a.id || i} style={styles.mediaRow}>
                <span style={styles.audioIcon}>🔊</span>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  value={a.label || ''}
                  onChange={(e) => updateAudioLabel(i, e.target.value)}
                  placeholder="Label (optional)"
                />
                {a.url && (
                  <audio controls src={a.url} style={styles.audioPlayer}/>
                )}
                <button onClick={() => removeAudio(i)} style={styles.removeBtn}>✕</button>
              </div>
            ))}
          </div>
        )}

        <label style={styles.fileLabel}>
          + Add audio
          <input
            type="file"
            accept="audio/mpeg"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => addAudio(e.target.files)}
          />
        </label>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        <button onClick={handleSubmit} style={styles.saveBtn}>
          {initial ? 'Save changes' : 'Add slide'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrapper:      { background: '#f7f5f0', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' },
  title:        { fontSize: '13px', fontWeight: '600', color: '#1a1a2e' },
  field:        { display: 'flex', flexDirection: 'column', gap: '5px' },
  label:        { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  optional:     { fontWeight: '400', color: '#888899', fontSize: '11px' },
  input:        { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none' },
  textarea:     { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none', resize: 'vertical' },
  select:       { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none', background: 'white' },
  twoCol:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  mediaList:    { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '6px' },
  mediaRow:     { display: 'flex', alignItems: 'center', gap: '8px' },
  mediaThumb:   { width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#f1efe8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  thumbImg:     { width: '100%', height: '100%', objectFit: 'cover' },
  thumbFallback:{ fontSize: '16px' },
  audioIcon:    { fontSize: '18px', flexShrink: 0 },
  audioPlayer:  { height: '28px', flexShrink: 0 },
  removeBtn:    { background: 'none', border: 'none', color: '#888899', cursor: 'pointer', fontSize: '12px', padding: '4px', flexShrink: 0 },
  fileLabel:    { alignSelf: 'flex-start', padding: '7px 14px', borderRadius: '8px', border: '1.5px dashed #e8e4dc', fontSize: '12px', color: '#888899', cursor: 'pointer', background: 'white' },
  error:        { fontSize: '12px', color: '#c0392b', background: '#fde8e8', padding: '8px 12px', borderRadius: '6px' },
  actions:      { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' },
  cancelBtn:    { padding: '8px 18px', borderRadius: '8px', border: '1px solid #e8e4dc', background: 'white', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#888899' },
  saveBtn:      { padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
}