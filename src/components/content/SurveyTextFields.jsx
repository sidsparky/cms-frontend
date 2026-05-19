export default function SurveyTextFields({ values, onChange }) {
  return (
    <div style={styles.group}>
      <h3 style={styles.groupTitle}>Survey Screen</h3>

      <div style={styles.field}>
        <label style={styles.label}>Survey Eyebrow</label>
        <p style={styles.hint}>Small label above the survey title</p>
        <input
          style={styles.input}
          value={values.surveyEyebrow || ''}
          onChange={(e) => onChange('surveyEyebrow', e.target.value)}
          placeholder="Onboarding survey"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Survey Title</label>
        <input
          style={styles.input}
          value={values.surveyTitle || ''}
          onChange={(e) => onChange('surveyTitle', e.target.value)}
          placeholder="Welcome Aboard"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Survey Description</label>
        <p style={styles.hint}>Shown below the title</p>
        <input
          style={styles.input}
          value={values.surveyDesc || ''}
          onChange={(e) => onChange('surveyDesc', e.target.value)}
          placeholder="We'd love to get to know you better"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Submit Button Label</label>
        <input
          style={styles.input}
          value={values.submitLabel || ''}
          onChange={(e) => onChange('submitLabel', e.target.value)}
          placeholder="Submit responses"
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