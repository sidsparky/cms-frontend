import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { ROUTES } from '../services/constants'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

async function handleSubmit(e) {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('cms_token', res.data.data.token)
    navigate(ROUTES.DASHBOARD)
  } catch (err) {
    setError(err.response?.data?.message || 'Invalid email or password')
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>CMS Login</h1>
        <p style={styles.sub}>ADNEC Onboarding Platform</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@company.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f7f5f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #e8e4dc',
    boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  sub: {
    fontSize: '13px',
    color: '#888899',
    marginBottom: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#1a1a2e',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e8e4dc',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#1a1a2e',
  },
  error: {
    fontSize: '12px',
    color: '#c0392b',
    background: '#fde8e8',
    padding: '8px 12px',
    borderRadius: '6px',
  },
  btn: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#1a1a2e',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '4px',
  },
}