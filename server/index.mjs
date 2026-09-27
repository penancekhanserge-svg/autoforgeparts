import http from 'node:http'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { products } from '../src/data/products.js'
try { process.loadEnvFile('.env.admin.local') } catch { /* Environment may be supplied externally. */ }
const port = Number(process.env.ADMIN_PORT || 3001)
const origin = process.env.APP_ORIGIN || 'http://localhost:5173'
const secure = origin.startsWith('https:')
const email = process.env.ADMIN_EMAIL || ''
const password = process.env.ADMIN_PASSWORD || ''
const ready = Boolean(email && password.length >= 12)
const salt = randomBytes(16)
const passwordHash = scryptSync(password, salt, 64)
const sessions = new Map()
const attempts = new Map()
const ids = new Set(products.map(p => p.id))
const directory = resolve('server/data')
await mkdir(directory, { recursive: true })
const imageFile = resolve(directory, 'images.json')
let images = {}
try { images = JSON.parse(await readFile(imageFile, 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
let saving = Promise.resolve()
const sessionFor = req => {
 const token = (req.headers.cookie || '').split('; ').find(v => v.startsWith('af_admin='))?.slice(9)
 const session = sessions.get(token)
 return session && session.expires > Date.now() ? { ...session, token } : null
}
async function body(req) {
 let raw = ''; let size = 0
 for await (const chunk of req) { size += chunk.length; if (size > 3000000) throw new Error('Request too large'); raw += chunk }
 return JSON.parse(raw || '{}')
}
const server = http.createServer(async (req, res) => {
 const url = new URL(req.url, origin)
 const send = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(value)) }
 try {
  if (req.method !== 'GET' && req.headers.origin !== origin) return send(403, { error: 'Request origin not allowed.' })
  if (url.pathname === '/api/product-images' && req.method === 'GET') return send(200, images)
  if (url.pathname === '/api/admin/session' && req.method === 'GET') return send(200, { authenticated: Boolean(sessionFor(req)), configured: ready, email: sessionFor(req)?.email })
  if (url.pathname === '/api/admin/login' && req.method === 'POST') {
   if (!ready) return send(503, { error: 'Admin account is not configured. Set ADMIN_EMAIL and a password of at least 12 characters on the server.' })
   const key = req.socket.remoteAddress
   const entry = attempts.get(key)
   if (entry && entry.until > Date.now() && entry.count >= 5) return send(429, { error: 'Too many attempts. Try again in 15 minutes.' })
   const input = await body(req)
   const candidate = scryptSync(String(input.password || '').slice(0, 256), salt, 64)
   if (!timingSafeEqual(candidate, passwordHash) || String(input.email || '').toLowerCase() !== email.toLowerCase()) {
    attempts.set(key, { count: entry?.until > Date.now() ? entry.count + 1 : 1, until: Date.now() + 900000 }); return send(401, { error: 'Email or password is incorrect.' })
   }
   attempts.delete(key)
   const token = randomBytes(32).toString('hex')
   sessions.set(token, { email, expires: Date.now() + 28800000 })
   res.setHeader('Set-Cookie', 'af_admin=' + token + '; HttpOnly; SameSite=Strict; Path=/api; Max-Age=28800' + (secure ? '; Secure' : ''))
   return send(200, { email })
  }
  if (url.pathname === '/api/admin/logout' && req.method === 'POST') {
   sessions.delete(sessionFor(req)?.token)
   res.setHeader('Set-Cookie', 'af_admin=; HttpOnly; SameSite=Strict; Path=/api; Max-Age=0' + (secure ? '; Secure' : ''))
   return send(200, { ok: true })
  }
  if (url.pathname === '/api/admin/image' && ['PUT','DELETE'].includes(req.method)) {
   if (!sessionFor(req)) return send(401, { error: 'Please sign in again.' })
   const { id, image } = await body(req)
   if (!ids.has(id)) return send(400, { error: 'Unknown product.' })
   if (req.method === 'PUT') {
    const match = typeof image === 'string' && image.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/)
    if (!match) return send(400, { error: 'Choose a PNG, JPEG, or WebP image.' })
    const buffer = Buffer.from(match[2], 'base64')
    const valid = match[1] === 'png' ? buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : match[1] === 'jpeg' ? buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 : buffer.toString('ascii',0,4) === 'RIFF' && buffer.toString('ascii',8,12) === 'WEBP'
    if (!valid || buffer.length > 2000000) return send(400, { error: 'Use a valid image smaller than 2 MB.' })
   }
   const operation = saving.then(async () => {
    const next = { ...images }
    if (req.method === 'DELETE') delete next[id]; else next[id] = image
    await writeFile(imageFile, JSON.stringify(next), 'utf8'); images = next
   })
   saving = operation.catch(() => {})
   await operation
   return send(200, { ok: true })
  }
  send(404, { error: 'Not found.' })
 } catch { send(400, { error: 'Unable to complete request. Check the file and try again.' }) }
})
setInterval(() => { const now = Date.now(); for (const [key,value] of sessions) if (value.expires < now) sessions.delete(key); for (const [key,value] of attempts) if (value.until < now) attempts.delete(key) }, 60000).unref()
server.listen(port, '127.0.0.1', () => console.log('Admin API listening on port ' + port + (ready ? '' : ' (account setup required)')))
