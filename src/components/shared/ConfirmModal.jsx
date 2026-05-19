export default function ConfirmModal({ message, onConfirm, onCancel }) {
  if (!message) return null

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button onClick={onCancel} style={styles.cancel}>Cancel</button>
          <button onClick={onConfirm} style={styles.confirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(26,26,46,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modal: {
    background: 'white',
    borderRadius: '14px',
    padding: '28px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 8px 40px rgba(26,26,46,0.15)',
  },
  message: {
    fontSize: '14px',
    color: '#1a1a2e',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancel: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid #e8e4dc',
    background: 'white',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: '#888899',
  },
  confirm: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    background: '#c0392b',
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}
