import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../services/constants'

export default function AuthGuard({ children }) {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn()) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}