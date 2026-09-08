import { loadEnv } from 'vite'

const handlers = {
  '/api/login': () => import('./api/login.js'),
  '/api/visits': () => import('./dev/local-visits.js'),
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []

    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve(undefined)
        return
      }

      const rawBody = Buffer.concat(chunks).toString('utf8')
      const contentType = req.headers['content-type'] || ''

      if (contentType.includes('application/json')) {
        try {
          resolve(JSON.parse(rawBody))
        } catch {
          reject(new Error('Invalid JSON request body'))
        }
        return
      }

      resolve(rawBody)
    })
    req.on('error', reject)
  })
}

function addVercelResponseHelpers(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode
    return res
  }

  res.json = (body) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
    }
    res.end(JSON.stringify(body))
    return res
  }
}

export function localApiPlugin() {
  return {
    name: 'local-vercel-api',
    configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), '')

      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost')
        const pathname = url.pathname.replace(/\/$/, '') || '/'
        const loadHandler = handlers[pathname]

        if (!loadHandler) {
          next()
          return
        }

        try {
          req.query = Object.fromEntries(url.searchParams)
          req.body = await readRequestBody(req)
          addVercelResponseHelpers(res)

          const { default: handler } = await loadHandler()
          await handler(req, res)
        } catch (error) {
          server.config.logger.error(error.stack || error.message)
          if (!res.headersSent) {
            res.statusCode = error.message === 'Invalid JSON request body' ? 400 : 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
          }
          if (!res.writableEnded) {
            res.end(JSON.stringify({ error: error.message }))
          }
        }
      })
    },
  }
}
