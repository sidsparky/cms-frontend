import { useRole } from '../../hooks/useRole'
import { useAuth } from '../../hooks/useAuth'

export default function TopBar({ title }) {
  const { role } = useRole()
  const { logout } = useAuth()

  const roleLabel = role === 'sparkslab' ? 'SparksLab' : 'Client Admin'
  const roleBg    = role === 'sparkslab' ? '#eeedfe' : '#e1f5ee'
  const roleColor = role === 'sparkslab' ? '#26215c' : '#04342c'

  return (
    <header style={styles.topbar}>
      <h1 style={styles.title}>{title}</h1>

      <div style={styles.right}>
        <span style={{ ...styles.badge, background: roleBg, color: roleColor }}>
          {roleLabel}
        </span>
        <button onClick={logout} style={styles.logout}>
          Sign out
        </button>
      </div>
    </header>
  )
}

const styles = {
  topbar: {
    height: '60px',
    borderBottom: '1px solid #e8e4dc',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    flexShrink: 0,
  },
  title: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  badge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '100px',
  },
  logout: {
    fontSize: '12px',
    color: '#888899',
    background: 'none',
    border: '1px solid #e8e4dc',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}