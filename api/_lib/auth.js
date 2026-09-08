import crypto from 'crypto'

const TOKEN_MAX_AGE_MS = 12 * 60 * 60 * 1000

const createSignature = (payload, secret) =>
  crypto.createHmac('sha256', secret).update(payload).digest('hex')

export const signAdminToken = (secret) => {
  const payload = Date.now().toString()
  return `${payload}.${createSignature(payload, secret)}`
}

export const verifyAdminToken = (token, secret) => {
  if (!secret || typeof token !== 'string') return false

  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [payload, signature] = parts
  const issuedAt = Number(payload)
  const age = Date.now() - issuedAt
  if (!Number.isFinite(issuedAt) || age < 0 || age > TOKEN_MAX_AGE_MS) return false

  const expected = createSignature(payload, secret)
  const actualBuffer = Buffer.from(signature, 'hex')
  const expectedBuffer = Buffer.from(expected, 'hex')

  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  )
}

export const getBearerToken = (authorization = '') =>
  authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
