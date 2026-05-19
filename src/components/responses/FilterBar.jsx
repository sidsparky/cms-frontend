export default function FilterBar({ filters, onChange, onClear }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.fields}>

        {/* Search by name */}
        <div style={styles.field}>
          <label style={styles.label}>Search</label>
          <input
            style={styles.input}
            value={filters.search || ''}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Employee name or email..."
          />
        </div>

        {/* Department */}
        <div style={styles.field}>
          <label style={styles.label}>Department</label>
          <select
            style={styles.select}
            value={filters.department || ''}
            onChange={(e) => set('department', e.target.value)}
          >
            <option value="">All departments</option>
            {['Technology', 'Finance', 'Operations', 'Marketing', 'HR', 'Legal'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div style={styles.field}>
          <label style={styles.label}>From</label>
          <input
            type="date"
            style={styles.input}
            value={filters.from || ''}
            onChange={(e) => set('from', e.target.value)}
          />
        </div>

        {/* Date to */}
        <div style={styles.field}>
          <label style={styles.label}>To</label>
          <input
            type="date"
            style={styles.input}
            value={filters.to || ''}
            onChange={(e) => set('to', e.target.value)}
          />
        </div>

      </div>

      <button onClick={onClear} style={styles.clearBtn}>
        Clear filters
      </button>
    </div>
  )
}

const styles = {
  wrapper:  { background: 'white', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' },
  fields:   { display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 },
  field:    { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px', flex: 1 },
  label:    { fontSize: '11px', fontWeight: '600', color: '#888899' },
  input:    { padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none' },
  select:   { padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none', background: 'white' },
  clearBtn: { padding: '8px 16px', borderRadius: '8px', border: '1px solid #e8e4dc', background: 'white', fontSize: '12px', color: '#888899', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 },
}
