export default function CompletionTextFields({ values, onChange }) {
  return (
    <div style={styles.group}>
      <h3 style={styles.groupTitle}>Completion Screen</h3>

      <div style={styles.field}>
        <label style={styles.label}>Completion Heading</label>
        <input
          style={styles.input}
          value={values.doneHeading || ''}
          onChange={(e) => onChange('doneHeading', e.target.value)}
          placeholder="You're all set!"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Completion Message</label>
        <p style={styles.hint}>Shown below the heading</p>
        <textarea
          style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
          value={values.doneMessage || ''}
          onChange={(e) => onChange('doneMessage', e.target.value)}
          placeholder="Thank you for completing your onboarding. Your team is looking forward to working with you."
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Next Steps Text</label>
        <p style={styles.hint}>Optional guidance shown after the message</p>
        <textarea
          style={{ ...styles.input, minHeight: '60px', resize: 'vertical' }}
          value={values.nextSteps || ''}
          onChange={(e) => onChange('nextSteps', e.target.value)}
          placeholder="Your manager will be in touch shortly."
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