import { useVehicleOptions } from '../../hooks/useVehicleOptions'
import Reviews from './Reviews'
import Orders from './Orders'
import { useOrders } from '../../store/orders'
import Collections from './Collections'
import { useCollections } from '../../store/collections'
import NotificationMessage from '../../components/NotificationMessage'
import { supabase } from '../../lib/supabase'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiStar, FiBell, FiEye, FiShoppingBag, FiUser, FiHelpCircle, FiGrid, FiPackage, FiImage, FiPlus, FiSearch, FiEdit2, FiTrash2, FiExternalLink, FiMenu, FiX, FiLogOut, FiArrowUpRight } from 'react-icons/fi'
import { useCatalog } from '../../store/catalog'
import { money } from '../../data/products'

import ProductVisual from '../../components/ProductVisual'
import ProductEditor from './ProductEditor'
import { AdminProfile, AdminSupport } from './AdminAccount'
import './admin.css'

const sections=[['overview','Overview',FiGrid],['products','All products',FiPackage],['orders','Orders',FiShoppingBag],['profile','Profile',FiUser],['collections','Collections',FiGrid],['reviews','Post reviews',FiStar],['support','Developer support',FiHelpCircle]]
export default function AdminPage() {
 const {data:vehicleMakes=[],isPending:vehiclesLoading,error:vehiclesError,refetch:retryVehicles}=useVehicleOptions()
 const {orders,load:loadOrders,error:ordersError,markSeen}=useOrders()
 const unseenOrders=orders.filter(order=>!order.seenAt).length
 useEffect(()=>{
  loadOrders()
  const channel=supabase.channel('admin-orders').on('postgres_changes',{event:'*',schema:'public',table:'orders'},()=>loadOrders()).subscribe()
  const timer=setInterval(()=>{if(!document.hidden)loadOrders()},15000)
  return ()=>{clearInterval(timer);supabase.removeChannel(channel)}
 },[loadOrders])
 const {collections,loading:collectionsLoading,error:collectionsError,loadCollections}=useCollections()
 const {products,ready,error:storageError,saving,deleteProduct}=useCatalog()
 const [section,setSection]=useState('overview')
 const [mobile,setMobile]=useState(false)
 const [query,setQuery]=useState('')
 const [category,setCategory]=useState('')
 const [makeFilter,setMakeFilter]=useState('')
 const [modelFilter,setModelFilter]=useState('')
 const [page,setPage]=useState(1)
 const [editor,setEditor]=useState(null)
 const [pendingDelete,setPendingDelete]=useState(null)
 const [notice,setNotice]=useState('')
 const [error,setError]=useState('')
 const [leaving,setLeaving]=useState(false)
 const [exitError,setExitError]=useState('')
 async function viewStore(){
  if(leaving)return
  setLeaving(true);setExitError('')
  try {
   const {error}=await supabase.auth.signOut({scope:'local'})
   if(error)throw error
   window.location.replace('/')
  } catch {setExitError('Could not sign out. Please try again.');setLeaving(false)}
 }
 const confirm=useRef(null)
 const opener=useRef(null)
 useEffect(()=>{if(pendingDelete)confirm.current.showModal()},[pendingDelete])
 const filtered=products.filter(p=>(p.name+' '+p.brand+' '+p.sku+' '+p.make+' '+p.model).toLowerCase().includes(query.toLowerCase())&&(!category||p.category===category)&&(!makeFilter||p.make===makeFilter)&&(!modelFilter||p.model===modelFilter))
 const pages=Math.max(1,Math.ceil(filtered.length/12)), current=Math.min(page,pages)
 const visible=filtered.slice((current-1)*12,current*12)
 const photographed=products.filter(p=>p.photos?.length).length
 const openEditor=product=>{opener.current=document.activeElement;setEditor({product});setNotice('')}
 const closeEditor=message=>{setEditor(null);if(message)setNotice(message);opener.current?.focus()}
 async function remove(){setError('');try{await deleteProduct(pendingDelete.id);confirm.current.close();setPendingDelete(null);setNotice('Product deleted.')}catch(err){setError(err.message)}}
 return <div className="adm-app">{mobile&&<button className="adm-overlay" aria-label="Close menu" onClick={()=>setMobile(false)} />}
 <aside id="admin-navigation" className={'adm-sidebar '+(mobile?'is-open':'')}><Link className="adm-brand" to="/">AUTO<span>FORGE</span><small>MERCHANT WORKSPACE</small></Link><span className="adm-nav-caption">MANAGE YOUR STORE</span><nav aria-label="Admin navigation">{sections.map(([id,label,Icon])=><button key={id} aria-current={section===id?'page':undefined} onClick={()=>{setSection(id);setMobile(false);setPage(1)}}><Icon />{label}{['products','orders','collections'].includes(id)&&<small>{id==='products'?products.length:id==='orders'?orders.length:collections.length}</small>}</button>)}</nav><div className="adm-sidebar-bottom"><button className="adm-signout" onClick={viewStore} disabled={leaving}><FiExternalLink />{leaving?'Signing out...':'View store & sign out'}</button><button className="adm-signout" onClick={async ()=>{const {error}=await supabase.auth.signOut({scope:'local'});if(error)setExitError('Sign-out failed. Please try again.')}}><FiLogOut /> Sign out</button><footer className="adm-sidebar-credit"><span>POWERED BY <strong>KHANIFY</strong> TECHNOLOGIES</span><small>&copy; {new Date().getFullYear()} All rights reserved.</small></footer></div></aside>
 <div className="adm-main"><header className="adm-header"><button className="adm-mobile-toggle adm-icon" aria-label={mobile?'Close admin navigation':'Open admin navigation'} aria-controls="admin-navigation" aria-expanded={mobile} onClick={()=>setMobile(!mobile)}>{mobile?<FiX />:<FiMenu />}</button><div className="adm-header-title"><span>AUTOFORGE <em>ADMIN</em></span><strong>{sections.find(item=>item[0]===section)[1]}</strong></div><button type="button" className="adm-store-link" onClick={viewStore} disabled={leaving} title="Sign out and view the store" aria-label="Sign out and view the store"><span>{leaving?'Signing out?':'View store'}</span><FiExternalLink /></button><button className="adm-order-bell" aria-label={unseenOrders+' new orders. Open orders'} onClick={async()=>{setSection('orders');try{await markSeen()}catch(err){setError(err.message)}}}><FiBell />{unseenOrders>0&&<span>{unseenOrders}</span>}</button><span className="adm-avatar" aria-label="Admin workspace">AF</span></header>
 <main className="adm-content"><div className="adm-page-heading"><div><span className="adm-eyebrow">AUTOFORGE / STORE CONTROL</span><h1>{section==='overview'?'Your store at a glance.':section==='products'?'The product collection.':section==='orders'?'Every order, in view.':section==='profile'?'Your account, your control.':section==='reviews'?'Customer stories.':section==='support'?'Here to keep you moving.':'Your collections.'}</h1><p>{section==='overview'?'A clear view of your catalog, with everything you need to keep it moving.':section==='products'?'Create, refine, and organize every part in your store.':section==='orders'?'Track customer orders, references, items, and totals.':section==='profile'?'Update your email and keep your sign-in details secure.':section==='reviews'?'Share customer feedback on your homepage.':section==='support'?'Report an issue or speak directly with your developer.':'Organize your products into collections customers can explore.'}</p></div>{['overview','products'].includes(section)&&<button className="adm-primary" disabled={!ready||Boolean(storageError)} onClick={()=>openEditor(null)}><FiPlus /> Add product</button>}</div>
 {exitError&&<NotificationMessage message={exitError} />}{notice&&<NotificationMessage message={notice} type="success" />}{storageError&&<NotificationMessage message={storageError + " Reload to retry. Editing is disabled to protect saved changes."} />}
 {collectionsError&&<p role="alert">Unable to load collection filters. <button onClick={loadCollections}>Retry</button></p>}
 {vehiclesError&&<p role="alert">Unable to load vehicle filters. <button onClick={retryVehicles}>Retry</button></p>}
 {ordersError&&<p role="alert">Orders: {ordersError} <button onClick={loadOrders}>Retry</button></p>}
 {section==='profile'&&<AdminProfile />}
 {section==='support'&&<AdminSupport />}
 {!ready?<p role="status">Loading saved catalog...</p>:<>
 {section==='overview'&&<><div className="adm-stats">{[[FiPackage,products.length,'Total products'],[FiGrid,collections.length,'Total collections'],[FiShoppingBag,orders.length,'Total orders'],[FiEye,'Not connected','Total views']].map(([Icon,value,label])=><article key={label}><span><Icon /></span><strong className={typeof value==='string'?'adm-metric-pending':undefined}>{value}</strong><p>{label}</p></article>)}</div><div className="adm-overview-panels"><article><span className="adm-eyebrow">MAKE THE NEXT IMPRESSION COUNT</span><h2>Good photography.<br />A stronger collection.</h2><p>{products.length-photographed} products still use illustrations. Add clear photos, detailed descriptions, and accurate compatibility.</p><button onClick={()=>setSection('products')}>Manage photography <FiArrowUpRight /></button></article><article><h2>Collection breakdown</h2>{collections.map(item=>item.name).map(name=><div className="adm-category-count" key={name}><span>{name}</span><strong>{products.filter(p=>p.category===name).length}</strong></div>)}</article></div></>}
 {section==='products'&&<section className="adm-panel"><div className="adm-panel-title"><h2>Products</h2><span>{filtered.length} results</span></div><div className="adm-toolbar"><label className="adm-search"><FiSearch /><input aria-label="Search products" placeholder="Search name, SKU, brand or vehicle..." value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} /></label><select disabled={collectionsLoading||!!collectionsError} aria-label="Filter collection" value={category} onChange={e=>{setCategory(e.target.value);setPage(1)}}><option value="">All collections</option>{collections.map(item=>item.name).map(name=><option key={name}>{name}</option>)}</select><select disabled={vehiclesLoading||!!vehiclesError} aria-label="Filter make" value={makeFilter} onChange={e=>{setMakeFilter(e.target.value);setModelFilter('');setPage(1)}}><option value="">All makes</option>{vehicleMakes.map(item=>item.name).map(value=><option key={value}>{value}</option>)}</select><select disabled={vehiclesLoading||!!vehiclesError} aria-label="Filter model" value={modelFilter} onChange={e=>{setModelFilter(e.target.value);setPage(1)}}><option value="">All models</option>{[...new Set(vehicleMakes.filter(item=>!makeFilter||item.name===makeFilter).flatMap(item=>item.vehicle_models.map(model=>model.name)))].sort().map(value=><option key={value}>{value}</option>)}</select></div><div className="adm-table-scroll"><table><thead><tr><th>Product</th><th>Vehicle</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.map(product=><tr key={product.id}><td><div className="adm-table-product"><ProductVisual product={product} /><span><strong>{product.name}</strong><small>{product.sku} / {product.brand}</small></span></div></td><td>{product.make} {product.model}<small>{Math.min(...product.years)} - {Math.max(...product.years)}</small></td><td>{money(product.price)}</td><td><span className={'adm-badge '+(product.availability==='unspecified'?'unspecified':product.stock===0?'sold-out':'active')}>{product.availability==='unspecified'?'Not specified':product.stock===0?'Sold out':'In stock'}</span></td><td><div className="adm-row-actions"><button disabled={!!storageError} className="adm-icon" aria-label={'Edit '+product.name+' '+product.model} onClick={()=>openEditor(product)}><FiEdit2 /></button><button disabled={!!storageError} className="adm-icon adm-danger" aria-label={'Delete '+product.name+' '+product.model} onClick={()=>setPendingDelete(product)}><FiTrash2 /></button></div></td></tr>)}</tbody></table></div>{!filtered.length&&<div className="adm-empty"><h3>No matching products</h3><p>Try another search or clear your filters.</p><button onClick={()=>{setQuery('');setCategory('');setMakeFilter('');setModelFilter('')}}>Clear filters</button></div>}<div className="adm-pagination"><span>Page {current} of {pages}</span><button disabled={current===1} onClick={()=>setPage(current-1)}>Previous</button><button disabled={current===pages} onClick={()=>setPage(current+1)}>Next</button></div></section>}
 {section==='media'&&<section className="adm-panel"><div className="adm-panel-title"><h2>Product galleries</h2><span>{photographed} galleries</span></div><div className="adm-media-grid">{products.filter(p=>p.photos?.length).map(product=><button key={product.id} onClick={()=>openEditor(product)} disabled={!!storageError}><ProductVisual product={product} /><strong>{product.name}</strong><span>{product.make} {product.model}</span><small>{product.photos.length} photos / Edit gallery</small></button>)}</div>{!photographed&&<div className="adm-empty"><FiImage /><h3>Your image library starts here.</h3><p>Open a product and add up to four photos. Set a cover and add descriptive alternative text.</p><button className="adm-primary" onClick={()=>setSection('products')}>Choose a product</button></div>}</section>}
 {section==='orders'&&<Orders />}
 {section==='reviews'&&<Reviews />}
 {section==='collections'&&<Collections />}
 </>}
 </main></div>
 {editor&&<ProductEditor product={editor.product} onClose={closeEditor} />}
 <dialog ref={confirm} className="adm-confirm" aria-labelledby="delete-title" onCancel={event=>{if(saving)event.preventDefault();else setPendingDelete(null)}}><h2 id="delete-title">Delete this product?</h2><p>{pendingDelete?.name} for {pendingDelete?.make} {pendingDelete?.model} will be removed from the store.</p>{error&&<NotificationMessage message={error} />}<div><button disabled={saving} onClick={()=>{confirm.current.close();setPendingDelete(null);setError('')}}>Keep product</button><button disabled={saving} className="adm-delete" onClick={remove}>{saving?<><span className="adm-processing-spinner" /> Deleting...</>:'Delete product'}</button></div></dialog>
 </div>
}
