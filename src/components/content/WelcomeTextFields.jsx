export default function WelcomeTextFields({ values, onChange }) {
  return (
    <div style={styles.group}>
      <h3 style={styles.groupTitle}>Welcome Screen</h3>

      <div style={styles.field}>
        <label style={styles.label}>Eyebrow Label</label>
        <p style={styles.hint}>Small text above the main heading</p>
        <input
          style={styles.input}
          value={values.eyebrow || ''}
          onChange={(e) => onChange('eyebrow', e.target.value)}
          placeholder="Day one starts here"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Welcome Heading</label>
        <p style={styles.hint}>Main title on the welcome screen</p>
        <input
          style={styles.input}
          value={values.heading || ''}
          onChange={(e) => onChange('heading', e.target.value)}
          placeholder="Welcome to the team"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Greeting Subtitle</label>
        <p style={styles.hint}>Line shown below the heading</p>
        <input
          style={styles.input}
          value={values.subtitle || ''}
          onChange={(e) => onChange('subtitle', e.target.value)}
          placeholder="We're glad you're here."
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Skip Button Label</label>
        <input
          style={styles.input}
          value={values.skipLabel || ''}
          onChange={(e) => onChange('skipLabel', e.target.value)}
          placeholder="Skip video"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Continue Button Label</label>
        <input
          style={styles.input}
          value={values.continueLabel || ''}
          onChange={(e) => onChange('continueLabel', e.target.value)}
          placeholder="Continue"
        />
      </div>
    </div>
  )
}

const styles = {
  group: { display: 'flex', flexDirection: 'column', gap: '16px' },
  groupTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#888899',
    textTransform: 'uppercase',
    letterSpacing: '.1em',
    paddingBottom: '10px',
    borderBottom: '1px solid #f1efe8',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  hint: { fontSize: '11px', color: '#888899' },
  input: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1.5px solid #e8e4dc',
    fontSize: '13px',
    fontFamily: 'inherit',
    color: '#1a1a2e',
    outline: 'none',
  },
}