export default function MCQOptionsEditor({ options = [], onChange }) {
  function addOption() {
    onChange([...options, ''])
  }

  function updateOption(index, value) {
    const updated = [...options]
    updated[index] = value
    onChange(updated)
  }

  function removeOption(index) {
    onChange(options.filter((_, i) => i !== index))
  }

  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>Answer Options</label>
      <div style={styles.list}>
        {options.map((opt, i) => (
          <div key={i} style={styles.row}>
            <span style={styles.bullet}>{i + 1}</span>
            <input
              style={styles.input}
              value={opt}
              placeholder={`Option ${i + 1}`}
              onChange={(e) => updateOption(i, e.target.value)}
            />
            <button
              onClick={() => removeOption(i)}
              style={styles.remove}
              title="Remove option"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button onClick={addOption} style={styles.addBtn}>
        + Add option
      </button>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label:   { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  list:    { display: 'flex', flexDirection: 'column', gap: '6px' },
  row:     { display: 'flex', alignItems: 'center', gap: '8px' },
  bullet:  { fontSize: '11px', color: '#888899', width: '16px', textAlign: 'center', flexShrink: 0 },
  input:   { flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none' },
  remove:  { background: 'none', border: 'none', color: '#888899', cursor: 'pointer', fontSize: '12px', padding: '4px', flexShrink: 0 },
  addBtn:  { alignSelf: 'flex-start', padding: '7px 14px', borderRadius: '8px', border: '1.5px dashed #e8e4dc', background: 'transparent', color: '#888899', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' },
}