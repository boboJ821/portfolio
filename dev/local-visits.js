import crypto from 'crypto'

const visits = []

function verifyToken(token, secret) {
  if (!secret || typeof token !== 'string' || !token.includes('.')) return false

  const [payload, signature] = token.split('.')
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  )
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    const authorization = req.headers.authorization || ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''

    if (!verifyToken(token, process.env.ADMIN_SECRET)) {
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
