import axios from 'axios'
import { getToken } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const http = axios.create({ baseURL: BASE_URL })

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Array<{ type: string; msg: string; path: string; location: string }>
}
