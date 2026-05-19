const DEPARTMENTS = [
  'Technology',
  'Finance',
  'Operations',
  'Marketing',
  'HR',
  'Legal',
]

export default function DepartmentSelector({ selected, onChange }) {
  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>Department</label>
      <div style={styles.tabs}>
        {DEPARTMENTS.map(dept => (
          <button
            key={dept}
            onClick={() => onChange(dept)}
            style={{
              ...styles.tab,
              background: selected === dept ? '#1a1a2e' : 'white',
              color:      selected === dept ? 'white'   : '#888899',
              border:     `1px solid ${selected === dept ? '#1a1a2e' : '#e8e4dc'}`,
            }}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:   { fontSize: '11px', fontWeight: '700', color: '#888899', textTransform: 'uppercase', letterSpacing: '.1em' },
  tabs:    { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  tab:     { padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
}