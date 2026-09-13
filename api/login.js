import crypto from 'crypto'
import { getBearerToken, signAdminToken, verifyAdminToken } from './_lib/auth.js'

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', 'https://tumeup.online')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
}

const passwordsMatch = (password, expected) => {
  if (typeof password !== 'string' || !expected || password.length !== expected.length) {
    return false
  }

  return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(expected))
}

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  try {
    const adminSecret = process.env.ADMIN_SECRET
    if (!process.env.ADMIN_PASSWORD || !adminSecret) {
      res.status(500).json({ error: 'Server not configured' })
      return
    }

    if (req.method === 'POST') {
      if (!passwordsMatch(req.body?.password, process.env.ADMIN_PASSWORD)) {
        res.status(401).json({ error: '密码错误' })
        return
      }

      res.status(200).json({ token: signAdminToken(adminSecret) })
      return
    }

    if (req.method === 'GET') {
      const token = getBearerToken(req.headers.authorization)
      res.status(200).json({ authenticated: verifyAdminToken(token, adminSecret) })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Login API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
