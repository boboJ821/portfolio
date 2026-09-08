import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import Scene from '@/components/Background/Scene'
import { API_BASE_URL } from '@/config/api'
import { authHeaders, checkAuth, logout } from '@/utils/auth'
import { formatDate, formatDuration } from '@/utils/formatters'
import Login from './Login'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const matchesDateFilter = (timestamp, filter) => {
  if (filter === 'all') return true

  const visitDate = new Date(timestamp)
  const now = new Date()
  if (filter === 'today') return visitDate.toDateString() === now.toDateString()

  const days = filter === 'week' ? 7 : 30
  return visitDate >= new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
}

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth)
  const [visitData, setVisitData] = useState([])
  const [loading, setLoading] = useState(isAuthenticated)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let cancelled = false
    const loadVisits = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/visits`, { headers: authHeaders() })
        if (cancelled) return

        if (response.status === 401) {
          logout()
          setIsAuthenticated(false)
          return
        }
        if (!response.ok) throw new Error(`Visit API returned ${response.status}`)

        const data = await response.json()
        if (!cancelled) setVisitData(Array.isArray(data) ? data : [])
      } catch (fetchError) {
        if (!cancelled) {
          console.error('获取访问数据失败:', fetchError)
          setError('访问数据加载失败，请稍后重试。')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadVisits()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return visitData.filter((visit) => {
      const matchesSearch = [visit.ip, visit.location]
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(query))
      return matchesSearch && matchesDateFilter(visit.timestamp, dateFilter)
    })
  }, [dateFilter, searchTerm, visitData])

  const recentVisits = [...filteredData].slice(0, 7).reverse()
  const chartData = {
    labels: recentVisits.map((visit) => formatDate(visit.timestamp).split(' ')[0]),
    datasets: [
      {
        label: '访问次数',
        data: recentVisits.map((_, index) => index + 1),
        borderColor: 'rgb(147, 51, 234)',
        tension: 0.3,
      },
    ],
  }
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } },
      title: { display: true, text: '最近访问趋势', color: 'white' },
    },
    scales: {
      y: { ticks: { color: 'white' } },
      x: { ticks: { color: 'white' } },
    },
  }

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={() => {
          setLoading(true)
          setError('')
          setIsAuthenticated(true)
        }}
      />
    )
  }

  return (
    <div className="relative min-h-screen">
      <Scene />
      <div className="absolute inset-0 z-10">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-black/50 p-6 backdrop-blur-md"
          >
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">访问统计</h1>
              <button
                type="button"
                onClick={() => {
                  logout()
                  setIsAuthenticated(false)
                }}
                className="rounded-lg bg-red-500/50 px-4 py-2 text-white transition-colors hover:bg-red-500/70"
              >
                退出登录
              </button>
            </div>

            <div className="mb-8 rounded-lg bg-white/5 p-4">
              <Line data={chartData} options={chartOptions} />
            </div>

            <div className="mb-6 flex flex-wrap gap-4">
              <label className="sr-only" htmlFor="visit-search">
                搜索 IP 或地址
              </label>
              <input
                id="visit-search"
                type="search"
                placeholder="搜索 IP 或地址…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
              />
              <label className="sr-only" htmlFor="visit-date-filter">
                按日期筛选
              </label>
              <select
                id="visit-date-filter"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:outline-none"
              >
                <option value="all">所有时间</option>
                <option value="today">今天</option>
                <option value="week">最近一周</option>
                <option value="month">最近一个月</option>
              </select>
            </div>

            {loading && <p className="text-white">加载中…</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-purple-400/30">
                      <th className="px-4 py-3 text-left">IP 地址</th>
                      <th className="px-4 py-3 text-left">地理位置</th>
                      <th className="px-4 py-3 text-left">访问时间</th>
                      <th className="px-4 py-3 text-left">访问时长</th>
                      <th className="px-4 py-3 text-left">访问页面</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((visit) => (
                      <tr
                        key={visit.id}
                        className="border-b border-purple-400/10 transition-colors hover:bg-purple-400/10"
                      >
                        <td className="px-4 py-3">{visit.ip || '—'}</td>
                        <td className="px-4 py-3">{visit.location || '—'}</td>
                        <td className="px-4 py-3">{formatDate(visit.timestamp)}</td>
                        <td className="px-4 py-3">{formatDuration(visit.duration)}</td>
                        <td className="px-4 py-3">{visit.path || '/'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
