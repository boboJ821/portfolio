// 统一 API 基地址：生产走 Vercel 函数（相对路径），开发走 Vite 代理（见 vite.config.js）
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const checkAuth = () => {
  const token = localStorage.getItem('admin_token');
  return !!token;
};

export const login = async (password) => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) return false;
    const { token } = await response.json();
    if (!token) return false;
    localStorage.setItem('admin_token', token);
    return true;
  } catch (error) {
    console.error('登录失败:', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('admin_token');
};

// 后台请求时带上 token，供 api/visits.js 校验
export const authHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
