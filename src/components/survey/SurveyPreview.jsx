export default function SurveyPreview({ questions }) {
  if (!questions || questions.length === 0) {
    return (
      <div style={styles.empty}>
        Add questions to see a preview.
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <p style={styles.note}>Preview — as seen by the employee</p>
      {questions.map((q, i) => (
        <div key={q.id || i} style={styles.card}>
          <p style={styles.num}>Question {i + 1} of {questions.length}</p>
          <p style={styles.question}>{q.question}</p>
          {q.type === 'text' && (
            <div style={styles.fakeTextarea}>Your answer...</div>
          )}
          {q.type === 'multiple_choice' && (
            <div style={styles.options}>
              {(q.options || []).map((opt, j) => (
                <div key={j} style={styles.option}>
                  <span style={styles.radio}/>
                  {opt || `Option ${j + 1}`}
                </div>
              ))}
            </div>
          )}
          {q.type === 'scale' && (
            <div style={styles.scale}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={styles.scaleBtn}>{n}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const styles = {
  wrapper:     { display: 'flex', flexDirection: 'column', gap: '10px' },
  empty:       { fontSize: '12px', color: '#888899', padding: '16px 0' },
  note:        { fontSize: '10px', fontWeight: '700', color: '#888899', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '4px' },
  card:        { background: 'white', border: '1px solid #e8e4dc', borderRadius: '10px', padding: '16px' },
  num:         { fontSize: '10px', color: '#888899', marginBottom: '6px' },
  question:    { fontSize: '13px', fontWeight: '500', color: '#1a1a2e', marginBottom: '12px', lineHeight: '1.5' },
  fakeTextarea:{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '12px', color: '#ccccdd', background: '#f7f5f0', minHeight: '60px' },
  options:     { display: 'flex', flexDirection: 'column', gap: '6px' },
  option:      { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '12px', color: '#888899' },
  radio:       { width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #e8e4dc', flexShrink: 0 },
  scale:       { display: 'flex', gap: '6px' },
  scaleBtn:    { flex: 1, height: '36px', borderRadius: '8px', border: '1.5px solid #e8e4dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#888899', background: '#f7f5f0' },
}