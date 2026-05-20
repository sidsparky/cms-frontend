import { useEffect, useState } from 'react'
import CMSLayout from '../components/shared/CMSLayout'
import WelcomeTextFields from '../components/content/WelcomeTextFields'
import SurveyTextFields from '../components/content/SurveyTextFields'
import CompletionTextFields from '../components/content/CompletionTextFields'
import { useToastContext } from '../components/shared/CMSLayout'
import api from '../services/api'

const MOCK_CONTENT = {
  eyebrow:       'Day one starts here',
  heading:       'Welcome to the team',
  subtitle:      "We're glad you're here.",
  skipLabel:     'Skip video',
  continueLabel: 'Continue',
  surveyEyebrow: 'Onboarding survey',
  surveyTitle:   'Welcome Aboard',
  surveyDesc:    "We'd love to get to know you better",
  submitLabel:   'Submit responses',
  doneHeading:   "You're all set!",
  doneMessage:   'Thank you for completing your onboarding. Your team is looking forward to working with you.',
  nextSteps:     'Your manager will be in touch shortly.',
}

export default function ContentPage() {
  const showToast = useToastContext()
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
      async function load() {
        try {
          const res = await api.get('/api/content')
          // Convert array to object keyed by screenId for easy access
          const contentArray = res.data.data.content
          const contentObj   = {}
          contentArray.forEach(screen => {
            Object.assign(contentObj, screen)
          })
          setValues(contentObj)
        } catch {
          showToast('Failed to load content', 'error')
        } finally {
          setLoading(false)
        }
      }
    load()
  }, [])

  function handleChange(key, value) {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/api/content', values)
      showToast('App text saved successfully')
    } catch {
      showToast('Failed to save changes', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <CMSLayout title="App Text Editor">
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <div style={styles.wrapper}>
          <div style={styles.intro}>
            <p style={styles.introText}>
              Edit the text shown to employees in the onboarding app.
              Changes are applied immediately after saving.
            </p>
          </div>

          <div style={styles.grid}>
            <div style={styles.panel}>
              <WelcomeTextFields values={values} onChange={handleChange} />
            </div>
            <div style={styles.panel}>
              <SurveyTextFields values={values} onChange={handleChange} />
            </div>
            <div style={styles.panel}>
              <CompletionTextFields values={values} onChange={handleChange} />
            </div>
          </div>

          <div style={styles.footer}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={styles.saveBtn}
            >
              {saving ? 'Saving...' : 'Save all changes'}
            </button>
          </div>
        </div>
      )}
    </CMSLayout>
  )
}

const styles = {
  loading: { fontSize: '13px', color: '#888899' },
  wrapper: { display: 'flex', flexDirection: 'column', gap: '16px' },
  intro: {
    background: 'white',
    borderRadius: '10px',
    border: '1px solid #e8e4dc',
    padding: '14px 18px',
  },
  introText: { fontSize: '13px', color: '#555577', lineHeight: '1.6' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '12px',
  },
  panel: {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e8e4dc',
    padding: '20px',
  },
  footer: { display: 'flex', justifyContent: 'flex-end' },
  saveBtn: {
    padding: '11px 28px',
    borderRadius: '8px',
    border: 'none',
    background: '#1a1a2e',
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}