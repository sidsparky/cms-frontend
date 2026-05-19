import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../services/constants'

export function useAuth() {
  const navigate = useNavigate()

  function getToken() {
    return localStorage.getItem('cms_token')
  }

  function isLoggedIn() {
    const token = getToken()
    if (!token) return false

    try {
      // Decode JWT payload (middle part)
      const payload = JSON.parse(atob(token.split('.')[1]))
      // Check expiry
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }

  function logout() {
    localStorage.removeItem('cms_token')
    navigate(ROUTES.LOGIN)
  }

  return { getToken, isLoggedIn, logout }
}