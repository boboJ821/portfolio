import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 签发一个无状态签名 token：<payload>.<hmac>
function signToken(secret) {
  const payload = Date.now().toString();
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifyToken(token, secret) {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  // 防时序攻击的恒定时间比较
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://bbx821.top');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    if (req.method === 'POST') {
      const { password } = req.body || {};
      const adminPassword = process.env.ADMIN_PASSWORD;
      const adminSecret = process.env.ADMIN_SECRET;

      if (!adminPassword || !adminSecret) {
        res.status(500).json({ error: 'Server not configured' });
        return;
      }

      const ok =
        typeof password === 'string' &&
        password.length === adminPassword.length &&
        crypto.timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword));

      if (!ok) {
        res.status(401).json({ error: '密码错误' });
        return;
      }

      const token = signToken(adminSecret);
      res.status(200).json({ token });
      return;
    }

    if (req.method === 'GET') {
      const auth = req.headers['authorization'] || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      res.status(200).json({ authenticated: verifyToken(token, process.env.ADMIN_SECRET) });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Login API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
