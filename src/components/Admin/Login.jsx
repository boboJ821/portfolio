import { useState } from 'react'
import { motion } from 'framer-motion'
import Scene from '@/components/Background/Scene'
import { login } from '@/utils/auth'

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const authenticated = await login(password)
    setLoading(false)

    if (authenticated) onLogin()
    else setError('密码错误')
  }

  return (
    <div className="relative min-h-screen">
      <Scene />
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-lg bg-black/50 p-8 backdrop-blur-md"
        >
          <h1 className="mb-6 text-2xl font-bold text-white">管理员登录</h1>
          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm text-white/80" htmlFor="admin-password">
              管理员密码
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              placeholder="请输入管理员密码"
              className="mb-4 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
            />
            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? '登录中…' : '登录'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
