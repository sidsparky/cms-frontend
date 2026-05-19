import { NavLink } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'
import { ROUTES } from '../../services/constants'

const navItems = [
  { label: 'Dashboard',    icon: '🏠', route: ROUTES.DASHBOARD,  roles: ['sparkslab', 'client'] },
  { label: 'Videos',       icon: '📹', route: ROUTES.VIDEOS,     roles: ['sparkslab', 'client'] },
  { label: 'Slides',       icon: '🗂️', route: ROUTES.SLIDES,     roles: ['sparkslab', 'client'] },
  { label: 'Survey',       icon: '📋', route: ROUTES.SURVEY,     roles: ['sparkslab', 'client'] },
  { label: 'App Text',     icon: '✏️', route: ROUTES.CONTENT,    roles: ['sparkslab', 'client'] },
  { label: 'Responses',    icon: '📊', route: ROUTES.RESPONSES,  roles: ['sparkslab', 'client'] },
  { label: 'Users',        icon: '👥', route: ROUTES.USERS,      roles: ['sparkslab'] },
  { label: 'Link Generator', icon: '🔗', route: ROUTES.LINKS, roles: ['sparkslab', 'client'] },
]

export default function Sidebar() {
  const { role } = useRole()

  const visible = navItems.filter((item) => item.roles.includes(role))

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoMark}>A</div>
        <div>
          <div style={styles.logoTitle}>ADNEC</div>
          <div style={styles.logoSub}>Onboarding CMS</div>
        </div>
      </div>

      <nav style={styles.nav}>
        <p style={styles.navLabel}>Menu</p>
        {visible.map((item) => (
          <NavLink
            key={item.route}
            to={item.route}
            end={item.route === ROUTES.DASHBOARD}
            style={({ isActive }) => ({
              ...styles.navItem,
              background: isActive ? '#eeedfe' : 'transparent',
              color: isActive ? '#26215c' : '#888899',
              fontWeight: isActive ? '600' : '400',
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '220px',
    minHeight: '100vh',
    background: 'white',
    borderRight: '1px solid #e8e4dc',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '32px',
    paddingLeft: '4px',
  },
  logoMark: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#1a1a2e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0,
  },
  logoTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1a2e',
    lineHeight: '1.2',
  },
  logoSub: {
    fontSize: '10px',
    color: '#888899',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navLabel: {
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: '#ccccdd',
    padding: '0 8px',
    marginBottom: '6px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    textDecoration: 'none',
    transition: 'all 0.15s',
  },
  navIcon: {
    fontSize: '15px',
    width: '20px',
    textAlign: 'center',
  },
}