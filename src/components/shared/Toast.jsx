export default function Toast({ toast }) {
  if (!toast) return null

  const bg    = toast.type === 'success' ? '#e1f5ee' : '#fde8e8'
  const color = toast.type === 'success' ? '#04342c' : '#7a1515'
  const border = toast.type === 'success' ? '#5dcaa5' : '#f0997b'

  return (
    <div style={{ ...styles.toast, background: bg, color, border: `1px solid ${border}` }}>
      <span>{toast.type === 'success' ? '✓' : '✕'}</span>
      {toast.message}
    </div>
  )
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    padding: '12px 18px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 20px rgba(26,26,46,0.1)',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
  },
}