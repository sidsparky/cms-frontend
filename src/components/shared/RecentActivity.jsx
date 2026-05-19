export default function RecentActivity({ events }) {
  if (!events || events.length === 0) {
    return (
      <div style={styles.empty}>No activity yet.</div>
    )
  }

  return (
    <div style={styles.list}>
      {events.map((e, i) => (
        <div key={i} style={styles.row}>
          <div style={styles.avatar}>
            {e.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div style={styles.info}>
            <p style={styles.name}>{e.name || 'Unknown'}</p>
            <p style={styles.meta}>{e.email} · {e.department || 'N/A'}</p>
          </div>
          <div style={styles.time}>
            {new Date(e.timestamp).toLocaleString('en-GB', {
              day: '2-digit', month: 'short',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '2px' },
  empty: { fontSize: '13px', color: '#888899', padding: '16px 0' },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid #f1efe8',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#eeedfe',
    color: '#26215c',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: '13px', fontWeight: '500', color: '#1a1a2e' },
  meta: {
    fontSize: '11px',
    color: '#888899',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  time: { fontSize: '11px', color: '#888899', flexShrink: 0 },
}