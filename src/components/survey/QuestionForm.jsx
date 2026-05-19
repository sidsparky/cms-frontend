import { useState, useEffect } from 'react'
import MCQOptionsEditor from './MCQOptionsEditor'

const EMPTY = {
  question: '',
  type:     'text',
  options:  [],
  required: true,
}

export default function QuestionForm({ initial, onSave, onCancel }) {
  const [form, setForm]   = useState(initial || EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(initial || EMPTY)
    setError('')
  }, [initial])

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleTypeChange(type) {
    set('type', type)
    if (type !== 'multiple_choice') set('options', [])
  }

  function handleSubmit() {
    if (!form.question.trim()) {
      setError('Question text is required')
      return
    }
    if (form.type === 'multiple_choice' &&
        form.options.filter(o => o.trim()).length < 2) {
      setError('Add at least 2 options for multiple choice')
      return
    }
    onSave(form)
  }

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>
        {initial ? 'Edit Question' : 'New Question'}
      </h3>

      {/* Question text */}
      <div style={styles.field}>
        <label style={styles.label}>Question Text</label>
        <textarea
          style={styles.textarea}
          value={form.question}
          onChange={(e) => set('question', e.target.value)}
          placeholder="Type your question here..."
          rows={2}
        />
      </div>

      {/* Type selector */}
      <div style={styles.field}>
        <label style={styles.label}>Question Type</label>
        <div style={styles.typeRow}>
          {['text', 'multiple_choice', 'scale'].map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              style={{
                ...styles.typeBtn,
                background: form.type === t ? '#1a1a2e' : 'white',
                color:      form.type === t ? 'white'   : '#888899',
                border:     `1.5px solid ${form.type === t ? '#1a1a2e' : '#e8e4dc'}`,
              }}
            >
              {t === 'text'
                ? 'Text'
                : t === 'multiple_choice'
                ? 'Multiple Choice'
                : 'Scale (1–5)'}
            </button>
          ))}
        </div>
      </div>

      {/* MCQ options */}
      {form.type === 'multiple_choice' && (
        <div style={styles.field}>
          <MCQOptionsEditor
            options={form.options}
            onChange={(opts) => set('options', opts)}
          />
        </div>
      )}

      {/* Required toggle */}
      <div style={styles.toggleRow}>
        <span style={styles.toggleLabel}>Required</span>
        <div
          onClick={() => set('required', !form.required)}
          style={{
            ...styles.toggle,
            background: form.required ? '#1a1a2e' : '#e8e4dc',
          }}
        >
          <div style={{
            ...styles.toggleKnob,
            transform: form.required
              ? 'translateX(18px)'
              : 'translateX(2px)',
          }}/>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        <button onClick={handleSubmit} style={styles.saveBtn}>
          {initial ? 'Save changes' : 'Add question'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrapper:     { background: '#f7f5f0', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' },
  title:       { fontSize: '13px', fontWeight: '600', color: '#1a1a2e' },
  field:       { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:       { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  textarea:    { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none', resize: 'vertical' },
  typeRow:     { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  typeBtn:     { padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
  toggleRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  toggleLabel: { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  toggle:      { width: '40px', height: '22px', borderRadius: '100px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' },
  toggleKnob:  { position: 'absolute', top: '3px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'transform 0.2s' },
  error:       { fontSize: '12px', color: '#c0392b', background: '#fde8e8', padding: '8px 12px', borderRadius: '6px' },
  actions:     { display: 'flex', justifyContent: 'flex-end', gap: '8px' },
  cancelBtn:   { padding: '8px 18px', borderRadius: '8px', border: '1px solid #e8e4dc', background: 'white', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#888899' },
  saveBtn:     { padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
}