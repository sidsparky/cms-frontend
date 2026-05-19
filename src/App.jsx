import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './services/constants'
import Dashboard from './pages/Dashboard'
import ContentPage from './pages/ContentPage'
import AuthGuard from './components/auth/AuthGuard'
import CMSLayout from './components/shared/CMSLayout'
import LoginPage from './pages/LoginPage'
import LinkGeneratorPage from './pages/LinkGeneratorPage'
import VideosPage from './pages/VideosPage'
import SlidesPage from './pages/SlidesPage'
import ResponsesPage from './pages/ResponsesPage'
import UsersPage from './pages/UsersPage'
import SurveyPage from './pages/SurveyPage'


function Placeholder({ name }) {
  return (
    <CMSLayout title={name}>
      <div style={{ fontSize: '14px', color: '#888899' }}>
        {name} page — coming soon
      </div>
    </CMSLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route path={ROUTES.DASHBOARD} element={<AuthGuard><Dashboard /></AuthGuard>} />

        <Route path={ROUTES.VIDEOS} element={<AuthGuard><VideosPage /></AuthGuard>} />

        <Route path={ROUTES.SLIDES} element={<AuthGuard><SlidesPage /></AuthGuard>} />

        <Route path={ROUTES.SURVEY} element={<AuthGuard><SurveyPage /></AuthGuard>} />

        <Route path={ROUTES.CONTENT} element={<AuthGuard><ContentPage /></AuthGuard>} />
        
        <Route path={ROUTES.RESPONSES} element={<AuthGuard><ResponsesPage /></AuthGuard>} />

        <Route path={ROUTES.USERS} element={<AuthGuard><UsersPage /></AuthGuard>} />

        <Route path={ROUTES.LINKS} element={<AuthGuard><LinkGeneratorPage /></AuthGuard>} />

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  )
}