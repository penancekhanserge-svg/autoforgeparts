import OrderingTips from './components/OrderingTips'
import { vehicleYearLabel } from './lib/vehicleYearLabel'
import OrderingGuide from './components/OrderingGuide'
import { useOrders } from './store/orders'
import { useCollections } from './store/collections'
import { useVehicleOptions } from './hooks/useVehicleOptions'
import NotificationMessage from './components/NotificationMessage'
import OrderConfirmation from './components/OrderConfirmation'
import ShopByVehicle from './components/ShopByVehicle'
import ContactOptions from './components/ContactOptions'
import { salePrice } from './lib/pricing'
import { useEffect, useRef, useState } from 'react'
import { FiArrowRight, FiArrowUpRight, FiArrowDownRight, FiHeadphones, FiMinus, FiPlus, FiTool, FiTrash2, FiTruck, FiX } from 'react-icons/fi'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaShoppingCart } from 'react-icons/fa'
import ProductVisual from './components/ProductVisual'
import Admin from './pages/admin/AdminPage'
import AdminAuth from './pages/admin/AdminAuth'
import RequireAdmin from './pages/admin/RequireAdmin'
import ResetPassword from './pages/admin/ResetPassword'
import { useCatalog } from './store/catalog'
import Navbar from './components/Navbar'
import Showcase from './components/Showcase'
import Departments from './components/Departments'
import Catalog from './components/Catalog'
import ContactForm from './components/ContactForm'
import ServiceStrip from './components/ServiceStrip'
import InfoPage from './components/InfoPage'
import ProductDetail from './components/ProductDetail'
import Testimonials from './components/Testimonials'
import ScrollReveal from './components/ScrollReveal'
import { vehicleYears, categorySlug, money } from './data/products'
import { useCart } from './store/cart'



function Storefront() {
  const categories = useCollections(state=>state.collections)
  const { data: vehicleMakes = [], isPending: vehiclesLoading, error: vehiclesError, refetch: retryVehicles, isFetching: vehiclesFetching } = useVehicleOptions()
  const catalogProducts = useCatalog(state => state.products)
  const catalogError = useCatalog(state => state.error)
  const catalogReady = useCatalog(state => state.ready)
  const products = catalogProducts.filter(product => product.status === 'active')
  const location = useLocation()
  const navigate = useNavigate()
  const isInfo = ['/about', '/privacy'].includes(location.pathname)
  const isProduct = location.pathname.startsWith('/product/')
  const isShop = location.pathname.startsWith('/shop')
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.hash])
  const [orderConfirmation,setOrderConfirmation] = useState(null)
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const availableModels = vehicleMakes.find(item => item.name === make)?.vehicle_models || []
  const [year, setYear] = useState('')
  const [fitment, setFitment] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedQuantity, setSelectedQuantity] = useState('1')
  const quantityDialog = useRef(null)
  const cartDialog = useRef(null)
  const supportDialog = useRef(null)
  const { items, add, change, remove } = useCart()
  useEffect(() => {
    if(!catalogReady || catalogError)return
    const availableIds=new Set(catalogProducts.filter(product=>product.status==='active').map(product=>product.id))
    const missing=items.filter(item=>!availableIds.has(item.id))
    if(!missing.length)return
    for(const item of missing)remove(item.id)
    toast.info('Removed unavailable products from your saved cart. Your available items are still here.',{toastId:'cart-unavailable-items'})
  },[catalogReady,catalogError,catalogProducts,items,remove])
  const cartItems = items.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product)
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = cartItems.reduce((sum, item) => sum + item.quantity * salePrice(item.product), 0)
  const [placingOrder,setPlacingOrder]=useState(false)
  const checkoutAttempt=useRef(null)
  async function placeOrder() {
    if(placingOrder)return
    if(!catalogReady||catalogError){toast.error('Wait for the product catalog to load successfully before placing your order.');return}
    if(!cartItems.length){toast.error('Add a product to your cart before placing the order.');return}
    if(cartItems.length!==items.length){toast.info('Your cart is updating. Please try again.');return}
    const fingerprint=JSON.stringify(items.map(item=>({id:item.id,quantity:item.quantity})))
    if(!checkoutAttempt.current){try{checkoutAttempt.current=JSON.parse(sessionStorage.getItem('autoforge-checkout-attempt'))}catch{/* Use a new checkout key. */}}
    if(checkoutAttempt.current?.fingerprint!==fingerprint)checkoutAttempt.current={fingerprint,key:crypto.randomUUID()}
    try{sessionStorage.setItem('autoforge-checkout-attempt',JSON.stringify(checkoutAttempt.current))}catch{/* Keep the in-memory key for retries. */}
    setPlacingOrder(true)
    try {const order=await useOrders.getState().addOrder(items,checkoutAttempt.current.key);cartDialog.current.close();setOrderConfirmation(order);for(const item of items)remove(item.id);checkoutAttempt.current=null;try{sessionStorage.removeItem('autoforge-checkout-attempt')}catch{/* Order is already saved. */}}
    catch(error){toast.error(error.message||'Unable to place your order. Please try again.')}
    finally{setPlacingOrder(false)}
  }
  function scrollToProducts() {
    if (location.pathname !== '/shop' || location.search) navigate('/shop#parts')
    else document.getElementById('parts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  function browseCategory(name) {
    navigate('/shop/' + categorySlug(name) + '#parts')
  }
  function clearFilters() {
    setFitment(null)
  }

  return (
    <>
      <ScrollReveal />
      {orderConfirmation && <OrderConfirmation order={orderConfirmation} onClose={() => { setOrderConfirmation(null); cartDialog.current.showModal() }} />}
      <ContactOptions />
      <Navbar
        categories={categories}
        onCategory={browseCategory}
        onBrowse={() => { clearFilters(); scrollToProducts() }}
        onSupport={() => supportDialog.current.showModal()}
        onCart={() => cartDialog.current.showModal()}
        count={count}
        fitment={fitment}
      />

      <main className={isProduct ? 'product-page' : isShop ? 'shop-page' : 'home-page'}>
        {!catalogReady&&<p role="status">Loading products...</p>}{catalogError&&<div role="alert">Unable to load products. <button onClick={()=>useCatalog.getState().load()}>Retry</button></div>}
        {isInfo ? <InfoPage privacy={location.pathname === '/privacy'} /> : isProduct ? <ProductDetail key={location.pathname} onAdd={(id, quantity) => { const item = products.find(p => p.id === id); if (!item || quantity + (items.find(p => p.id === id)?.quantity || 0) > item.stock) { toast.error('Requested quantity exceeds available stock.'); return } for (let i = 0; i < quantity; i++) add(id); toast.success(quantity + ' item' + (quantity === 1 ? '' : 's') + ' added to your cart') }} /> : <>
        {!isShop && <section className="hero" aria-labelledby="hero-title">
          <img className="hero-image" src="/images/hero-car.jpg" alt="Silver sports car on a winding mountain road" fetchPriority="high" />
          <div className="hero-shade" />
          <div className="container hero-content">
            <span className="eyebrow light"><span /> FOR THE LOVE OF THE DRIVE</span>
            <h1 id="hero-title">The right parts.<br />For every <em>journey.</em></h1>
            <p>From everyday essentials to your next upgrade.<br className="desktop-break" /> Find the parts that keep you moving forward.</p>
            <div className="hero-actions"><button className="button button-orange" onClick={() => { clearFilters(); scrollToProducts() }}>Explore parts <FiArrowUpRight /></button><a className="button button-outline" href="#finder">Find my vehicle <FiArrowRight /></a></div>
            <div className="hero-caption"><span className="caption-line" /> FOR THE DAILY DRIVE. AND THE ROAD LESS TRAVELLED.</div>
          </div>
          <div className="hero-detail"><span className="hero-detail-line" /><span>BUILT AROUND YOUR DRIVE</span><strong>Every mile.<br />More possibility.</strong><a href="#showcase">Discover the collection <FiArrowDownRight /></a></div>
        </section>}

        <div className="container finder-container" style={isShop ? { marginTop: 28 } : undefined}>
          {vehiclesError && <><NotificationMessage message={vehiclesError.message} /><button className="button" type="button" disabled={vehiclesFetching} onClick={() => retryVehicles()}>{vehiclesFetching ? 'Retrying...' : 'Retry loading vehicles'}</button></>}
          <section id="finder" className="finder" aria-labelledby="finder-title">
            <div className="finder-intro"><span className="finder-icon"><FiTool /></span><div><h2 id="finder-title">Start with your vehicle.</h2><p>A better fit. A better drive.</p></div></div>
            <form className="finder-form" onSubmit={(event) => { event.preventDefault(); if (vehiclesError || !availableModels.some(item => item.name === model)) { toast.error('Please select an available make and model.'); return } setFitment({ make, model, year }); navigate('/shop?' + new URLSearchParams({ make, model, year }) + '#parts') }}>
              <label><span>01 &nbsp; MAKE</span><select required aria-label="Vehicle make" disabled={vehiclesLoading || !!vehiclesError || !vehicleMakes.length} value={make} onChange={(event) => { setMake(event.target.value); setModel('') }}><option value="">{vehiclesLoading ? 'Loading makes...' : vehiclesError ? 'Vehicles unavailable' : !vehicleMakes.length ? 'No makes available' : 'Select make'}</option>{vehicleMakes.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>
              <label><span>02 &nbsp; MODEL</span><select required aria-label="Vehicle model" disabled={!make || !availableModels.length || !!vehiclesError} value={model} onChange={(event) => setModel(event.target.value)}><option value="">{make && !availableModels.length ? 'No models available' : 'Select model'}</option>{availableModels.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>
              <label><span>03 &nbsp; YEAR</span><select required aria-label="Vehicle year" value={year} onChange={(event) => setYear(event.target.value)}><option value="">Select year</option>{vehicleYears.map((value) => <option key={value}>{value}</option>)}</select></label>
              <button className="button button-dark" type="submit" disabled={vehiclesLoading || !!vehiclesError || !availableModels.some(item => item.name === model)}>Find my parts <FiArrowRight /></button>
            </form>
          </section>
        </div>


        {!isShop && <Departments categories={categories} onExplore={(name) => { clearFilters(); browseCategory(name) }} onBrowse={() => { clearFilters(); scrollToProducts() }} />}

        {!isShop && <ShopByVehicle />}
        {!isShop && <Showcase onAdd={(product) => { setSelectedProduct(product); setSelectedQuantity('1'); quantityDialog.current.showModal() }} />}

        {isShop && <Catalog categories={categories} fitment={fitment} onAdd={(id) => { setSelectedProduct(products.find(product => product.id === id)); setSelectedQuantity('1'); quantityDialog.current.showModal() }} />}
        {!isShop && <Testimonials />}
        {!isShop && <OrderingGuide />}

        <section className="container story-section" id="about">
          <div className="story-panel"><span className="eyebrow light">MORE THAN A PART. A POSSIBILITY.</span><h2>Keep the good<br />miles coming.</h2><p>A morning commute. A weekend escape. That project in the garage. Whatever drives you, we’re building a better way to find your next part.</p><a className="button button-orange" href="#finder">Find your fit <FiArrowUpRight /></a><span className="story-outline" aria-hidden="true">AF</span></div>
          <div className="help-panel"><span className="help-icon"><FiHeadphones /></span><span className="eyebrow">A HUMAN TOUCH</span><h2>Not sure where<br />to start?</h2><p>You don’t have to know every part number. Start with your vehicle and take it from there.</p><button className="text-link" onClick={() => supportDialog.current.showModal()}>Let’s talk parts <FiArrowUpRight /></button><div className="help-bottom"><FiTool /><span>Good advice starts with the right questions.</span></div></div>
        </section>
        <ContactForm />
        <div className="container closing-line"><FiTruck /><p>For the everyday driver. The weekend explorer. The hands-on enthusiast.</p><span>MADE TO KEEP YOU MOVING <FiArrowUpRight /></span></div>
        </>}
        {!isInfo && <ServiceStrip />}
      </main>

      {!isShop && !isProduct && !isInfo && <section className="container footer-ordering-tips" aria-label="Ordering tips"><OrderingTips /></section>}
      <footer className="forge-footer">
        <div className="container">
          <div className="forge-footer-invitation"><div><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>More life.<br />More miles. <em>More possibility.</em></h2></div><button className="button" onClick={() => { clearFilters(); scrollToProducts() }}>Find your next part <FiArrowUpRight /></button></div>
          <div className="forge-footer-grid">
            <div className="forge-footer-brand"><Link to="/" aria-label="AutoForge home">AUTO<span>FORGE</span><small>PARTS FOR EVERY JOURNEY</small></Link><p>For the everyday driver, the weekend explorer, and the project waiting in your garage.</p><span className="forge-footer-signature"><FiTool /> Built around your drive.</span></div>
            <nav aria-label="Footer shop navigation"><h3>Find your next part</h3><button onClick={() => { clearFilters(); scrollToProducts() }}>Shop all parts <FiArrowUpRight /></button><a href="#finder">Find by vehicle</a><button onClick={() => browseCategory('Brakes')}>Brakes & maintenance</button><button onClick={() => browseCategory('Lighting')}>Lighting & upgrades</button></nav>
            <nav aria-label="Footer help navigation"><h3>A little guidance</h3><Link to="/privacy">Privacy</Link><Link to="/admin/login" state={{ adminLoginEntry: true }}>Admin login</Link><button onClick={() => supportDialog.current.showModal()}>Help & support <FiArrowUpRight /></button><button onClick={() => cartDialog.current.showModal()}>Your cart ({count})</button></nav>
            <div className="forge-footer-help"><FiHeadphones aria-hidden="true" /><h3>Good advice.<br />A better starting point.</h3><p>Start with your make, model, and year. Let's find your fit.</p><a href="#finder">Meet your next mile <FiArrowRight /></a></div>
          </div>
          <div className="forge-footer-bottom"><span>&copy; {new Date().getFullYear()} All rights reserved.</span><a href="#">Back to top &uarr;</a></div>
        </div>
        <p className="footer-powered-credit"><span>POWERED BY</span> <strong>KHANIFY</strong> <span className="footer-credit-tech">TECHNOLOGIES</span></p>
      </footer>

      <dialog ref={quantityDialog} className="quantity-dialog" aria-labelledby="quantity-title" onClick={(event) => { if (event.target === event.currentTarget) quantityDialog.current.close() }}>
        <div className="dialog-content"><div className="dialog-heading"><div><span className="eyebrow">MAKE IT YOUR NEXT UPGRADE</span><h2 id="quantity-title">Choose your quantity</h2></div><button className="icon-button" aria-label="Close quantity selection" onClick={() => quantityDialog.current.close()}><FiX /></button></div>
          {selectedProduct && <><div className="quantity-product"><ProductVisual product={selectedProduct} /><div><span className="eyebrow">{selectedProduct.brand}</span><h3>{selectedProduct.name}</h3><p>{selectedProduct.fit[0]} {vehicleYearLabel(selectedProduct.years)}</p><p>{selectedProduct.description || 'Choose your quantity below. Contact our team to confirm exact fitment.'}</p><strong>{money(salePrice(selectedProduct))} <small>USD / unit</small></strong></div></div>
          <form onSubmit={(event) => { event.preventDefault(); const amount = Number(selectedQuantity); if (!Number.isSafeInteger(amount) || amount < 1 || amount > 99) { toast.error('Enter a whole quantity from 1 to 99.'); return; } const available = products.find(p => p.id === selectedProduct.id); const inCart = items.find(item => item.id === selectedProduct.id)?.quantity || 0; if (!available || amount + inCart > available.stock) { toast.error('Requested quantity exceeds available stock.'); return } for (let i = 0; i < amount; i++) add(selectedProduct.id); quantityDialog.current.close(); toast.success(amount + ' ' + selectedProduct.name + (amount === 1 ? ' added to your cart' : ' items added to your cart')) }}>
            <label className="quantity-label" htmlFor="selected-product-quantity">How many do you need?</label><div className="quantity-picker"><button type="button" aria-label="Decrease quantity" disabled={Number(selectedQuantity) <= 1} onClick={() => setSelectedQuantity(String(Math.max(1, Number(selectedQuantity) - 1)))}><FiMinus /></button><input id="selected-product-quantity" name="quantity" type="number" inputMode="numeric" required min="1" max="99" step="1" value={selectedQuantity} onChange={(event) => setSelectedQuantity(event.target.value)} /><button type="button" aria-label="Increase quantity" disabled={Number(selectedQuantity) >= 99} onClick={() => setSelectedQuantity(String(Math.min(99, Number(selectedQuantity) + 1)))}><FiPlus /></button></div>
            <div className="quantity-total" aria-live="polite"><span>Item total</span><strong>{Number.isInteger(Number(selectedQuantity)) && Number(selectedQuantity) >= 1 && Number(selectedQuantity) <= 99 ? money(salePrice(selectedProduct) * Number(selectedQuantity)) : 'Enter a quantity from 1 to 99'}</strong></div><button className="button button-dark quantity-confirm" type="submit">Add to cart <FiPlus /></button><button className="quantity-cancel" type="button" onClick={() => quantityDialog.current.close()}>Cancel</button>
          </form></>}
        </div>
      </dialog>

      <dialog ref={cartDialog} className="cart-dialog" aria-labelledby="cart-title" onClick={(event) => { if (event.target === event.currentTarget) cartDialog.current.close() }}><div className="dialog-content"><div className="dialog-heading"><div><span className="eyebrow">YOUR NEXT UPGRADE</span><h2 id="cart-title">Your next upgrade <span>({count})</span></h2><p className="cart-heading-copy">Good parts. Great journeys ahead.</p></div><button className="icon-button" aria-label="Close cart" onClick={() => cartDialog.current.close()}><FiX /></button></div>{!cartItems.length ? <div className="empty-cart"><span className="empty-cart-emblem"><FaShoppingCart aria-hidden="true" /></span><h3>A little empty. Full of possibility.</h3><p>Find something for your next journey.</p><button className="button button-dark empty-cart-explore" onClick={() => { cartDialog.current.close(); scrollToProducts() }}>Explore parts <FiArrowRight /></button></div> : <><div className="cart-items">{cartItems.map(({ product, quantity }) => <div className="cart-item" key={product.id}><ProductVisual product={product} /><div><span className="cart-item-brand">{product.brand}</span><h3>{product.name}</h3><span className="cart-item-vehicle">{product.fit[0]}</span><p>{money(salePrice(product))} <small>USD / unit</small></p><div className="quantity-control"><button aria-label={'Decrease quantity of ' + product.name} onClick={() => change(product.id, -1)}><FiMinus /></button><span>{quantity}</span><button aria-label={'Increase quantity of ' + product.name} disabled={quantity >= product.stock} onClick={() => change(product.id, 1)}><FiPlus /></button></div></div><button className="icon-button remove-button" aria-label={'Remove ' + product.name} onClick={() => remove(product.id)}><FiTrash2 /></button></div>)}</div><div className="cart-total"><span>Subtotal<small>{count} item{count === 1 ? '' : 's'} in your collection</small></span><strong>{money(total)}<small>USD</small></strong></div><button disabled={placingOrder||!catalogReady||!!catalogError} className="button button-dark cart-continue" onClick={placeOrder}>{placingOrder?<><span className="adm-processing-spinner" /> Placing order...</>:<>Place order <FiArrowRight /></>}</button></>}</div></dialog>
      <dialog ref={supportDialog} className="support-dialog" aria-labelledby="support-title" onClick={(event) => { if (event.target === event.currentTarget) supportDialog.current.close() }}><div className="dialog-content"><div className="dialog-heading"><h2 id="support-title">Let’s find your fit.</h2><button className="icon-button" aria-label="Close support" onClick={() => supportDialog.current.close()}><FiX /></button></div><p>Have your vehicle’s make, model, year, and engine details handy. Our vehicle finder is a good place to start.</p><p className="cart-notice">Direct customer support will be available when the store launches.</p><button className="button button-orange" onClick={() => { supportDialog.current.close(); document.getElementById('finder').scrollIntoView({ behavior: 'smooth' }) }}>Open vehicle finder <FiArrowRight /></button></div></dialog>
    </>
  )
}
export default function App() {
  const loadCatalog = useCatalog(state => state.load)
  useEffect(() => { loadCatalog() }, [loadCatalog])
  return <Routes><Route path="/admin/login" element={<AdminLoginEntry />} /><Route path="/login" element={<Navigate to="/" replace />} /><Route path="/admin/forgot-password" element={<AdminAuth key="recovery" recovery />} /><Route path="/admin/reset-password" element={<ResetPassword />} /><Route path="/admin/*" element={<RequireAdmin><Admin /></RequireAdmin>} /><Route path="/" element={<Storefront />} /><Route path="/about" element={<Storefront />} /><Route path="/privacy" element={<Storefront />} /><Route path="/shop" element={<Storefront />} /><Route path="/shop/:department" element={<Storefront />} /><Route path="/product/:productId" element={<Storefront />} /><Route path="*" element={<main className="not-found"><h1>Looks like a wrong turn.</h1><Link className="button button-orange" to="/">Back to the store <FiArrowRight /></Link></main>} /></Routes>
}

function AdminLoginEntry() {
 const location = useLocation()
 return location.state?.adminLoginEntry ? <AdminAuth key="login" /> : <Navigate to="/" replace />
}
