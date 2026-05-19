const LAYER_LABELS = {
  background: { label: 'Background', bg: '#eeedfe', color: '#26215c' },
  content:    { label: 'Content',    bg: '#e1f5ee', color: '#04342c' },
}

const SCREENS = ['screen-1', 'screen-2', 'screen-3']

const SCREEN_LABELS = {
  'screen-1': 'Screen 1 — Welcome',
  'screen-2': 'Screen 2 — Corporate',
  'screen-3': 'Screen 3 — Leadership',
}

export default function VideoList({ videos, onEdit, onDelete, onToggleActive }) {
  if (!videos || videos.length === 0) {
    return (
      <div style={styles.empty}>
        No videos yet. Click "Upload video" to get started.
      </div>
    )
  }

  // Group videos by screenId
  const grouped = SCREENS.reduce((acc, screenId) => {
    acc[screenId] = videos.filter(v => v.screenId === screenId)
    return acc
  }, {})

  return (
    <div style={styles.wrapper}>
      {SCREENS.map(screenId => (
        <div key={screenId} style={styles.screenGroup}>
          <p style={styles.screenLabel}>{SCREEN_LABELS[screenId]}</p>
          {grouped[screenId].length === 0 ? (
            <div style={styles.emptyScreen}>
              No videos uploaded for this screen yet.
            </div>
          ) : (
            grouped[screenId].map((video, i) => {
              const layer = LAYER_LABELS[video.layer] || LAYER_LABELS.content
              return (
                <div key={video.id || i} style={styles.row}>
                  <div style={styles.left}>
                    <span style={{
                      ...styles.layerBadge,
                      background: layer.bg,
                      color: layer.color,
                    }}>
                      {layer.label}
                    </span>
                    <div style={styles.info}>
                      <p style={styles.title}>{video.title}</p>
                      <p style={styles.url}>{video.url}</p>
                    </div>
                  </div>
                  <div style={styles.right}>
                    <span style={{
                      ...styles.activeBadge,
                      background: video.active ? '#e1f5ee' : '#fde8e8',
                      color: video.active ? '#04342c' : '#7a1515',
                    }}>
                      {video.active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => onToggleActive(video)}
                      style={styles.toggleBtn}
                    >
                      {video.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => onEdit(video)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(video)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ))}
    </div>
  )
}

const styles = {
  wrapper:      { display: 'flex', flexDirection: 'column', gap: '16px' },
  empty:        { fontSize: '13px', color: '#888899', padding: '24px 0', textAlign: 'center' },
  screenGroup:  { display: 'flex', flexDirection: 'column', gap: '6px' },
  screenLabel:  { fontSize: '11px', fontWeight: '700', color: '#888899', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '4px' },
  emptyScreen:  { fontSize: '12px', color: '#888899', padding: '12px 0' },
  row:          { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: 'white', border: '1px solid #e8e4dc', borderRadius: '10px', padding: '14px 16px' },
  left:         { display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 },
  layerBadge:   { fontSize: '10px', fontWeight: '600', padding: '3px 9px', borderRadius: '5px', flexShrink: 0 },
  info:         { minWidth: 0 },
  title:        { fontSize: '13px', fontWeight: '500', color: '#1a1a2e', marginBottom: '2px' },
  url:          { fontSize: '11px', color: '#888899', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' },
  right:        { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  activeBadge:  { fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '5px' },
  toggleBtn:    { padding: '5px 10px', borderRadius: '6px', border: '1px solid #e8e4dc', background: 'white', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', color: '#888899' },
  editBtn:      { padding: '5px 12px', borderRadius: '6px', border: '1px solid #e8e4dc', background: 'white', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a2e' },
  deleteBtn:    { padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#fde8e8', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', color: '#7a1515' },
}