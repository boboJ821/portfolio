import { API_BASE_URL } from '@/config/api'

const TOKEN_STORAGE_KEY = 'admin_token'

export const checkAuth = () => Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))

export const login = async (password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!response.ok) return false

    const { token } = await response.json()
    if (!token) return false

    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    return true
  } catch (error) {
    console.error('登录失败:', error)
    return false
  }
}

export const logout = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export const authHeaders = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}
