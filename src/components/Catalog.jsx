import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FiArrowUpRight, FiPlus, FiSliders } from 'react-icons/fi'
import { products, vehicles, vehicleYears, money, categorySlug } from '../data/products'
import PartArt from './PartArt'
import './Catalog.css'

const PAGE_SIZE = 20

export default function Catalog({ categories, onAdd, fitment }) {
  const { department } = useParams()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const category = categories.find(item => categorySlug(item.name) === department)
  const make = params.get('make') ?? fitment?.make ?? ''
  const model = params.get('model') ?? (make === fitment?.make ? fitment?.model : '') ?? ''
  const year = params.get('year') ?? fitment?.year ?? ''
  const brand = params.get('brand') || ''
  const price = params.get('price') || ''
  const sort = params.get('sort') || 'featured'
  const query = params.get('q') || ''
  const update = (key, value) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    if (key === 'make') next.set('model', '')
    next.delete('page')
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const reset = () => setParams({ make: '', model: '', year: '' }, { replace: true, preventScrollReset: true })
  const filtered = products.filter(product =>
    (!category || product.category === category.name) &&
    (!make || product.make === make) && (!model || product.model === model) &&
    (!year || product.years.includes(Number(year))) && (!brand || product.brand === brand) &&
    (!query || (product.name + ' ' + product.make + ' ' + product.model).toLowerCase().includes(query.toLowerCase())) &&
    (!price || (price === 'under50' ? product.price < 50 : price === '50to150' ? product.price >= 50 && product.price <= 150 : product.price > 150)),
  ).sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name) : category ? 0 : (a.make + a.model + a.brand).localeCompare(b.make + b.model + b.brand))
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(pages, Math.max(1, Math.floor(Number(params.get('page'))) || 1))
  const goToPage = value => {
    const next = new URLSearchParams(params)
    next.set('page', String(value))
    setParams(next, { preventScrollReset: true })
    document.getElementById('parts')?.scrollIntoView({ block: 'start' })
  }
  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1).filter(value => value === 1 || value === pages || Math.abs(value - page) <= 1)
  if (department && !category) return <section className="container catalog"><h1>Department not found.</h1><Link to="/shop">Browse all parts</Link></section>
  return <section className="container catalog" id="parts">
    <div className="catalog-breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link>{category && <><span>/</span><span>{category.name}</span></>}</div>
    <div className="catalog-heading"><div><span className="eyebrow">PURPOSEFUL PARTS. CONSIDERED CHOICES.</span><h1>{category ? category.name + ', built around your drive.' : 'Find your next upgrade.'}</h1><p>Explore by vehicle, compare brands, and find your price.</p></div>{category && <PartArt type={category.type} />}</div>
    <nav className="catalog-departments" aria-label="Departments"><Link className={!department ? 'active' : ''} to="/shop">All parts</Link>{categories.map(item => <Link className={category?.name === item.name ? 'active' : ''} key={item.name} to={'/shop/' + categorySlug(item.name)}>{item.name}</Link>)}</nav>
    <div className="catalog-layout">
      <button className="catalog-filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen(!filtersOpen)}><FiSliders /> Refine your selection</button>
      <aside className={'catalog-filters ' + (filtersOpen ? 'is-open' : '')} id="catalog-filters"><div className="catalog-filter-title"><h2>Refine your selection</h2><button onClick={reset}>Reset</button></div>
        <label>Search parts<input value={query} onChange={event => update('q', event.target.value)} placeholder="Part or vehicle name" /></label>
        <label>Vehicle make<select value={make} onChange={event => update('make', event.target.value)}><option value="">All makes</option>{Object.keys(vehicles).map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Vehicle model<select value={model} disabled={!make} onChange={event => update('model', event.target.value)}><option value="">All models</option>{(vehicles[make] || []).map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Year<select value={year} onChange={event => update('year', event.target.value)}><option value="">All years</option>{vehicleYears.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Product brand<select value={brand} onChange={event => update('brand', event.target.value)}><option value="">All brands</option>{[...new Set(products.map(item => item.brand))].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Price range ? USD<select value={price} onChange={event => update('price', event.target.value)}><option value="">Any price</option><option value="under50">Under $50</option><option value="50to150">$50 ? $150</option><option value="over150">Over $150</option></select></label>
      </aside>
      <div className="catalog-results"><div className="catalog-toolbar"><span><strong>{filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}?{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of {filtered.length} parts</span><label>Sort by<select value={sort} onChange={event => update('sort', event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label></div>
        <div className="catalog-grid compact-square-grid">{filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(product => <article className="product-card" key={product.id}><div className="product-image"><span className="catalog-product-label">{product.category}</span><PartArt type={product.type} /></div><div className="product-info"><span className="product-brand">{product.brand}</span><h3>{product.name}</h3><p className="catalog-vehicle">{product.make} {product.model}<span className="catalog-years">Model years: {Math.min(...product.years)} - {Math.max(...product.years)}</span></p><div className="product-bottom"><span>{money(product.price)}</span><button className="catalog-add-cart" aria-label={'Add ' + product.name + ' for ' + product.fit[0] + ' to cart'} onClick={() => onAdd(product.id)}><FiPlus /> Add to cart</button></div></div></article>)}</div>
        {!filtered.length && <div className="empty-results"><h2>No matching parts.</h2><p>Try another vehicle, brand, or price range.</p><button className="button button-dark" onClick={reset}>Reset filters <FiArrowUpRight /></button></div>}
        {pages > 1 && <nav className="catalog-pagination" aria-label="Catalog pages"><button disabled={page === 1} onClick={() => goToPage(page - 1)}>Previous</button><div className="catalog-page-numbers">{pageNumbers.map((value, index) => <span key={value}>{index > 0 && value - pageNumbers[index - 1] > 1 && <span className="catalog-page-gap">...</span>}<button aria-label={'Page ' + value} aria-current={value === page ? 'page' : undefined} onClick={() => goToPage(value)}>{value}</button></span>)}</div><button disabled={page === pages} onClick={() => goToPage(page + 1)}>Next</button><span className="catalog-page-status" aria-live="polite">Page {page} of {pages}</span></nav>}
      </div>
    </div>
  </section>
}
