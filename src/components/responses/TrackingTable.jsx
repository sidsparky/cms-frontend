export default function TrackingTable({ events }) {
  if (!events || events.length === 0) {
    return (
      <div style={styles.empty}>
        No link open events yet.
      </div>
    )
  }

  const statusColors = {
    not_opened: { bg: '#faeeda', color: '#412402' },
    opened:     { bg: '#eeedfe', color: '#26215c' },
    completed:  { bg: '#e1f5ee', color: '#04342c' },
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['Name', 'Email', 'Department', 'Opened at', 'Status'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event, i) => {
            const sc = statusColors[event.status] || statusColors.not_opened
            return (
              <tr key={event.id || i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.td}>
                  <div style={styles.nameCell}>
                    <div style={styles.avatar}>
                      {event.employeeName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {event.employeeName}
                  </div>
                </td>
                <td style={styles.td}>{event.email}</td>
                <td style={styles.td}>
                  <span style={styles.deptBadge}>{event.department}</span>
                </td>
                <td style={styles.td}>
                  {new Date(event.timestamp).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    background: sc.bg,
                    color: sc.color,
                  }}>
                    {event.status?.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  wrapper:   { overflowX: 'auto' },
  empty:     { fontSize: '13px', color: '#888899', padding: '24px 0', textAlign: 'center' },
  table:     { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th:        { textAlign: 'left', padding: '10px 14px', background: '#1a1a2e', color: 'white', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap' },
  trEven:    { background: 'white' },
  trOdd:     { background: '#f7f5f0' },
  td:        { padding: '12px 14px', color: '#1a1a2e', borderBottom: '1px solid #e8e4dc', verticalAlign: 'middle' },
  nameCell:  { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar:    { width: '28px', height: '28px', borderRadius: '50%', background: '#eeedfe', color: '#26215c', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  deptBadge: { fontSize: '11px', fontWeight: '600', background: '#f1efe8', color: '#555577', padding: '3px 8px', borderRadius: '4px' },
  statusBadge:{ fontSize: '10px', fontWeight: '600', padding: '3px 9px', borderRadius: '4px', textTransform: 'capitalize' },
}