import axios from 'axios'
import { BASE_URL } from './constants'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cms_token')
      window.location.href = '/cms/login'
    }
    return Promise.reject(error)
  }
)

export default api