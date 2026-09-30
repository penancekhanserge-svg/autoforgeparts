import ProductImageViewer from './ProductImageViewer'
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
 const [imageProduct,setImageProduct]=useState(null)
 const [paused, setPaused] = useState(false)
 const products=useCatalog(state=>state.products)
 const activeProducts=products.filter(p=>p.status==='active')
 const rows=[activeProducts.filter((_,index)=>index%2===0),activeProducts.filter((_,index)=>index%2===1)]
 if(!activeProducts.length)return null
 return <section className="showcase sample-showcase" id="showcase" aria-labelledby="sample-products-title"><div className="container showcase-heading"><div><span className="eyebrow">A FEW PARTS TO GET YOU STARTED</span><h2 id="sample-products-title">Explore sample products.</h2></div><Link className="sample-view-all" to="/shop">View all products <FiArrowUpRight /></Link></div><div className="container sample-product-rows" data-paused={paused||!!imageProduct} onPointerDown={()=>setPaused(true)} onPointerUp={()=>setPaused(false)} onPointerCancel={()=>setPaused(false)} onPointerLeave={()=>setPaused(false)}>{rows.map((rowProducts,row)=><div className="sample-row-window" key={row}><div className="sample-row-track">{[rowProducts,rowProducts].map((group,copy)=><div className="sample-row-group" key={copy} aria-hidden={copy===1 ? true : undefined}>{group.map(product=><article className="sample-product-card" key={product.id+'-'+copy}><button type="button" tabIndex={copy===1?-1:0} onClick={()=>setImageProduct(product)} aria-label={'View image of '+product.name} className="sample-product-art"><ProductVisual product={product} /><span><FiArrowUpRight /></span></button><span className="sample-product-copy"><small>{product.category}</small><strong>{product.name}</strong><span>{product.make} {product.model} / {vehicleYearLabel(product.years)}</span><span className="sample-product-price">{money(salePrice(product))}<button type="button" className="catalog-add-cart" disabled={product.stock===0} tabIndex={copy===1?-1:0} onClick={()=>onAdd(product)}>{product.stock===0?'Sold out':'Add to cart'}</button></span></span></article>)}</div>)}</div></div>)}</div>{imageProduct&&<ProductImageViewer key={imageProduct.id} product={imageProduct} onClose={()=>setImageProduct(null)} />}</section>
}
