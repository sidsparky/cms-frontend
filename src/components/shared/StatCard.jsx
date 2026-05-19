export default function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
      <div style={styles.top}>
        <span style={styles.icon}>{icon}</span>
        <span style={{ ...styles.value, color }}>{value ?? '—'}</span>
      </div>
      <p style={styles.label}>{label}</p>
    </div>
  )
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e8e4dc',
    padding: '20px',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  icon: { fontSize: '22px' },
  value: {
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1',
  },
  label: {
    fontSize: '12px',
    color: '#888899',
    fontWeight: '500',
  },
}