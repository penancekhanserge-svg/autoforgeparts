import { useEffect, useRef, useState } from 'react'
import { FiArrowRight, FiArrowUpRight, FiChevronDown, FiGrid, FiHeadphones, FiMenu, FiTool, FiX, FiZap } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import PartArt from './PartArt'
import './Navbar.css'

export default function Navbar({ categories, onCategory, onBrowse, onSupport, onCart, count, fitment }) {
  const isHome = useLocation().pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const header = useRef(null)
  const categoryTrigger = useRef(null)
  const mobileTrigger = useRef(null)

  useEffect(() => {
    function dismiss(event) {
      if (!header.current?.contains(event.target)) {
        setCategoriesOpen(false)
        setMenuOpen(false)
      }
    }
    function escape(event) {
      if (event.key === 'Escape') {
        if (categoriesOpen) {
          setCategoriesOpen(false)
          categoryTrigger.current?.focus()
        } else if (menuOpen) {
          setMenuOpen(false)
          mobileTrigger.current?.focus()
        }
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [categoriesOpen, menuOpen])

  useEffect(() => {
    const element = header.current
    const measure = () => {
      const sticky = getComputedStyle(element).position === 'sticky'
      document.documentElement.style.setProperty('--nav-height', sticky ? element.offsetHeight + 'px' : '0px')
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      document.documentElement.style.removeProperty('--nav-height')
    }
  }, [])
  function closeMenus() {
    setMenuOpen(false)
    setCategoriesOpen(false)
  }

  return (
    <header className="premium-nav" ref={header} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) closeMenus()
    }}>
      <div className="announcement"><div className="container announcement-inner"><span><FiZap /> BUILT FOR THE ROAD. READY FOR YOUR NEXT JOURNEY.</span><span className="announcement-right">The right part makes all the difference <FiArrowUpRight /></span></div></div>
      <div className="container premium-main">
        <Link className="premium-brand" to="/" aria-label="AutoForge Parts home" onClick={closeMenus}>
          <span className="premium-emblem" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M8 30 20 8h6L14 30H8Zm13-11h6l6 11H21l3-5h-6l3-6Z" fill="currentColor"/></svg></span>
          <span className="premium-wordmark">AUTO<span>FORGE</span><small className="premium-desktop-tagline">PRECISION PARTS. LIMITLESS POSSIBILITIES.</small><small className="premium-mobile-tagline">PARTS FOR EVERY JOURNEY</small></span>
        </Link>
        <div className="premium-actions">
          <button className="premium-support" onClick={() => { closeMenus(); onSupport() }}><span className="premium-action-icon"><FiHeadphones /></span><span><small>A LITTLE EXPERT GUIDANCE</small><strong>Let’s talk parts <FiArrowUpRight /></strong></span></button>
          <span className="premium-divider" />
          <button className="premium-cart" onClick={() => { closeMenus(); onCart() }} aria-label={'Open cart, ' + count + ' items'}><span className="premium-cart-icon"><FaShoppingCart aria-hidden="true" /><b>{count}</b></span><span>Your cart<small>{count ? count + ' item' + (count === 1 ? '' : 's') + ' in cart' : 'Ready for an upgrade'}</small></span></button>
          <button ref={mobileTrigger} className="premium-menu-toggle" aria-label="Toggle navigation" aria-controls="premium-navigation" aria-expanded={menuOpen} onClick={() => { setMenuOpen(!menuOpen); setCategoriesOpen(false) }}>{menuOpen ? <FiX /> : <FiMenu />}</button>
        </div>
      </div>
      <div className="premium-nav-border">
        <div className="container premium-nav-row">
          <nav id="premium-navigation" className={'premium-links ' + (menuOpen ? 'is-open' : '')} aria-label="Main navigation">
            <button ref={categoryTrigger} className={'premium-categories-trigger ' + (categoriesOpen ? 'is-active' : '')} aria-expanded={categoriesOpen} aria-controls="premium-categories" onClick={() => setCategoriesOpen(!categoriesOpen)}><FiGrid /><span>Explore categories</span><FiChevronDown className={categoriesOpen ? 'rotated' : ''} /></button>
            <Link to="/" className={isHome ? "premium-home-link" : ""} onClick={closeMenus}>Home{isHome && <span />}</Link>
            <a href="/shop#parts" onClick={(event) => { event.preventDefault(); closeMenus(); onBrowse() }}>Shop all parts</a>
            <Link to="/about" onClick={closeMenus}>About us <FiArrowUpRight /></Link>
            <button className="premium-mobile-support" onClick={() => { closeMenus(); onSupport() }}><FiHeadphones /> Help & support</button>
          </nav>
          <a className="premium-vehicle" href="/shop#finder" onClick={closeMenus}><span className="premium-vehicle-icon"><FiTool /></span><span>{fitment ? fitment.year + ' ' + fitment.make + ' ' + fitment.model : 'Add your vehicle'}<small>{fitment ? 'Change vehicle' : 'Find your perfect fit'}</small></span><FiArrowRight /></a>
        </div>
      </div>
      {categoriesOpen && <div className="premium-mega" id="premium-categories">
        <div className="premium-mega-heading"><div><span>THE RIGHT PART STARTS HERE</span><h2>Built around your drive.</h2></div><button aria-label="Close categories" onClick={() => { setCategoriesOpen(false); categoryTrigger.current?.focus() }}><FiX /></button></div>
        <div className="premium-category-list">{categories.map((category) => <button key={category.name} onClick={() => { closeMenus(); onCategory(category.name) }}><span className="premium-part-image"><PartArt type={category.type} /></span><span><strong>{category.name}</strong><small>{category.description}</small></span><FiArrowUpRight /></button>)}</div>
        <div className="premium-mega-footer"><span>From everyday essentials to your next upgrade.</span><a href="/shop#parts" onClick={(event) => { event.preventDefault(); closeMenus(); onBrowse() }}>Explore all parts <FiArrowRight /></a></div>
      </div>}
    </header>
  )
}
