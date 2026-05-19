export default function SlidePreview({ slide }) {
  if (!slide) {
    return (
      <div style={styles.empty}>
        Select or create a slide to see a preview.
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <p style={styles.note}>Preview — as seen by the employee</p>

      <div style={styles.card}>

        {/* Images */}
        {slide.images?.length > 0 && (
          <div style={styles.imageStrip}>
            {slide.images.map((img, i) => (
              <div key={i} style={styles.imagePlaceholder}>
                {img.url ? (
                  <img src={img.url} alt={img.caption || ''} style={styles.image}/>
                ) : (
                  <span style={styles.imageFallback}>🖼 Image {i + 1}</span>
                )}
                {img.caption && (
                  <p style={styles.caption}>{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <p style={styles.slideTitle}>{slide.title || 'Slide title'}</p>

        {/* Body */}
        <p style={styles.slideBody}>
          {slide.body || 'Slide body text will appear here.'}
        </p>

        {/* Subtitle */}
        {slide.subtitleText && (
          <p style={styles.subtitle}>{slide.subtitleText}</p>
        )}

        {/* Audio indicator */}
        {slide.audio?.length > 0 && (
          <div style={styles.audioBar}>
            {slide.audio.map((a, i) => (
              <div key={i} style={styles.audioItem}>
                🔊 {a.label || `Audio ${i + 1}`}
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <div style={styles.btnRow}>
          <div style={styles.backFake}>← Back</div>
          <div style={styles.nextFake}>
            {slide.buttonLabel || 'Next'} →
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  wrapper:          { display: 'flex', flexDirection: 'column', gap: '10px' },
  empty:            { fontSize: '12px', color: '#888899', padding: '16px 0' },
  note:             { fontSize: '10px', fontWeight: '700', color: '#888899', textTransform: 'uppercase', letterSpacing: '.08em' },
  card:             { background: 'white', border: '1px solid #e8e4dc', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  imageStrip:       { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  imagePlaceholder: { flex: 1, minWidth: '80px', borderRadius: '8px', overflow: 'hidden', background: '#f1efe8', minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  image:            { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  imageFallback:    { fontSize: '11px', color: '#888899' },
  caption:          { fontSize: '9px', color: '#888899', padding: '3px 6px', textAlign: 'center' },
  slideTitle:       { fontSize: '14px', fontWeight: '600', color: '#1a1a2e', lineHeight: '1.4' },
  slideBody:        { fontSize: '11px', color: '#555577', lineHeight: '1.6' },
  subtitle:         { fontSize: '10px', color: '#888899', fontStyle: 'italic' },
  audioBar:         { display: 'flex', flexDirection: 'column', gap: '4px' },
  audioItem:        { fontSize: '10px', color: '#555577', background: '#f1efe8', padding: '4px 8px', borderRadius: '5px' },
  btnRow:           { display: 'flex', justifyContent: 'space-between', marginTop: '4px' },
  backFake:         { fontSize: '11px', color: '#888899', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e8e4dc' },
  nextFake:         { fontSize: '11px', color: 'white', background: '#1a1a2e', padding: '6px 14px', borderRadius: '6px' },
}