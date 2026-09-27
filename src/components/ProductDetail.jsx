import { useCatalog } from '../store/catalog'
import ProductVisual from './ProductVisual'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowRight, FiMinus, FiPlus, FiShoppingBag, FiMessageCircle } from 'react-icons/fi'
import { money, categorySlug } from '../data/products'
import './ProductDetail.css'

export default function ProductDetail({ onAdd }) {
  const catalogProducts = useCatalog(state => state.products)
  const products = catalogProducts.filter(product => product.status === 'active')
  const { productId } = useParams()
  const product = products.find(item => item.id === productId)
  const [quantity, setQuantity] = useState(1)
  const [zoomed, setZoomed] = useState(false)
  if (!product) return <section className="container detail-missing"><h1>This part couldn't be found.</h1><Link to="/shop">Explore all parts <FiArrowRight /></Link></section>
  const related = products.filter(item => item.category === product.category && item.make === product.make && item.model === product.model && item.id !== product.id)
  return <section className="container product-detail">
    <nav className="detail-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to={'/shop/' + categorySlug(product.category)}>{product.category}</Link><span>/</span><span>{product.name}</span></nav>
    <div className="detail-layout">
      <div className="detail-gallery"><div className="detail-gallery-label"><span>AUTOFORGE COLLECTION</span><span>{product.category}</span></div><button className={'detail-art ' + (zoomed ? 'is-zoomed' : '')} aria-label={zoomed ? 'Zoom out of product illustration' : 'Zoom in on product illustration'} aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}><ProductVisual product={product} /></button><div className="detail-gallery-caption"><span>Product illustration</span><span>{zoomed ? 'Click to zoom out' : 'Click to explore the details'} <FiPlus /></span></div></div>
      <div className="detail-purchase"><span className="eyebrow">{product.brand}</span><h1>{product.name}</h1><p className="detail-intro">Your next upgrade starts with the right details. Explore this {product.category.toLowerCase()} option for your {product.make} {product.model}.</p><div className="detail-price">{money(product.price)}<span>USD / unit ? Sample price</span></div><div className="detail-fit" id="finder"><span>YOUR VEHICLE</span><strong>{product.make} {product.model}</strong><p>{Math.min(...product.years)} - {Math.max(...product.years)}. Confirm exact fitment before ordering.</p><Link to="/shop#finder">Find parts for another vehicle <FiArrowRight /></Link></div>
      <div className="detail-order"><div className="detail-quantity" role="group" aria-label="Quantity"><button aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}><FiMinus /></button><output aria-live="polite">{quantity}</output><button aria-label="Increase quantity" disabled={quantity === 99} onClick={() => setQuantity(quantity + 1)}><FiPlus /></button></div><button className="detail-add" disabled={product.stock === 0} onClick={() => onAdd(product.id, quantity)}><FiShoppingBag /> {product.stock === 0 ? 'Out of stock' : 'Add to cart'} <span>{money(product.price * quantity)}</span></button></div>
      <a className="detail-help" href={'https://wa.me/237678156882?text=' + encodeURIComponent('Hello AutoForge! Could you help me confirm fitment and availability for ' + product.name + ' for my ' + product.make + ' ' + product.model + '?')} target="_blank" rel="noopener noreferrer"><FiMessageCircle /> Ask about this part <FiArrowRight /></a><p className="detail-note">Store preview. Availability, delivery, warranty, and manufacturer specifications are not yet verified. Checkout is not connected.</p></div>
    </div>
    <div className="detail-admin-copy">{product.description && <section><h2>Product overview</h2><p>{product.description}</p></section>}{product.specifications && <section><h2>Specifications</h2><p>{product.specifications}</p></section>}{product.warranty && <section><h2>Warranty & notes</h2><p>{product.warranty}</p></section>}</div>
    <div className="detail-information" id="about"><div><span className="eyebrow">KNOW YOUR NEXT UPGRADE</span><h2>The details<br />make the difference.</h2><p>Confirm the part number and your vehicle's exact specifications before ordering.</p></div><dl>{[['Department', product.category], ['Product brand', product.brand], ['Vehicle', product.fit[0]], ['Catalog years', Math.min(...product.years) + ' - ' + Math.max(...product.years)], ['Listing reference', product.id], ['Fitment status', 'Requires verification']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
    <section className="detail-related" aria-labelledby="related-title"><div className="detail-related-heading"><h2 id="related-title">More for your {product.model}.</h2><Link to={'/shop/' + categorySlug(product.category)}>Explore the collection <FiArrowRight /></Link></div><div className="detail-related-grid">{related.map(item => <Link key={item.id} to={'/product/' + encodeURIComponent(item.id)}><ProductVisual product={item} /><div><span>{item.brand}</span><h3>{item.name}</h3><strong>{money(item.price)}</strong></div><FiArrowRight /></Link>)}</div></section>
  </section>
}
