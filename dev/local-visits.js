import crypto from 'crypto'
import { getBearerToken, verifyAdminToken } from '../api/_lib/auth.js'

const visits = []

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method === 'GET') {
    const token = getBearerToken(req.headers.authorization)
    if (!verifyAdminToken(token, process.env.ADMIN_SECRET)) {
      res.status(401).json({ error: '未授权' })
      return
    }

    res.status(200).json([...visits].reverse())
    return
  }

  if (req.method === 'POST') {
    const { referrer = '', userAgent = '', path = '/' } = req.body || {}
    const visit = {
      id: crypto.randomUUID(),
      ip: req.socket.remoteAddress || '127.0.0.1',
      location: '本地开发',
      timestamp: new Date().toISOString(),
      duration: 0,
      referrer,
      user_agent: userAgent,
      path,
      domain: 'localhost',
    }

    visits.push(visit)
    res.status(201).json(visit)
    return
  }

  if (req.method === 'PUT') {
    const visit = visits.find(({ id }) => id === req.query.id)
    if (!visit) {
      res.status(404).json({ error: '访问记录不存在' })
      return
    }

    const now = new Date()
    visit.duration = Math.max(0, Math.round((now - new Date(visit.timestamp)) / 1000))
    visit.last_activity = now.toISOString()
    res.status(200).json(visit)
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
