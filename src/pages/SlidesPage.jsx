import { useEffect, useState } from 'react'
import CMSLayout from '../components/shared/CMSLayout'
import { useToastContext } from '../components/shared/CMSLayout'
import DepartmentSelector from '../components/slides/DepartmentSelector'
import SlideList from '../components/slides/SlideList'
import SlideForm from '../components/slides/SlideForm'
import SlidePreview from '../components/slides/SlidePreview'
import ConfirmModal from '../components/shared/ConfirmModal'
import api from '../services/api'

const MOCK_SLIDES = {
  Technology: [
    {
      id: 'slide-001', order: 1,
      title: 'Welcome to Technology',
      body: 'Here is what your first week looks like. You will be meeting your team and getting set up.',
      subtitleText: 'Use the arrows to navigate',
      buttonLabel: 'Next', buttonAction: 'next_slide',
      images: [{ id: 'img-001', url: '', caption: 'Our Technology Hub', order: 1 }],
      audio: [{ id: 'aud-001', url: '', label: 'Introduction', order: 1 }],
    },
    {
      id: 'slide-002', order: 2,
      title: 'Your Team',
      body: 'Here are the people you will be working with every day.',
      subtitleText: null,
      buttonLabel: 'Next', buttonAction: 'next_slide',
      images: [],
      audio: [],
    },
  ],
  Finance: [
    {
      id: 'slide-003', order: 1,
      title: 'Welcome to Finance',
      body: 'Here is an overview of the Finance department and your key responsibilities.',
      subtitleText: 'Use the arrows to navigate',
      buttonLabel: 'Next', buttonAction: 'next_slide',
      images: [],
      audio: [],
    },
  ],
  Operations: [],
  Marketing:  [],
  HR:         [],
  Legal:      [],
}

export default function SlidesPage() {
  const showToast = useToastContext()
  const [department, setDepartment]   = useState('Technology')
  const [slides, setSlides]           = useState({})
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [editing, setEditing]         = useState(null)
  const [preview, setPreview]         = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    async function load() {
        try {
          const res = await api.get('/api/slides')
          // Group slides by department
          const grouped = {}
          res.data.data.slides.forEach(slide => {
            if (!grouped[slide.department]) grouped[slide.department] = []
            grouped[slide.department].push(slide)
          })
          // Sort each department's slides by order
          Object.keys(grouped).forEach(dept => {
            grouped[dept].sort((a, b) => a.order - b.order)
          })
          setSlides(grouped)
        } catch {
          showToast('Failed to load slides', 'error')
        } finally {
          setLoading(false)
        }
      }
    load()
  }, [])

  const currentSlides = slides[department] || []

  async function handleSave(form) {
    try {
      const formData = new FormData()
      formData.append('department',   department)
      formData.append('title',        form.title)
      formData.append('body',         form.body)
      formData.append('subtitleText', form.subtitleText || '')
      formData.append('buttonLabel',  form.buttonLabel  || 'Next')
      formData.append('buttonAction', form.buttonAction || 'next_slide')
      formData.append('order',        form.order || currentSlides.length + 1)
    
      form.images?.forEach(img => {
        if (img.file) formData.append('images', img.file)
      })
    
      form.audio?.forEach(a => {
        if (a.file) formData.append('audio', a.file)
      })
    
      if (editing) {
        const res = await api.put(`/api/slides/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setSlides(prev => ({
          ...prev,
          [department]: prev[department].map(s =>
            s.id === editing.id ? res.data.data : s
          )
        }))
      } else {
        const res = await api.post('/api/slides', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setSlides(prev => ({
          ...prev,
          [department]: [...(prev[department] || []), res.data.data]
        }))
      }
      showToast(editing ? 'Slide updated successfully' : 'Slide added successfully')
      setShowForm(false)
      setEditing(null)
      setPreview(null)
    } catch {
      showToast('Failed to save slide', 'error')
    }
  }

  async function handleDelete() {
  try {
    await api.delete(`/api/slides/${confirmDelete.id}`)
    setSlides(prev => ({
      ...prev,
      [department]: prev[department].filter(s => s.id !== confirmDelete.id)
    }))
    showToast('Slide deleted')
  } catch {
    showToast('Failed to delete slide', 'error')
  } finally {
    setConfirmDelete(null)
  }
}

  function handleEdit(slide) {
    setEditing(slide)
    setPreview(slide)
    setShowForm(true)
    setShowPreview(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditing(null)
    setPreview(null)
  }

  function handleDeptChange(dept) {
    setDepartment(dept)
    setShowForm(false)
    setEditing(null)
    setPreview(null)
  }

  return (
    <CMSLayout title="Department Slides">
      {loading ? (
        <p style={{ fontSize: '13px', color: '#888899' }}>Loading...</p>
      ) : (
        <div style={styles.wrapper}>

          {/* Department selector */}
          <div style={styles.panel}>
            <DepartmentSelector
              selected={department}
              onChange={handleDeptChange}
            />
          </div>

          {/* Top bar */}
          <div style={styles.topBar}>
            <p style={styles.count}>
              {currentSlides.length} slide{currentSlides.length !== 1 ? 's' : ''} for {department}
            </p>
            <div style={styles.topActions}>
              <button
                onClick={() => { setShowPreview(!showPreview); if (showPreview) setPreview(null) }}
                style={styles.previewBtn}
              >
                {showPreview ? 'Hide preview' : 'Show preview'}
              </button>
              <button
                onClick={() => { setShowForm(true); setEditing(null); setPreview(null); setShowPreview(true) }}
                style={styles.addBtn}
              >
                + Add slide
              </button>
            </div>
          </div>

          <div style={styles.layout}>

            {/* Left — list + form */}
            <div style={styles.left}>
              {showForm && (
                <div style={{ marginBottom: '12px' }}>
                  <SlideForm
                    initial={editing}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onChange={(updated) => setPreview(updated)}
                  />
                </div>
              )}
              <SlideList
                slides={currentSlides}
                onEdit={handleEdit}
                onDelete={(s) => setConfirmDelete(s)}
              />
            </div>

            {/* Right — preview */}
            {showPreview && (
              <div style={styles.right}>
                <div style={styles.previewPanel}>
                  <SlidePreview slide={preview} />
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      <ConfirmModal
        message={confirmDelete
          ? `Delete "${confirmDelete.title}"? This will also remove all its images and audio. This cannot be undone.`
          : null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </CMSLayout>
  )
}

const styles = {
  wrapper:      { display: 'flex', flexDirection: 'column', gap: '14px' },
  panel:        { background: 'white', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '16px 20px' },
  topBar:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  count:        { fontSize: '13px', color: '#888899' },
  topActions:   { display: 'flex', gap: '8px' },
  previewBtn:   { padding: '8px 16px', borderRadius: '8px', border: '1px solid #e8e4dc', background: 'white', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a2e' },
  addBtn:       { padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  layout:       { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  left:         { flex: 1, minWidth: 0 },
  right:        { width: '300px', flexShrink: 0 },
  previewPanel: { background: 'white', border: '1px solid #e8e4dc', borderRadius: '12px', padding: '20px', position: 'sticky', top: '20px' },
}