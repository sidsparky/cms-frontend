import { useState, useEffect } from 'react'
import CMSLayout from '../components/shared/CMSLayout'
import { useToastContext } from '../components/shared/CMSLayout'
import Papa from 'papaparse'
import api from '../services/api'

export default function LinkGeneratorPage() {
  const showToast = useToastContext()
  const [step, setStep]               = useState('upload')  // upload → preview → generated
  const [employees, setEmployees]     = useState([])
  const [generatedLinks, setGeneratedLinks] = useState([])
  const [history, setHistory]         = useState([])
  const [loading, setLoading]         = useState(false)
  const [expiresIn, setExpiresIn]     = useState('7d')

  // Load history on mount
  useEffect(() => {
    async function loadHistory() {
        try {
          const res = await api.get('/auth/generated-links')
          setHistory(res.data.data.links)
        } catch {
          showToast('Failed to load link history', 'error')
        }
      }
    loadHistory()
  }, [])

  // Parse uploaded CSV
  function handleCSVUpload(file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const valid = results.data.filter(row =>
          row.employeeId && row.employeeName && row.email && row.department
        )
        if (valid.length === 0) {
          showToast('No valid rows found in CSV', 'error')
          return
        }
        setEmployees(valid)
        setStep('preview')
      },
      error: () => showToast('Failed to parse CSV', 'error')
    })
  }

  // Generate links
  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await api.post('/auth/generate-tokens', {
        employees,
        expiresIn,
      })
      setGeneratedLinks(res.data.data.links)
      setStep('generated')
      showToast(`${res.data.data.total} links generated successfully`)
    } catch {
      showToast('Failed to generate links', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Download CSV template
  function downloadTemplate() {
    const csv = 'employeeId,employeeName,email,department\nEMP001,John Doe,john@adnec.ae,Technology'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'employee_template.csv'
    a.click()
  }

  // Download generated links as CSV
  function downloadGeneratedLinks() {
    const rows = generatedLinks.map(l =>
      `${l.employeeId},${l.employeeName},${l.email},${l.department},${l.onboardingUrl},${l.expiresAt}`
    )
    const csv  = ['employeeId,employeeName,email,department,onboardingUrl,expiresAt', ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'generated_links.csv'
    a.click()
  }

  // Copy single link to clipboard
  function copyLink(url) {
    navigator.clipboard.writeText(url)
    showToast('Link copied to clipboard')
  }

  return (
    <CMSLayout title="Link Generator">
      <div style={styles.wrapper}>

        {/* Step 1 — Upload */}
        {step === 'upload' && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Upload Employee CSV</h2>
            <p style={styles.panelDesc}>
              Upload a CSV file with your new employees to generate
              personalised onboarding links for each one.
            </p>

            {/* Drop zone */}
            <div
              style={styles.dropzone}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                handleCSVUpload(e.dataTransfer.files[0])
              }}
            >
              <span style={styles.dropIcon}>📂</span>
              <p style={styles.dropText}>Drag and drop your CSV here</p>
              <p style={styles.dropSub}>or</p>
              <label style={styles.browseBtn}>
                Browse file
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={(e) => handleCSVUpload(e.target.files[0])}
                />
              </label>
            </div>

            <button onClick={downloadTemplate} style={styles.templateBtn}>
              ⬇ Download CSV template
            </button>
          </div>
        )}

        {/* Step 2 — Preview */}
        {step === 'preview' && (
          <div style={styles.panel}>
            <div style={styles.panelTop}>
              <div>
                <h2 style={styles.panelTitle}>Preview Employees</h2>
                <p style={styles.panelDesc}>
                  {employees.length} employee{employees.length !== 1 ? 's' : ''} found.
                  Review before generating links.
                </p>
              </div>
              <button
                onClick={() => { setStep('upload'); setEmployees([]) }}
                style={styles.backBtn}
              >
                Upload different file
              </button>
            </div>

            {/* Expiry selector */}
            <div style={styles.expiryRow}>
              <label style={styles.expiryLabel}>Link expiry</label>
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                style={styles.select}
              >
                <option value="1d">1 day</option>
                <option value="3d">3 days</option>
                <option value="7d">7 days</option>
                <option value="14d">14 days</option>
                <option value="30d">30 days</option>
              </select>
            </div>

            {/* Employee preview table */}
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Employee ID', 'Name', 'Email', 'Department'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>{emp.employeeId}</td>
                    <td style={styles.td}>{emp.employeeName}</td>
                    <td style={styles.td}>{emp.email}</td>
                    <td style={styles.td}>{emp.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.footer}>
              <button
                onClick={handleGenerate}
                disabled={loading}
                style={styles.generateBtn}
              >
                {loading ? 'Generating...' : `Generate ${employees.length} links`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Generated */}
        {step === 'generated' && (
          <div style={styles.panel}>
            <div style={styles.panelTop}>
              <div>
                <h2 style={styles.panelTitle}>Links Generated</h2>
                <p style={styles.panelDesc}>
                  {generatedLinks.length} links ready.
                  Copy individually or download all as CSV.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { setStep('upload'); setEmployees([]); setGeneratedLinks([]) }}
                  style={styles.backBtn}
                >
                  Generate more
                </button>
                <button onClick={downloadGeneratedLinks} style={styles.exportBtn}>
                  ⬇ Download CSV
                </button>
              </div>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Department', 'Expires', 'Link'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generatedLinks.map((link, i) => (
                  <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>{link.employeeName}</td>
                    <td style={styles.td}>{link.email}</td>
                    <td style={styles.td}>{link.department}</td>
                    <td style={styles.td}>
                      {new Date(link.expiresAt).toLocaleDateString('en-GB')}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => copyLink(link.onboardingUrl)}
                        style={styles.copyBtn}
                      >
                        Copy link
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* History */}
        {history.length > 0 && step === 'upload' && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Previously Generated Links</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Department', 'Generated', 'Expires', 'Status'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((link, i) => {
                  const statusColors = {
                    not_opened: { bg: '#faeeda', color: '#412402' },
                    opened:     { bg: '#eeedfe', color: '#26215c' },
                    completed:  { bg: '#e1f5ee', color: '#04342c' },
                  }
                  const sc = statusColors[link.status] || statusColors.not_opened
                  return (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>{link.employeeName}</td>
                      <td style={styles.td}>{link.email}</td>
                      <td style={styles.td}>{link.department}</td>
                      <td style={styles.td}>
                        {new Date(link.generatedAt).toLocaleDateString('en-GB')}
                      </td>
                      <td style={styles.td}>
                        {new Date(link.expiresAt).toLocaleDateString('en-GB')}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          background: sc.bg,
                          color: sc.color,
                        }}>
                          {link.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </CMSLayout>
  )
}

const styles = {
  wrapper:      { display: 'flex', flexDirection: 'column', gap: '16px' },
  panel:        { background: 'white', borderRadius: '12px', border: '1px solid #e8e4dc', padding: '24px' },
  panelTop:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  panelTitle:   { fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '4px' },
  panelDesc:    { fontSize: '12px', color: '#888899' },
  dropzone:     { border: '2px dashed #e8e4dc', borderRadius: '12px', padding: '40px', textAlign: 'center', marginTop: '16px', marginBottom: '12px' },
  dropIcon:     { fontSize: '32px', display: 'block', marginBottom: '8px' },
  dropText:     { fontSize: '13px', fontWeight: '500', color: '#1a1a2e', marginBottom: '4px' },
  dropSub:      { fontSize: '12px', color: '#888899', marginBottom: '12px' },
  browseBtn:    { display: 'inline-block', padding: '8px 20px', borderRadius: '8px', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  templateBtn:  { background: 'none', border: '1px solid #e8e4dc', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: '#888899', cursor: 'pointer', fontFamily: 'inherit' },
  expiryRow:    { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  expiryLabel:  { fontSize: '12px', fontWeight: '600', color: '#1a1a2e' },
  select:       { padding: '7px 12px', borderRadius: '8px', border: '1.5px solid #e8e4dc', fontSize: '13px', fontFamily: 'inherit', color: '#1a1a2e', outline: 'none' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
  th:           { textAlign: 'left', padding: '10px 12px', background: '#1a1a2e', color: 'white', fontWeight: '600', fontSize: '11px' },
  trEven:       { background: 'white' },
  trOdd:        { background: '#f7f5f0' },
  td:           { padding: '10px 12px', color: '#1a1a2e', borderBottom: '1px solid #e8e4dc' },
  footer:       { display: 'flex', justifyContent: 'flex-end', marginTop: '16px' },
  generateBtn:  { padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  backBtn:      { padding: '8px 16px', borderRadius: '8px', border: '1px solid #e8e4dc', background: 'white', fontSize: '12px', color: '#888899', cursor: 'pointer', fontFamily: 'inherit' },
  exportBtn:    { padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: 'white', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  copyBtn:      { padding: '4px 10px', borderRadius: '6px', border: '1px solid #e8e4dc', background: 'white', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', color: '#1a1a2e' },
  statusBadge:  { padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', textTransform: 'capitalize' },
}