import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const origin = 'https://autoforgeparts.com'
const env = { ...process.env }

for (const file of ['.env', '.env.local']) {
  const filePath = path.join(root, file)
  if (!existsSync(filePath)) continue
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || env[match[1]]) continue
    const value = match[2].trim()
    env[match[1]] = value.replace(/^(['"])(.*)\1$/, '$2')
  }
}

const staticRoutes = ['/', '/about', '/privacy', '/shop']
const fallbackCategories = ['brakes', 'engine', 'suspension', 'lighting', 'tyres-wheels', 'accessories']
const xmlEscape = value => String(value).replace(/[<>&'\"]/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character])
const routeSet = new Set(staticRoutes)
fallbackCategories.forEach(slug => routeSet.add('/shop/' + slug))

async function addDatabaseRoutes() {
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return
  try {
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const [{ data: collections, error: collectionError }, { data: products, error: productError }] = await Promise.all([
      client.from('collections').select('slug'),
      client.from('products').select('id, collection:collections(slug)'),
    ])
    if (collectionError) throw collectionError
    if (productError) throw productError
    collections?.forEach(collection => { if (collection.slug) routeSet.add('/shop/' + encodeURIComponent(collection.slug)) })
    products?.forEach(product => {
      if (product.id) routeSet.add('/product/' + encodeURIComponent(product.id))
    })
  } catch (error) {
    console.warn('Sitemap: dynamic Supabase routes were not added. Static routes were kept.', error.message)
  }
}

await addDatabaseRoutes()
const urls = [...routeSet].map(route => `  <url><loc>${xmlEscape(origin + route)}</loc></url>`).join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemap, 'utf8')
console.log(`Sitemap: wrote ${routeSet.size} public URLs.`)