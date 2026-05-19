const TYPE_LABELS = {
  text:            { label: 'Text',  bg: '#e6f1fb', color: '#042c53' },
  multiple_choice: { label: 'MCQ',   bg: '#eeedfe', color: '#26215c' },
  scale:           { label: 'Scale', bg: '#e1f5ee', color: '#04342c' },
}

export default function QuestionList({ questions, onEdit, onDelete }) {
  if (questions.length === 0) {
    return (
      <div style={styles.empty}>
        No questions yet. Click "Add question" to get started.
      </div>
    )
  }

  return (
    <div style={styles.list}>
      {questions.map((q, i) => {
        const type = TYPE_LABELS[q.type] || TYPE_LABELS.text
        return (
          <div key={q.id || i} style={styles.row}>
            <div style={styles.num}>{i + 1}</div>
            <div style={styles.body}>
              <p style={styles.question}>{q.question}</p>
              <div style={styles.meta}>
                <span style={{
                  ...styles.typeBadge,
                  background: type.bg,
                  color:      type.color,
                }}>
                  {type.label}
                </span>
                {q.required && (
                  <span style={styles.required}>Required</span>
                )}
                {q.type === 'multiple_choice' && q.options?.length > 0 && (
                  <span style={styles.optCount}>
                    {q.options.length} options
                  </span>
                )}
              </div>
            </div>
            <div style={styles.actions}>
              <button onClick={() => onEdit(q)} style={styles.editBtn}>
                Edit
              </button>
              <button onClick={() => onDelete(q)} style={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  list:      { display: 'flex', flexDirection: 'column', gap: '6px' },
  empty:     { fontSize: '13px', color: '#888899', padding: '24px 0', textAlign: 'center' },
  row:       { display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'white', border: '1px solid #e8e4dc', borderRadius: '10px', padding: '14px 16px' },
  num:       { fontSize: '11px', fontWeight: '700', color: '#ccccdd', width: '20px', flexShrink: 0, paddingTop: '2px', textAlign: 'center' },
  body:      { flex: 1, minWidth: 0 },
  question:  { fontSize: '13px', fontWeight: '500', color: '#1a1a2e', marginBottom: '6px', lineHeight: '1.5' },
  meta:      { display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' },
  typeBadge: { fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' },
  required:  { fontSize: '10px', color: '#993c1d', background: '#faece7', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' },
  optCount:  { fontSize: '10px', color: '#888899' },
  actions:   { display: 'flex', gap: '6px', flexShrink: 0 },
  editBtn:   { padding: '5px 12px', borderRadius: '6px', border: '1px solid #e8e4dc', background: 'white', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a2e' },
  deleteBtn: { padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#fde8e8', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', color: '#7a1515' },
}