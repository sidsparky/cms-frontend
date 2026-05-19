export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const ROLES = {
  SPARKSLAB: 'sparkslab',
  CLIENT:    'client',
}

export const ROUTES = {
  LOGIN:     '/cms/login',
  DASHBOARD: '/cms',
  VIDEOS:    '/cms/videos',
  SLIDES:    '/cms/slides',
  SURVEY:    '/cms/survey',
  CONTENT:   '/cms/content',
  RESPONSES: '/cms/responses',
  USERS:     '/cms/users',
  LINKS:     '/cms/links',
}