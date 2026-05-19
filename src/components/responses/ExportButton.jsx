import { useState } from 'react'
import api from '../../services/api'

export default function ExportButton({ filters }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
  setLoading(true)
  try {
    const res = await api.get('/api/responses/export', {
      params:       filters,
      responseType: 'blob',
    })
    const url      = URL.createObjectURL(new Blob([res.data]))
    const a        = document.createElement('a')
    a.href         = url
    a.download     = 'responses.csv'
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    console.error('Export failed')
  } finally {
    setLoading(false)
  }
}

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      style={styles.btn}
    >
      {loading ? 'Exporting...' : '⬇ Export CSV'}
    </button>
  )
}

const styles = {
  btn: {
    padding: '8px 18px', borderRadius: '8px', border: 'none',
    background: '#1a1a2e', color: 'white', fontSize: '13px',
    fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit',
  },
}