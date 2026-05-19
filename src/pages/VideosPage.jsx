import { useEffect, useState } from 'react'
import CMSLayout from '../components/shared/CMSLayout'
import { useToastContext } from '../components/shared/CMSLayout'
import VideoList from '../components/videos/VideoList'
import VideoForm from '../components/videos/VideoForm'
import AvatarConfig from '../components/videos/AvatarConfig'
import ConfirmModal from '../components/shared/ConfirmModal'
import api from '../services/api'

const MOCK_VIDEOS = [
  { id: 'vid-001', title: 'Background Loop',    screenId: 'screen-1', layer: 'background', url: 'https://cdn.adnec.ae/videos/bg-loop-screen1.mp4',      loop: true,  muted: true,  active: true },
  { id: 'vid-002', title: 'Welcome Content',    screenId: 'screen-1', layer: 'content',    url: 'https://cdn.adnec.ae/videos/welcome-content.mp4',       loop: false, muted: false, active: true },
  { id: 'vid-003', title: 'Background Loop',    screenId: 'screen-2', layer: 'background', url: 'https://cdn.adnec.ae/videos/bg-loop-screen2.mp4',      loop: true,  muted: true,  active: true },
  { id: 'vid-004', title: 'Corporate Overview', screenId: 'screen-2', layer: 'content',    url: 'https://cdn.adnec.ae/videos/corporate-overview.mp4',    loop: false, muted: false, active: true },
  { id: 'vid-005', title: 'Background Loop',    screenId: 'screen-3', layer: 'background', url: 'https://cdn.adnec.ae/videos/bg-loop-screen3.mp4',      loop: true,  muted: true,  active: true },
  { id: 'vid-006', title: 'Leadership Message', screenId: 'screen-3', layer: 'content',    url: 'https://cdn.adnec.ae/videos/leadership-message.mp4',    loop: false, muted: false, active: true },
]

export default function VideosPage() {
  const showToast = useToastContext()
  const [videos, setVideos]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [editing, setEditing]         = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [activeTab, setActiveTab]     = useState('videos')

  useEffect(() => {
    async function load() {
  try {
    const res = await api.get('/api/videos')
    setVideos(res.data.data.videos)
  } catch {
    showToast('Failed to load videos', 'error')
  } finally {
    setLoading(false)
  }
}
    load()
  }, [])

  async function handleSave(form, file) {
  try {
    if (editing) {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (file) formData.append('file', file)
      const res = await api.put(`/api/videos/${editing.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setVideos(prev =>
        prev.map(v => v.id === editing.id ? res.data.data : v)
      )
      showToast('Video updated successfully')
    } else {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (file) formData.append('file', file)
      const res = await api.post('/api/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setVideos(prev => [...prev, res.data.data])
      showToast('Video uploaded successfully')
    }
    setShowForm(false)
    setEditing(null)
  } catch {
    showToast('Failed to save video', 'error')
  }
}

  async function handleToggleActive(video) {
  try {
    const res = await api.put(`/api/videos/${video.id}`, {
      active: !video.active
    })
    setVideos(prev =>
      prev.map(v => v.id === video.id ? res.data.data : v)
    )
    showToast(`Video ${video.active ? 'deactivated' : 'activated'}`)
  } catch {
    showToast('Failed to update video', 'error')
  }
}

  async function handleDelete() {
  try {
    await api.delete(`/api/videos/${confirmDelete.id}`)
    setVideos(prev => prev.filter(v => v.id !== confirmDelete.id))
    showToast('Video deleted')
  } catch {
    showToast('Failed to delete video', 'error')
  } finally {
    setConfirmDelete(null)
  }
}

  function handleEdit(video) {
    setEditing(video)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditing(null)
  }

  return (
    <CMSLayout title="Videos Manager">
      {loading ? (
        <p style={{ fontSize: '13px', color: '#888899' }}>Loading...</p>
      ) : (
        <div style={styles.wrapper}>

          {/* Tabs */}
          <div style={styles.tabs}>
            {[
              { key: 'videos', label: 'Videos' },
              { key: 'avatar', label: 'Avatar Settings' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setShowForm(false) }}
                style={{
                  ...styles.tab,
                  background:   activeTab === tab.key ? '#1a1a2e' : 'white',
                  color:        activeTab === tab.key ? 'white' : '#888899',
                  border:       `1px solid ${activeTab === tab.key ? '#1a1a2e' : '#e8e4dc'}`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Videos tab */}
          {activeTab === 'videos' && (
            <div style={styles.content}>
              <div style={styles.topBar}>
                <p style={styles.count}>
                  {videos.length} video{videos.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={() => { setShowForm(true); setEditing(null) }}
                  style={styles.addBtn}
                >
                  + Upload video
                </button>
              </div>

              {showForm && (
                <div style={{ marginBottom: '12px' }}>
                  <VideoForm
                    initial={editing}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>
              )}

              <VideoList
                videos={videos}
                onEdit={handleEdit}
                onDelete={(v) => setConfirmDelete(v)}
                onToggleActive={handleToggleActive}
              />
            </div>
          )}

          {/* Avatar tab */}
          {activeTab === 'avatar' && (
            <div style={styles.content}>
              <AvatarConfig />
            </div>
          )}

        </div>
      )}

      <ConfirmModal
        message={confirmDelete ? `Delete "${confirmDelete.title}"? This cannot be undone.` : null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </CMSLayout>
  )
}

const styles = {
  wrapper:  { display: 'flex', flexDirection: 'column', gap: '16px' },
  tabs:     { display: 'flex', gap: '8px' },
  tab:      { padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' },
  content:  { display: 'flex', flexDirection: 'column', gap: '12px' },
  topBar:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  count:    { fontSize: '13px', color: '#888899' },
  addBtn:   { padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
}