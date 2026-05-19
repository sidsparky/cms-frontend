import { useNavigate } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'
import { ROUTES } from '../../services/constants'

const items = [
  { icon: '📹', label: 'Videos',           sub: 'Manage screen videos',     route: ROUTES.VIDEOS,    roles: ['sparkslab','client'] },
  { icon: '🗂️', label: 'Dept. Slides',     sub: 'Edit department content',  route: ROUTES.SLIDES,    roles: ['sparkslab','client'] },
  { icon: '📋', label: 'Survey',           sub: 'Build survey questions',   route: ROUTES.SURVEY,    roles: ['sparkslab','client'] },
  { icon: '✏️', label: 'App Text',         sub: 'Edit onboarding text',     route: ROUTES.CONTENT,   roles: ['sparkslab','client'] },
  { icon: '📊', label: 'Responses',        sub: 'View submissions',         route: ROUTES.RESPONSES, roles: ['sparkslab','client'] },
  { icon: '👥', label: 'User Management',  sub: 'Manage CMS access',        route: ROUTES.USERS,     roles: ['sparkslab'] },
]

export default function QuickNav() {
  const navigate = useNavigate()
  const { role } = useRole()
  const visible = items.filter(i => i.roles.includes(role))

  return (
    <div style={styles.grid}>
      {visible.map((item) => (
        <button
          key={item.route}
          onClick={() => navigate(item.route)}
          style={styles.card}
        >
          <span style={styles.icon}>{item.icon}</span>
          <p style={styles.label}>{item.label}</p>
          <p style={styles.sub}>{item.sub}</p>
        </button>
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '10px',
  },
  card: {
    background: 'white',
    border: '1px solid #e8e4dc',
    borderRadius: '12px',
    padding: '18px 16px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s',
    fontFamily: 'inherit',
  },
  icon: { fontSize: '20px', display: 'block', marginBottom: '10px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#1a1a2e', marginBottom: '3px' },
  sub: { fontSize: '11px', color: '#888899', lineHeight: '1.4' },
}