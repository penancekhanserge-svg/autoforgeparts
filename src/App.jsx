import { useEffect, useRef, useState } from 'react'
import { FiArrowRight, FiArrowUpRight, FiCheck, FiHeadphones, FiMinus, FiPlus, FiSearch, FiShield, FiShoppingBag, FiTool, FiTrash2, FiTruck, FiX, FiZap } from 'react-icons/fi'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaShoppingCart } from 'react-icons/fa'
import PartArt from './components/PartArt'
import Navbar from './components/Navbar'
import Showcase from './components/Showcase'
import { products, vehicles, money } from './data/products'
import { useCart } from './store/cart'

const categories = [
  { name: 'Brakes', type: 'brake', description: 'Confidence at every stop' },
  { name: 'Engine', type: 'filter', description: 'Keep the heart running' },
  { name: 'Suspension', type: 'shock', description: 'A smoother road ahead' },
  { name: 'Lighting', type: 'light', description: 'See more. Go further.' },
  { name: 'Tyres & wheels', type: 'tyre', description: 'Made to go the distance' },
  { name: 'Accessories', type: 'battery', description: 'The finishing touches' },
]

function Storefront() {
  const location = useLocation()
  const navigate = useNavigate()
  const isShop = location.pathname === '/shop'
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.hash])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All parts')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [fitment, setFitment] = useState(null)
  const cartDialog = useRef(null)
  const supportDialog = useRef(null)
  const { items, add, change, remove } = useCart()
  const cartItems = items.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product)
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
  const filtered = products.filter((product) =>
    (category === 'All parts' || product.category === category) &&
    (!query || (product.name + ' ' + product.category + ' ' + product.brand).toLowerCase().includes(query.toLowerCase())) &&
    (!fitment || (product.fit.includes(fitment.make + ' ' + fitment.model) && product.years.includes(Number(fitment.year)))),
  )
  const isFiltered = query || category !== 'All parts' || fitment
  const shownProducts = isFiltered ? filtered : filtered.slice(0, 4)
  function scrollToProducts() {
    if (!isShop) navigate('/shop#parts')
    else document.getElementById('parts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  function browseCategory(name) {
    setCategory(name)
    scrollToProducts()
  }
  function clearFilters() {
    setQuery(''); setCategory('All parts'); setFitment(null)
  }

  return (
    <>
      <div className="announcement"><div className="container announcement-inner"><span><FiZap /> BUILT FOR THE ROAD. READY FOR YOUR NEXT JOURNEY.</span><span className="announcement-right">The right part makes all the difference <FiArrowUpRight /></span></div></div>
      <Navbar
        categories={categories}
        onCategory={browseCategory}
        onBrowse={() => { clearFilters(); scrollToProducts() }}
        onSupport={() => supportDialog.current.showModal()}
        onCart={() => cartDialog.current.showModal()}
        count={count}
        fitment={fitment}
      />

      <main>
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
          <div className="hero-index"><strong>01</strong><span>/</span> THE JOURNEY STARTS HERE</div>
        </section>}

        <div className="container finder-container" style={isShop ? { marginTop: 28 } : undefined}>
          <section id="finder" className="finder" aria-labelledby="finder-title">
            <div className="finder-intro"><span className="finder-icon"><FiTool /></span><div><h2 id="finder-title">Start with your vehicle.</h2><p>A better fit. A better drive.</p></div></div>
            <form className="finder-form" onSubmit={(event) => { event.preventDefault(); setFitment({ make, model, year }); setCategory('All parts'); setQuery(''); scrollToProducts() }}>
              <label><span>01 &nbsp; MAKE</span><select required aria-label="Vehicle make" value={make} onChange={(event) => { setMake(event.target.value); setModel('') }}><option value="">Select make</option>{Object.keys(vehicles).map((value) => <option key={value}>{value}</option>)}</select></label>
              <label><span>02 &nbsp; MODEL</span><select required aria-label="Vehicle model" disabled={!make} value={model} onChange={(event) => setModel(event.target.value)}><option value="">Select model</option>{(vehicles[make] || []).map((value) => <option key={value}>{value}</option>)}</select></label>
              <label><span>03 &nbsp; YEAR</span><select required aria-label="Vehicle year" value={year} onChange={(event) => setYear(event.target.value)}><option value="">Select year</option>{[2023, 2022, 2021, 2020, 2019, 2018].map((value) => <option key={value}>{value}</option>)}</select></label>
              <button className="button button-dark" type="submit">Find my parts <FiArrowRight /></button>
            </form>
          </section>
        </div>

        <section className="container benefit-strip" aria-label="Shopping features">
          <div><FiTool /><span><strong>Made for your vehicle</strong><small>Find parts by make, model & year</small></span></div>
          <div><FiShoppingBag /><span><strong>All the essentials</strong><small>Maintenance to meaningful upgrades</small></span></div>
          <div><FiShield /><span><strong>Shop with clarity</strong><small>Clear details. Informed choices.</small></span></div>
          <div><FiHeadphones /><span><strong>A little guidance helps</strong><small>Let’s find the right part together</small></span></div>
        </section>

        {!isShop && <Showcase onExplore={(name) => { clearFilters(); browseCategory(name) }} />}

        {isShop && <><section className="section container" id="categories">
          <div className="section-heading"><div><span className="eyebrow">BUILT AROUND YOUR DRIVE</span><h2>Every part. Every possibility.</h2></div><a className="text-link" href="#parts" onClick={clearFilters}>Explore all parts <FiArrowUpRight /></a></div>
          <div className="category-grid">{categories.map((item) => <button className={'category-card ' + (category === item.name ? 'selected' : '')} key={item.name} onClick={() => browseCategory(item.name)}><PartArt type={item.type} /><span className="category-title">{item.name}<FiArrowUpRight /></span><small>{item.description}</small></button>)}</div>
        </section>

        <section className="products-section" id="parts">
          <div className="container">
            <div className="section-heading"><div><span className="eyebrow">SMALL UPGRADES. BIG DIFFERENCE.</span><h2>{isFiltered ? 'Find your next part.' : 'Good parts. Great starts.'}</h2></div><span className="demo-label">PREVIEW COLLECTION · SAMPLE PRICES</span></div>
            <div className="product-toolbar"><div className="filter-tabs" aria-label="Filter by category">{['All parts', 'Brakes', 'Engine', 'Suspension', 'Lighting'].map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div><span className="result-count">{shownProducts.length} parts to explore</span></div>
            {isFiltered && <div className="filter-summary"><span>{fitment ? fitment.year + ' ' + fitment.make + ' ' + fitment.model + ' · ' : ''}{query ? 'Search: “' + query + '” · ' : ''}{category}</span><button onClick={clearFilters}>Clear filters <FiX /></button></div>}
            <div className="product-grid">{shownProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image">{product.tag && <span className="product-tag">{product.tag}</span>}<PartArt type={product.type} /></div><div className="product-info"><span className="product-brand">{product.brand}</span><h3>{product.name}</h3><p className="product-fit"><FiCheck /> {product.fit.slice(0, 2).join(' / ')}</p><div className="product-bottom"><span>{money(product.price)}<small>per {product.type === 'light' ? 'kit' : 'unit'}</small></span><button className="add-button" aria-label={'Add ' + product.name + ' to cart'} onClick={() => { add(product.id); toast.success(product.name + ' added to cart') }}><FiPlus /></button></div></div></article>)}</div>
            {!shownProducts.length && <div className="empty-results"><FiSearch /><h3>No parts match just yet.</h3><p>Try a different category or vehicle in our sample collection.</p><button className="button button-dark" onClick={clearFilters}>Show all parts <FiArrowRight /></button></div>}
            <p className="fitment-note">Demo catalog: fitment is illustrative. Confirm exact specifications before purchasing.</p>
          </div>
        </section>

        </>}

        <section className="container story-section" id="about">
          <div className="story-panel"><span className="eyebrow light">MORE THAN A PART. A POSSIBILITY.</span><h2>Keep the good<br />miles coming.</h2><p>A morning commute. A weekend escape. That project in the garage. Whatever drives you, we’re building a better way to find your next part.</p><a className="button button-orange" href="#finder">Find your fit <FiArrowUpRight /></a><span className="story-outline" aria-hidden="true">AF</span></div>
          <div className="help-panel"><span className="help-icon"><FiHeadphones /></span><span className="eyebrow">A HUMAN TOUCH</span><h2>Not sure where<br />to start?</h2><p>You don’t have to know every part number. Start with your vehicle and take it from there.</p><button className="text-link" onClick={() => supportDialog.current.showModal()}>Let’s talk parts <FiArrowUpRight /></button><div className="help-bottom"><FiTool /><span>Good advice starts with the right questions.</span></div></div>
        </section>
        <div className="container closing-line"><FiTruck /><p>For the everyday driver. The weekend explorer. The hands-on enthusiast.</p><span>MADE TO KEEP YOU MOVING <FiArrowUpRight /></span></div>
      </main>

      <footer className="footer"><div className="container footer-main"><a className="logo" href="#"><span className="logo-mark">A<span /></span><span>AUTO<span className="logo-orange">FORGE</span><small>PARTS THAT KEEP YOU MOVING</small></span></a><p>Your next journey starts with the right part.</p><div><button onClick={() => { clearFilters(); scrollToProducts() }}>Shop all parts</button><a href="#finder">Find my fit</a><button onClick={() => supportDialog.current.showModal()}>Help & support</button></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} AutoForge Parts.</span><span>Store preview · Checkout coming soon</span><a href="#">Back to top ↑</a></div></footer>

      <dialog ref={cartDialog} className="cart-dialog" aria-labelledby="cart-title" onClick={(event) => { if (event.target === event.currentTarget) cartDialog.current.close() }}><div className="dialog-content"><div className="dialog-heading"><div><span className="eyebrow">YOUR NEXT UPGRADE</span><h2 id="cart-title">Your cart <span>({count})</span></h2></div><button className="icon-button" aria-label="Close cart" onClick={() => cartDialog.current.close()}><FiX /></button></div>{!cartItems.length ? <div className="empty-cart"><FaShoppingCart aria-hidden="true" /><h3>A little empty. Full of possibility.</h3><p>Find something for your next journey.</p><button className="button button-orange" onClick={() => { cartDialog.current.close(); scrollToProducts() }}>Explore parts <FiArrowRight /></button></div> : <><div className="cart-items">{cartItems.map(({ product, quantity }) => <div className="cart-item" key={product.id}><PartArt type={product.type} /><div><h3>{product.name}</h3><p>{money(product.price)}</p><div className="quantity-control"><button aria-label={'Decrease quantity of ' + product.name} onClick={() => change(product.id, -1)}><FiMinus /></button><span>{quantity}</span><button aria-label={'Increase quantity of ' + product.name} onClick={() => change(product.id, 1)}><FiPlus /></button></div></div><button className="icon-button remove-button" aria-label={'Remove ' + product.name} onClick={() => remove(product.id)}><FiTrash2 /></button></div>)}</div><div className="cart-total"><span>Subtotal</span><strong>{money(total)}</strong></div><p className="cart-notice">This is a store preview. Payments and delivery options aren’t connected yet.</p><button className="button button-dark cart-continue" onClick={() => { cartDialog.current.close(); scrollToProducts() }}>Continue exploring <FiArrowRight /></button></>}</div></dialog>
      <dialog ref={supportDialog} className="support-dialog" aria-labelledby="support-title" onClick={(event) => { if (event.target === event.currentTarget) supportDialog.current.close() }}><div className="dialog-content"><div className="dialog-heading"><h2 id="support-title">Let’s find your fit.</h2><button className="icon-button" aria-label="Close support" onClick={() => supportDialog.current.close()}><FiX /></button></div><p>Have your vehicle’s make, model, year, and engine details handy. Our vehicle finder is a good place to start.</p><p className="cart-notice">Direct customer support will be available when the store launches.</p><button className="button button-orange" onClick={() => { supportDialog.current.close(); document.getElementById('finder').scrollIntoView({ behavior: 'smooth' }) }}>Open vehicle finder <FiArrowRight /></button></div></dialog>
    </>
  )
}
export default function App() {
  return <Routes><Route path="/" element={<Storefront />} /><Route path="/shop" element={<Storefront />} /><Route path="*" element={<main className="not-found"><h1>Looks like a wrong turn.</h1><Link className="button button-orange" to="/">Back to the store <FiArrowRight /></Link></main>} /></Routes>
}
