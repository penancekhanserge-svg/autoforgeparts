import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../store/catalog'
import ProductVisual from './ProductVisual'
import { salePrice } from '../lib/pricing'
import { vehicleYearLabel } from '../lib/vehicleYearLabel'
import { money } from '../data/products'
import { FiArrowUpRight } from 'react-icons/fi'
import './Showcase.css'

export default function Showcase({ onAdd }) {
 const [paused, setPaused] = useState(false)
 const products=useCatalog(state=>state.products)
 const selected=[...new Set(products.filter(p=>p.status==='active').map(p=>p.category))].slice(0,6).map(category=>products.find(p=>p.category===category&&p.status==='active'&&p.stock>0)||products.find(p=>p.category===category&&p.status==='active'))
 if(!selected.length)return null
 return <section className="showcase sample-showcase" id="showcase" aria-labelledby="sample-products-title"><div className="container showcase-heading"><div><span className="eyebrow">A FEW PARTS TO GET YOU STARTED</span><h2 id="sample-products-title">Explore sample products.</h2></div><Link className="sample-view-all" to="/shop">View all products <FiArrowUpRight /></Link></div><div className="container sample-product-rows" data-paused={paused} onPointerDown={()=>setPaused(true)} onPointerUp={()=>setPaused(false)} onPointerCancel={()=>setPaused(false)} onPointerLeave={()=>setPaused(false)}>{[0,1].map(row=><div className="sample-row-window" key={row}><div className="sample-row-track">{[0,1].map(copy=><div className="sample-row-group" key={copy} aria-hidden={copy===1 ? true : undefined}>{[...selected.slice(row*3,row*3+3),...selected.slice(row*3,row*3+3)].map((product,index)=><button className="sample-product-card" key={product.id+index} tabIndex={copy===1 ? -1 : undefined} onClick={()=>onAdd(product)} aria-label={'View details for '+product.name}><span className="sample-product-art"><ProductVisual product={product} /><span><FiArrowUpRight /></span></span><span className="sample-product-copy"><small>{product.category}</small><strong>{product.name}</strong><span>{product.make} {product.model} / {vehicleYearLabel(product.years)}</span><span className="sample-product-price">{money(salePrice(product))}<small>{product.stock===0?'Sold out':'View & add to cart'}</small></span></span></button>)}</div>)}</div></div>)}</div></section>
}
