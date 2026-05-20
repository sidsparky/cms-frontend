import { useEffect, useState } from 'react'
import CMSLayout from '../components/shared/CMSLayout'
import { useToastContext } from '../components/shared/CMSLayout'
import QuestionList from '../components/survey/QuestionList'
import QuestionForm from '../components/survey/QuestionForm'
import SurveyPreview from '../components/survey/SurveyPreview'
import ConfirmModal from '../components/shared/ConfirmModal'
import api from '../services/api'

const MOCK_QUESTIONS = [
  { id: 'q1', question: 'What drew you to joining ADNEC?',                               type: 'text',            required: true  },
  { id: 'q2', question: 'How would you describe your work style?',                        type: 'multiple_choice', options: ['Independent', 'Collaborative', 'Flexible', 'Structured'], required: true  },
  { id: 'q3', question: 'How comfortable are you with remote/hybrid work?',               type: 'scale',           required: true  },
  { id: 'q4', question: 'What are you most excited to achieve in your first 90 days?',   type: 'text',            required: false },
]

export default function SurveyPage() {
  const showToast = useToastContext()
  const [questions, setQuestions]         = useState([])
  const [loading, setLoading]             = useState(true)
  const [showForm, setShowForm]           = useState(false)
  const [editing, setEditing]             = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showPreview, setShowPreview]     = useState(false)

  useEffect(() => {
    async function load() {
  try {
    const res = await api.get('/api/questions')
    setQuestions(res.data.data.questions)
  } catch {
    showToast('Failed to load questions', 'error')
  } finally {
    setLoading(false)
  }
}
    load()
  }, [])

  async function handleSave(form) {
    try {
      if (editing) {
        const res = await api.put(`/api/questions/${editing.id}`, form)
        setQuestions(prev =>
          prev.map(q => q.id === editing.id ? res.data.data : q)
        )
      } else {
        await api.post('/api/questions', form)
        const listRes = await api.get('/api/questions')
        setQuestions(listRes.data.data.questions)
      }
      showToast(editing ? 'Question updated successfully' : 'Question added successfully')
      setShowForm(false)
      setEditing(null)
    } catch {
      showToast('Failed to save question', 'error')
    }
  }

  function handleEdit(q) {
    setEditing(q)
    setShowForm(true)
    setShowPreview(false)
  }

  async function handleDelete() {
  try {
    await api.delete(`/api/questions/${confirmDelete.id}`)
    setQuestions(prev => prev.filter(q => q.id !== confirmDelete.id))
    showToast('Question deleted')
  } catch {
    showToast('Failed to delete question', 'error')
  } finally {
    setConfirmDelete(null)
  }
}

  function handleCancel() {
    setShowForm(false)
    setEditing(null)
  }

  return (
    <CMSLayout title="Survey Builder">
      {loading ? (
        <p style={{ fontSize: '13px', color: '#888899' }}>Loading...</p>
      ) : (
        <div style={styles.wrapper}>

          {/* Top bar */}
          <div style={styles.topBar}>
            <p style={styles.count}>
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </p>
            <div style={styles.topActions}>
              <button
                onClick={() => {
                  setShowPreview(!showPreview)
                  setShowForm(false)
                }}
                style={styles.previewBtn}
              >
                {showPreview ? 'Hide preview' : 'Preview survey'}
              </button>
              <button
                onClick={() => {
                  setShowForm(true)
                  setEditing(null)
                  setShowPreview(false)
                }}
                style={styles.addBtn}
              >
                + Add question
              </button>
            </div>
          </div>

          <div style={styles.layout}>

            {/* Left — list + form */}
            <div style={styles.left}>
              {showForm && (
                <div style={{ marginBottom: '12px' }}>
                  <QuestionForm
                    initial={editing}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>
              )}
              <QuestionList
                questions={questions}
                onEdit={handleEdit}
                onDelete={(q) => setConfirmDelete(q)}
              />
            </div>

            {/* Right — preview */}
            {showPreview && (
              <div style={styles.right}>
                <div style={styles.previewPanel}>
                  <SurveyPreview questions={questions} />
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      <ConfirmModal
        message={confirmDelete
          ? `Delete "${confirmDelete.question}"? This cannot be undone.`
          : null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </CMSLayout>
  )
}

const styles = {
  wrapper:      { display: 'flex', flexDirection: 'column', gap: '16px' },
  topBar:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  count:        { fontSize: '13px', color: '#888899' },
  topActions:   { display: 'flex', gap: '8px' },
  previewBtn:   { padding: '8px 16px', borderRadius: '8px', border: '1px solid #e8e4dc', background: 'white', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a2e' },
  addBtn:       { padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  layout:       { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  left:         { flex: 1, minWidth: 0 },
  right:        { width: '320px', flexShrink: 0 },
  previewPanel: { background: 'white', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '20px', position: 'sticky', top: '20px' },
}