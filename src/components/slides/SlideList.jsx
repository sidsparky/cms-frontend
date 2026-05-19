export default function SlideList({ slides, onEdit, onDelete }) {
  if (!slides || slides.length === 0) {
    return (
      <div style={styles.empty}>
        No slides yet for this department. Click "Add slide" to get started.
      </div>
    )
  }

  return (
    <div style={styles.list}>
      {slides.map((slide, i) => (
        <div key={slide.id || i} style={styles.row}>

          <div style={styles.num}>{i + 1}</div>

          <div style={styles.body}>
            <p style={styles.title}>{slide.title}</p>
            <p style={styles.excerpt}>
              {slide.body?.length > 80
                ? slide.body.substring(0, 80) + '...'
                : slide.body}
            </p>
            <div style={styles.meta}>
              {slide.images?.length > 0 && (
                <span style={styles.metaTag}>
                  🖼 {slide.images.length} image{slide.images.length !== 1 ? 's' : ''}
                </span>
              )}
              {slide.audio?.length > 0 && (
                <span style={styles.metaTag}>
                  🔊 {slide.audio.length} audio{slide.audio.length !== 1 ? 's' : ''}
                </span>
              )}
              {slide.subtitleText && (
                <span style={styles.metaTag}>💬 Subtitle</span>
              )}
              <span style={styles.metaTag}>
                🔘 {slide.buttonLabel || 'Next'}
              </span>
            </div>
          </div>

          <div style={styles.actions}>
            <button onClick={() => onEdit(slide)} style={styles.editBtn}>
              Edit
            </button>
            <button onClick={() => onDelete(slide)} style={styles.deleteBtn}>
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  )
}

const styles = {
  list:     { display: 'flex', flexDirection: 'column', gap: '6px' },
  empty:    { fontSize: '13px', color: '#888899', padding: '24px 0', textAlign: 'center' },
  row:      { display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'white', border: '1px solid #e8e4dc', borderRadius: '10px', padding: '14px 16px' },
  num:      { fontSize: '11px', fontWeight: '700', color: '#ccccdd', width: '20px', flexShrink: 0, paddingTop: '2px', textAlign: 'center' },
  body:     { flex: 1, minWidth: 0 },
  title:    { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '3px' },
  excerpt:  { fontSize: '11px', color: '#888899', lineHeight: '1.5', marginBottom: '6px' },
  meta:     { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  metaTag:  { fontSize: '10px', color: '#555577', background: '#f1efe8', padding: '2px 8px', borderRadius: '4px' },
  actions:  { display: 'flex', gap: '6px', flexShrink: 0 },
  editBtn:  { padding: '5px 12px', borderRadius: '6px', border: '1px solid #e8e4dc', background: 'white', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a2e' },
  deleteBtn:{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#fde8e8', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', color: '#7a1515' },
}