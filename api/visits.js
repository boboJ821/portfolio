import { createClient } from '@supabase/supabase-js'
import { getBearerToken, verifyAdminToken } from './_lib/auth.js'

const setResponseHeaders = (res) => {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', 'https://bbx821.top')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
}

const getSupabase = () => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase is not configured')
  return createClient(url, key)
}

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  return req.headers['x-real-ip'] || null
}

export default async function handler(req, res) {
  setResponseHeaders(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  try {
    const supabase = getSupabase()

    if (req.method === 'GET') {
      const token = getBearerToken(req.headers.authorization)
      if (!verifyAdminToken(token, process.env.ADMIN_SECRET)) {
        res.status(401).json({ error: '未授权' })
        return
      }

      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) throw error
      res.status(200).json(data)
      return
    }

    if (req.method === 'POST') {
      const { referrer = '', userAgent = '', path = '/' } = req.body || {}
      const { data, error } = await supabase
        .from('visits')
        .insert({
          ip: getClientIp(req),
          location: '未知',
          timestamp: new Date().toISOString(),
          duration: 0,
          referrer,
          user_agent: userAgent,
          path,
          domain: 'bbx821.top',
        })
        .select()
        .single()

      if (error) throw error
      res.status(201).json(data)
      return
    }

    if (req.method === 'PUT') {
      const id = req.query?.id
      if (!id) {
        res.status(400).json({ error: 'Missing visit id' })
        return
      }

      const { data: visit, error: readError } = await supabase
        .from('visits')
        .select('timestamp')
        .eq('id', id)
        .single()

      if (readError) throw readError

      const now = new Date()
      const duration = Math.max(
        0,
        Math.round((now.getTime() - new Date(visit.timestamp).getTime()) / 1000),
      )
      const { data, error } = await supabase
        .from('visits')
        .update({ duration, last_activity: now.toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      res.status(200).json(data)
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Visits API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
