import { useEffect, useState } from 'react'
import CMSLayout from '../components/shared/CMSLayout'
import { useToastContext } from '../components/shared/CMSLayout'
import UserList from '../components/users/UserList'
import InviteUserForm from '../components/users/InviteUserForm'
import ConfirmModal from '../components/shared/ConfirmModal'
import { useRole } from '../hooks/useRole'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../services/constants'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function UsersPage() {
  const showToast  = useToastContext()
  const { isSparksLab } = useRole()
  const navigate   = useNavigate()
  function getCurrentUserId() {
    const token = localStorage.getItem('cms_token')
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.id
    } catch {
      return null
    }
  }
  const currentUserId = getCurrentUserId()

  const [users, setUsers]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [confirmRevoke, setConfirmRevoke] = useState(null)

  // Redirect client users away from this page
  useEffect(() => {
    const token = localStorage.getItem('cms_token')
    if (!token) {
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'sparkslab') {
        navigate(ROUTES.DASHBOARD, { replace: true })
      }
    } catch {
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/users')
        setUsers(res.data.data.users)
      } catch {
        showToast('Failed to load users', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleInvite(form) {
    try {
      const res = await api.post('/api/users', form)
      setUsers(prev => [...prev, res.data.data])
      setShowForm(false)
      showToast(`Invite sent to ${form.email}`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send invite', 'error')
      throw new Error('failed')
    }
  }

  async function handleRevoke() {
    try {
      await api.delete(`/api/users/${confirmRevoke.id}`)
      setUsers(prev => prev.filter(u => u.id !== confirmRevoke.id))
      showToast(`Access revoked for ${confirmRevoke.name}`)
    } catch {
      showToast('Failed to revoke access', 'error')
    } finally {
      setConfirmRevoke(null)
    }
  }

  const sparksLabUsers = users.filter(u => u.role === 'sparkslab')
  const clientUsers    = users.filter(u => u.role === 'client')

  return (
    <CMSLayout title="User Management">
      {loading ? (
        <p style={{ fontSize: '13px', color: '#888899' }}>Loading...</p>
      ) : (
        <div style={styles.wrapper}>

          {/* Top bar */}
          <div style={styles.topBar}>
            <div>
              <p style={styles.totalCount}>
                {users.length} user{users.length !== 1 ? 's' : ''} total
              </p>
              <p style={styles.totalSub}>
                {sparksLabUsers.length} SparksLab · {clientUsers.length} Client Admin
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={styles.inviteBtn}
            >
              {showForm ? 'Cancel' : '+ Invite user'}
            </button>
          </div>

          {/* Invite form */}
          {showForm && (
            <InviteUserForm
              onInvite={handleInvite}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* SparksLab users */}
          {sparksLabUsers.length > 0 && (
            <div style={styles.group}>
              <p style={styles.groupLabel}>SparksLab Team</p>
              <UserList
                users={sparksLabUsers}
                onRevoke={setConfirmRevoke}
                currentUserId={currentUserId}
              />
            </div>
          )}

          {/* Client users */}
          {clientUsers.length > 0 && (
            <div style={styles.group}>
              <p style={styles.groupLabel}>Client Admins — ADNEC</p>
              <UserList
                users={clientUsers}
                onRevoke={setConfirmRevoke}
                currentUserId={currentUserId}
              />
            </div>
          )}

          {/* Role reference */}
          <div style={styles.reference}>
            <p style={styles.refTitle}>Role Access Reference</p>
            <div style={styles.refGrid}>
              {[
                { page: 'Dashboard',           sparkslab: true,  client: true  },
                { page: 'Videos Manager',      sparkslab: true,  client: true  },
                { page: 'Department Slides',   sparkslab: true,  client: true  },
                { page: 'Survey Builder',      sparkslab: true,  client: true  },
                { page: 'App Text Editor',     sparkslab: true,  client: true  },
                { page: 'Responses',           sparkslab: true,  client: true  },
                { page: 'Link Generator',      sparkslab: true,  client: true  },
                { page: 'User Management',     sparkslab: true,  client: false },
              ].map(row => (
                <div key={row.page} style={styles.refRow}>
                  <span style={styles.refPage}>{row.page}</span>
                  <div style={styles.refBadges}>
                    <span style={{
                      ...styles.refBadge,
                      background: row.sparkslab ? '#eeedfe' : '#f1efe8',
                      color:      row.sparkslab ? '#26215c' : '#ccccdd',
                    }}>
                      SparksLab
                    </span>
                    <span style={{
                      ...styles.refBadge,
                      background: row.client ? '#e1f5ee' : '#f1efe8',
                      color:      row.client ? '#04342c' : '#ccccdd',
                    }}>
                      Client
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      <ConfirmModal
        message={confirmRevoke
          ? `Revoke access for ${confirmRevoke.name}? They will immediately lose access to the CMS.`
          : null}
        onConfirm={handleRevoke}
        onCancel={() => setConfirmRevoke(null)}
      />
    </CMSLayout>
  )
}

const styles = {
  wrapper:    { display: 'flex', flexDirection: 'column', gap: '16px' },
  topBar:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  totalCount: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '2px' },
  totalSub:   { fontSize: '12px', color: '#888899' },
  inviteBtn:  { padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  group:      { display: 'flex', flexDirection: 'column', gap: '8px' },
  groupLabel: { fontSize: '11px', fontWeight: '700', color: '#888899', textTransform: 'uppercase', letterSpacing: '.1em' },
  reference:  { background: 'white', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '20px' },
  refTitle:   { fontSize: '12px', fontWeight: '600', color: '#1a1a2e', marginBottom: '12px' },
  refGrid:    { display: 'flex', flexDirection: 'column', gap: '6px' },
  refRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid #f1efe8' },
  refPage:    { fontSize: '12px', color: '#555577' },
  refBadges:  { display: 'flex', gap: '6px' },
  refBadge:   { fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' },
}