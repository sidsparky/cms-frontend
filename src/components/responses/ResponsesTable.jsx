import { useState } from 'react'

export default function ResponsesTable({ responses, questions }) {
  const [expanded, setExpanded] = useState(null)

  if (!responses || responses.length === 0) {
    return (
      <div style={styles.empty}>
        No survey responses yet.
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['Name', 'Email', 'Department', 'Submitted', 'Answers'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responses.map((resp, i) => (
            <>
              <tr
                key={resp.id || i}
                style={i % 2 === 0 ? styles.trEven : styles.trOdd}
              >
                <td style={styles.td}>
                  <div style={styles.nameCell}>
                    <div style={styles.avatar}>
                      {resp.employeeName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {resp.employeeName}
                  </div>
                </td>
                <td style={styles.td}>{resp.email}</td>
                <td style={styles.td}>
                  <span style={styles.deptBadge}>{resp.department}</span>
                </td>
                <td style={styles.td}>
                  {new Date(resp.submittedAt).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => setExpanded(expanded === resp.id ? null : resp.id)}
                    style={styles.viewBtn}
                  >
                    {expanded === resp.id ? 'Hide' : 'View answers'}
                  </button>
                </td>
              </tr>

              {/* Expanded answers row */}
              {expanded === resp.id && (
                <tr key={`${resp.id}-expanded`}>
                  <td colSpan={5} style={styles.expandedCell}>
                    <div style={styles.answers}>
                      {Object.entries(resp.answers || {}).map(([qId, answer]) => {
                        const question = questions?.find(q => q.id === qId)
                        return (
                          <div key={qId} style={styles.answerRow}>
                            <p style={styles.answerQ}>
                              {question?.question || qId}
                            </p>
                            <p style={styles.answerA}>{String(answer)}</p>
                          </div>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  wrapper:      { overflowX: 'auto' },
  empty:        { fontSize: '13px', color: '#888899', padding: '24px 0', textAlign: 'center' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th:           { textAlign: 'left', padding: '10px 14px', background: '#1a1a2e', color: 'white', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap' },
  trEven:       { background: 'white' },
  trOdd:        { background: '#f7f5f0' },
  td:           { padding: '12px 14px', color: '#1a1a2e', borderBottom: '1px solid #e8e4dc', verticalAlign: 'middle' },
  nameCell:     { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar:       { width: '28px', height: '28px', borderRadius: '50%', background: '#eeedfe', color: '#26215c', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  deptBadge:    { fontSize: '11px', fontWeight: '600', background: '#f1efe8', color: '#555577', padding: '3px 8px', borderRadius: '4px' },
  viewBtn:      { padding: '5px 12px', borderRadius: '6px', border: '1px solid #e8e4dc', background: 'white', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a2e' },
  expandedCell: { padding: '0', background: '#f7f5f0', borderBottom: '1px solid #e8e4dc' },
  answers:      { padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  answerRow:    { display: 'flex', flexDirection: 'column', gap: '3px' },
  answerQ:      { fontSize: '11px', fontWeight: '600', color: '#888899' },
  answerA:      { fontSize: '13px', color: '#1a1a2e' },
}
