import { useEffect, useState, useMemo } from 'react'
import CMSLayout from '../components/shared/CMSLayout'
import { useToastContext } from '../components/shared/CMSLayout'
import FilterBar from '../components/responses/FilterBar'
import ExportButton from '../components/responses/ExportButton'
import ResponsesTable from '../components/responses/ResponsesTable'
import TrackingTable from '../components/responses/TrackingTable'
import api from '../services/api'

const EMPTY_FILTERS = { search: '', department: '', from: '', to: '' }

const MOCK_QUESTIONS = [
  { id: 'q1', question: 'What drew you to joining ADNEC?' },
  { id: 'q2', question: 'How would you describe your work style?' },
  { id: 'q3', question: 'How comfortable are you with remote/hybrid work?' },
  { id: 'q4', question: 'What are you most excited to achieve in your first 90 days?' },
]

const MOCK_RESPONSES = [
  {
    id: 'resp-001', employeeName: 'Ahmed Al Mansoori',
    email: 'ahmed@adnec.ae', department: 'Technology',
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    answers: { q1: 'The innovative culture and the scale of events.', q2: 'Collaborative', q3: 4, q4: 'Get fully up to speed on the tech stack.' }
  },
  {
    id: 'resp-002', employeeName: 'Sara Al Hashimi',
    email: 'sara@adnec.ae', department: 'Finance',
    submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    answers: { q1: 'ADNEC is a world-class institution.', q2: 'Structured', q3: 3, q4: 'Build strong relationships with the team.' }
  },
  {
    id: 'resp-003', employeeName: 'James Carter',
    email: 'james@adnec.ae', department: 'Operations',
    submittedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    answers: { q1: 'The reputation and growth opportunities.', q2: 'Independent', q3: 5, q4: 'Deliver my first project successfully.' }
  },
]

const MOCK_EVENTS = [
  { id: 'evt-001', employeeName: 'Ahmed Al Mansoori', email: 'ahmed@adnec.ae', department: 'Technology', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),  status: 'completed' },
  { id: 'evt-002', employeeName: 'Sara Al Hashimi',   email: 'sara@adnec.ae',  department: 'Finance',    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),  status: 'completed' },
  { id: 'evt-003', employeeName: 'James Carter',      email: 'james@adnec.ae', department: 'Operations', timestamp: new Date(Date.now() - 25 * 3600000).toISOString(), status: 'completed' },
  { id: 'evt-004', employeeName: 'Layla Khalid',      email: 'layla@adnec.ae', department: 'Marketing',  timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),  status: 'opened' },
  { id: 'evt-005', employeeName: 'Omar Bin Rashid',   email: 'omar@adnec.ae',  department: 'HR',         timestamp: new Date(Date.now() - 30 * 60000).toISOString(),   status: 'not_opened' },
]

export default function ResponsesPage() {
  const showToast = useToastContext()
  const [activeTab, setActiveTab]   = useState('responses')
  const [responses, setResponses]   = useState([])
  const [events, setEvents]         = useState([])
  const [questions, setQuestions]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [filters, setFilters]       = useState(EMPTY_FILTERS)

  useEffect(() => {
    async function load() {
  try {
    const [respRes, eventsRes, questionsRes] = await Promise.all([
      api.get('/api/responses'),
      api.get('/api/tracking'),
      api.get('/api/questions'),
    ])
    setResponses(respRes.data.data.responses)
    setEvents(eventsRes.data.data.events)
    setQuestions(questionsRes.data.data.questions)
  } catch {
    showToast('Failed to load data', 'error')
  } finally {
    setLoading(false)
  }
}
    load()
  }, [])

  // Apply filters
  const filteredResponses = useMemo(() => {
    return responses.filter(r => {
      const search = filters.search.toLowerCase()
      if (search && !r.employeeName?.toLowerCase().includes(search) &&
                    !r.email?.toLowerCase().includes(search)) return false
      if (filters.department && r.department !== filters.department) return false
      if (filters.from && new Date(r.submittedAt) < new Date(filters.from)) return false
      if (filters.to   && new Date(r.submittedAt) > new Date(filters.to))   return false
      return true
    })
  }, [responses, filters])

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const search = filters.search.toLowerCase()
      if (search && !e.employeeName?.toLowerCase().includes(search) &&
                    !e.email?.toLowerCase().includes(search)) return false
      if (filters.department && e.department !== filters.department) return false
      if (filters.from && new Date(e.timestamp) < new Date(filters.from)) return false
      if (filters.to   && new Date(e.timestamp) > new Date(filters.to))   return false
      return true
    })
  }, [events, filters])

  return (
    <CMSLayout title="Responses & Tracking">
      {loading ? (
        <p style={{ fontSize: '13px', color: '#888899' }}>Loading...</p>
      ) : (
        <div style={styles.wrapper}>

          {/* Filter bar */}
          <FilterBar
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(EMPTY_FILTERS)}
          />

          {/* Tabs + Export */}
          <div style={styles.tabRow}>
            <div style={styles.tabs}>
              {[
                { key: 'responses', label: `Survey Responses (${filteredResponses.length})` },
                { key: 'tracking',  label: `Link Tracking (${filteredEvents.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    ...styles.tab,
                    background: activeTab === tab.key ? '#1a1a2e' : 'white',
                    color:      activeTab === tab.key ? 'white'   : '#888899',
                    border:     `1px solid ${activeTab === tab.key ? '#1a1a2e' : '#e8e4dc'}`,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <ExportButton filters={filters} />
          </div>

          {/* Table panel */}
          <div style={styles.panel}>
            {activeTab === 'responses' && (
              <ResponsesTable
                responses={filteredResponses}
                questions={questions}
              />
            )}
            {activeTab === 'tracking' && (
              <TrackingTable events={filteredEvents} />
            )}
          </div>

        </div>
      )}
    </CMSLayout>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '14px' },
  tabRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tabs:    { display: 'flex', gap: '8px' },
  tab:     { padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
  panel:   { background: 'white', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '0', overflow: 'hidden' },
}