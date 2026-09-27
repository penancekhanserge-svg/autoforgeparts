import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useProductImages } from '../store/productImages'
import ProductVisual from './ProductVisual'
import './Admin.css'
async function api(path, method = 'GET', data) {
 const response = await fetch('/api/admin/' + path, { method, headers: { 'Content-Type': 'application/json' }, ...(data ? { body: JSON.stringify(data) } : {}) })
 let result
 try { result = await response.json() } catch { throw new Error('Admin server is unavailable. Start it with npm run server.') }
 if (!response.ok) throw new Error(result.error || 'Request failed.')
 return result
}
export default function Admin({ dashboard = false }) {
 const navigate = useNavigate()
 const [session, setSession] = useState(null)
 const [error, setError] = useState('')
 const [busy, setBusy] = useState(false)
 const [query, setQuery] = useState('')
 const [selected, setSelected] = useState(products[0].id)
 const [preview, setPreview] = useState('')
 const [notice, setNotice] = useState('')
 const images = useProductImages(state => state.images)
 const load = useProductImages(state => state.load)
 useEffect(() => { let active = true; api('session').then(value => { if (active) setSession(value) }).catch(err => { if (active) { setError(err.message); setSession({ authenticated: false }) } }); return () => { active = false } }, [])
 const product = products.find(item => item.id === selected)
 const matches = products.filter(item => (item.name + ' ' + item.make + ' ' + item.model).toLowerCase().includes(query.toLowerCase()))
 async function login(event) {
  event.preventDefault(); setBusy(true); setError('')
  const form = new FormData(event.currentTarget)
  try { const value = await api('login', 'POST', { email: form.get('email'), password: form.get('password') }); setSession({ authenticated: true, email: value.email }); navigate('/admin') } catch (err) { setError(err.message) } finally { setBusy(false) }
 }
 async function choose(event) {
  const file = event.target.files[0]; setError(''); setNotice(''); setPreview('')
  if (!file) return
  if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 2000000) { setError('Choose a JPEG, PNG, or WebP image up to 2 MB.'); return }
  try { const bitmap = await createImageBitmap(file); bitmap.close(); const reader = new FileReader(); reader.onload = () => setPreview(String(reader.result)); reader.onerror = () => setError('Unable to read this file.'); reader.readAsDataURL(file) } catch { setError('This image could not be opened.') }
 }
 async function save(remove = false) {
  setBusy(true); setError(''); setNotice('')
  try { await api('image', remove ? 'DELETE' : 'PUT', { id: selected, image: preview }); await load(); setPreview(''); setNotice(remove ? 'Photo removed. Illustration restored.' : 'Photo saved and visible in the store.') } catch (err) { setError(err.message) } finally { setBusy(false) }
 }
 if (!session) return <main className="admin-shell"><p role="status">Loading admin...</p></main>
 if (dashboard && !session.authenticated && !error) return <Navigate to="/admin/login" replace />
 if (!dashboard && session.authenticated) return <Navigate to="/admin" replace />
 return <main className="admin-shell"><header className="admin-top"><Link to="/" className="admin-logo">AUTO<span>FORGE</span><small>STORE MANAGEMENT</small></Link><Link to="/">View storefront</Link></header>
 {!session.authenticated ? <div className="admin-login"><div className="admin-login-story"><span className="eyebrow">BEHIND EVERY GREAT DRIVE</span><h1>Your store.<br />Your next chapter.</h1><p>Manage your product photography from one considered workspace.</p></div><form onSubmit={login}><span className="eyebrow">ADMIN ACCESS</span><h2>Welcome back.</h2><p>Sign in to manage product images.</p><label>Email address<input name="email" type="email" required autoComplete="username" /></label><label>Password<input name="password" type="password" required maxLength={256} autoComplete="current-password" /></label>{error && <p className="admin-error" role="alert">{error}</p>}{session.configured === false && <p className="admin-error">Account setup required. Configure the admin email and password on the server.</p>}<button disabled={busy || session.configured === false} type="submit">{busy ? 'Signing in...' : 'Sign in to dashboard'}</button></form></div> : <><div className="admin-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>Store dashboard</h1><p>{session.email}</p></div><button disabled={busy} onClick={async () => { try { await api('logout','POST'); setSession({ authenticated:false, configured:true }); navigate('/admin/login') } catch(err) { setError(err.message) } }}>Sign out</button></div><div className="admin-stats"><div><strong>{products.length}</strong><span>Catalog products</span></div><div><strong>{Object.keys(images).length}</strong><span>Product photos</span></div><div><strong>{products.length - Object.keys(images).length}</strong><span>Using illustrations</span></div></div><div className="admin-workspace"><aside><h2>Choose a product</h2><input aria-label="Search products" placeholder="Search part or vehicle" value={query} onChange={event => setQuery(event.target.value)} /><p>{matches.length} matches</p><div className="admin-products">{matches.map(item => <button disabled={busy} className={selected === item.id ? 'selected' : ''} key={item.id} onClick={() => { setSelected(item.id); setPreview(''); setNotice(''); setError('') }}><strong>{item.name}</strong><span>{item.make} {item.model} / {item.brand}</span></button>)}{!matches.length && <p>No matching products.</p>}</div></aside><section className="admin-editor"><span className="eyebrow">PRODUCT PHOTOGRAPHY</span><h2>{product.name}</h2><p>{product.make} {product.model} / {product.brand}</p><div className="admin-preview">{preview ? <img src={preview} alt="New product photo preview" /> : <ProductVisual product={product} />}</div><label className="admin-upload">Choose a product photo<input key={selected} type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={choose} /><small>JPEG, PNG, or WebP. Maximum 2 MB. Saved photos appear for this exact product.</small></label>{error && <p className="admin-error" role="alert">{error}</p>}{notice && <p className="admin-success" role="status">{notice}</p>}<div className="admin-editor-actions"><button disabled={!preview || busy} onClick={() => save()}>{busy ? 'Saving...' : 'Save photo'}</button><button disabled={!images[selected] || busy} onClick={() => save(true)}>Remove photo</button></div></section></div></>}
 </main>
}
