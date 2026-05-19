const ROLE_STYLES = {
  sparkslab: { bg: '#eeedfe', color: '#26215c', label: 'SparksLab' },
  client:    { bg: '#e1f5ee', color: '#04342c', label: 'Client Admin' },
}

export default function UserList({ users, onRevoke, currentUserId }) {
  if (!users || users.length === 0) {
    return (
      <div style={styles.empty}>
        No users yet. Invite someone to get started.
      </div>
    )
  }

  return (
    <div style={styles.list}>
      {users.map((user, i) => {
        const role    = ROLE_STYLES[user.role] || ROLE_STYLES.client
        const isYou   = user.id === currentUserId
        return (
          <div key={user.id || i} style={styles.row}>

            <div style={styles.avatar}>
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>

            <div style={styles.info}>
              <div style={styles.nameRow}>
                <p style={styles.name}>{user.name}</p>
                {isYou && <span style={styles.youBadge}>You</span>}
              </div>
              <p style={styles.email}>{user.email}</p>
            </div>

            <div style={styles.meta}>
              <span style={{
                ...styles.roleBadge,
                background: role.bg,
                color:      role.color,
              }}>
                {role.label}
              </span>
              <p style={styles.lastLogin}>
                {user.lastLogin
                  ? `Last login ${new Date(user.lastLogin).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
                  : 'Never logged in'
                }
              </p>
            </div>

            <div style={styles.actions}>
              {!isYou && (
                <button
                  onClick={() => onRevoke(user)}
                  style={styles.revokeBtn}
                >
                  Revoke access
                </button>
              )}
              {isYou && (
                <span style={styles.cannotRevoke}>Cannot revoke yourself</span>
              )}
            </div>

          </div>
        )
      })}
    </div>
  )
}

const styles = {
  list:         { display: 'flex', flexDirection: 'column', gap: '6px' },
  empty:        { fontSize: '13px', color: '#888899', padding: '24px 0', textAlign: 'center' },
  row:          { display: 'flex', alignItems: 'center', gap: '14px', background: 'white', border: '1px solid #e8e4dc', borderRadius: '10px', padding: '14px 16px' },
  avatar:       { width: '38px', height: '38px', borderRadius: '50%', background: '#1a1a2e', color: 'white', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  info:         { flex: 1, minWidth: 0 },
  nameRow:      { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' },
  name:         { fontSize: '13px', fontWeight: '600', color: '#1a1a2e' },
  youBadge:     { fontSize: '9px', fontWeight: '700', background: '#f1efe8', color: '#888899', padding: '2px 6px', borderRadius: '4px' },
  email:        { fontSize: '11px', color: '#888899' },
  meta:         { display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', flexShrink: 0 },
  roleBadge:    { fontSize: '10px', fontWeight: '600', padding: '3px 9px', borderRadius: '4px' },
  lastLogin:    { fontSize: '10px', color: '#888899' },
  actions:      { flexShrink: 0 },
  revokeBtn:    { padding: '6px 14px', borderRadius: '7px', border: 'none', background: '#fde8e8', color: '#7a1515', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  cannotRevoke: { fontSize: '11px', color: '#ccccdd' },
}