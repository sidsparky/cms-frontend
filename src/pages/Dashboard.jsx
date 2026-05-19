import { useEffect, useState } from 'react'
import CMSLayout from '../components/shared/CMSLayout'
import StatCard from '../components/shared/StatCard'
import RecentActivity from '../components/shared/RecentActivity'
import QuickNav from '../components/shared/QuickNav'
import api from '../services/api'

// Mock data — replace with real API calls once backend is ready
const MOCK_STATS = {
  linksOpened: 24,
  completions: 18,
  surveySubmissions: 16,
}

const MOCK_EVENTS = [
  { name: 'Ahmed Al Mansoori', email: 'ahmed@adnec.ae',   department: 'Engineering', timestamp: new Date(Date.now() - 10 * 60000) },
  { name: 'Sara Al Hashimi',   email: 'sara@adnec.ae',    department: 'HR',          timestamp: new Date(Date.now() - 34 * 60000) },
  { name: 'James Carter',      email: 'james@adnec.ae',   department: 'Finance',     timestamp: new Date(Date.now() - 2 * 3600000) },
  { name: 'Layla Khalid',      email: 'layla@adnec.ae',   department: 'Marketing',   timestamp: new Date(Date.now() - 5 * 3600000) },
  { name: 'Omar Bin Rashid',   email: 'omar@adnec.ae',    department: 'Operations',  timestamp: new Date(Date.now() - 8 * 3600000) },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
        try {
          // Call each separately so one failing doesn't crash the other
          let statsData  = { linksOpened: 0, journeysCompleted: 0, surveySubmissions: 0 }
          let eventsData = []
        
          try {
            const statsRes = await api.get('/analytics/stats')
            statsData = statsRes.data.data
          } catch {
            console.warn('Stats endpoint not available')
          }
        
          try {
            const eventsRes = await api.get('/api/tracking')
            eventsData = eventsRes.data.data.events.slice(0, 10)
          } catch {
            console.warn('Tracking endpoint not available')
          }
        
          setStats(statsData)
          setEvents(eventsData)
        } catch (err) {
          console.error('Dashboard load error', err)
        } finally {
          setLoading(false)
        }
      }
    load()
  }, [])

  return (
    <CMSLayout title="Dashboard">
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <div style={styles.wrapper}>

          {/* Stat Cards */}
          <div style={styles.stats}>
            <StatCard icon="🔗" label="Links Opened"        value={stats?.linksOpened}       color="#534AB7" />
            <StatCard icon="✅" label="Journeys Completed"  value={stats?.completions}        color="#0F6E56" />
            <StatCard icon="📋" label="Survey Submissions"  value={stats?.surveySubmissions}  color="#854F0B" />
          </div>

          <div style={styles.lower}>
            {/* Recent Activity */}
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Recent Activity</h2>
              <RecentActivity events={events} />
            </div>

            {/* Quick Nav */}
            <div style={styles.panel}>
              <h2 style={styles.panelTitle}>Quick Access</h2>
              <QuickNav />
            </div>
          </div>

        </div>
      )}
    </CMSLayout>
  )
}

const styles = {
  loading: { fontSize: '13px', color: '#888899' },
  wrapper: { display: 'flex', flexDirection: 'column', gap: '20px' },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  lower: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    alignItems: 'start',
  },
  panel: {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e8e4dc',
    padding: '20px',
  },
  panelTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '14px',
  },
}