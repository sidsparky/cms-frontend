export default function VideoPreview({ video }) {
  if (!video || !video.url) {
    return (
      <div style={styles.empty}>
        No video to preview.
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <p style={styles.label}>Preview</p>
      <div style={styles.player}>
        <video
          key={video.url}
          src={video.url}
          controls
          style={styles.video}
        />
      </div>
      <div style={styles.meta}>
        <div style={styles.metaRow}>
          <span style={styles.metaKey}>Title</span>
          <span style={styles.metaVal}>{video.title}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.metaKey}>Screen</span>
          <span style={styles.metaVal}>{video.screenId}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.metaKey}>Layer</span>
          <span style={styles.metaVal}>{video.layer}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.metaKey}>Loop</span>
          <span style={styles.metaVal}>{video.loop ? 'Yes' : 'No'}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.metaKey}>Muted</span>
          <span style={styles.metaVal}>{video.muted ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper:  { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty:    { fontSize: '12px', color: '#888899', padding: '16px 0' },
  label:    { fontSize: '10px', fontWeight: '700', color: '#888899', textTransform: 'uppercase', letterSpacing: '.1em' },
  player:   { borderRadius: '10px', overflow: 'hidden', background: '#1a1a2e', aspectRatio: '16/9' },
  video:    { width: '100%', height: '100%', display: 'block' },
  meta:     { display: 'flex', flexDirection: 'column', gap: '6px' },
  metaRow:  { display: 'flex', justifyContent: 'space-between', fontSize: '11px', paddingBottom: '6px', borderBottom: '1px solid #f1efe8' },
  metaKey:  { color: '#888899', fontWeight: '500' },
  metaVal:  { color: '#1a1a2e', fontWeight: '500' },
}
