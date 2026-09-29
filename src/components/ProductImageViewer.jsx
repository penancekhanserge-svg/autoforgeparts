import { useEffect, useRef, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import ProductVisual from './ProductVisual'
import { useProductImages } from '../store/productImages'
import './ProductImageViewer.css'
const magnification=3
const clamp=value=>Math.max(0,Math.min(1,value))
export default function ProductImageViewer({product,onClose}) {
 const dialog=useRef(null)
 const legacy=useProductImages(state=>state.images[product.id])
 const [photoIndex,setPhotoIndex]=useState(0)
 const [ratio,setRatio]=useState(1)
 const [position,setPosition]=useState({x:.5,y:.5})
 const [active,setActive]=useState(false)
 const photo=product.photos?.[photoIndex]
 const image=photo?.url||legacy
 const lensSize=1/magnification
 const left=Math.max(0,Math.min(1-lensSize,position.x-lensSize/2))
 const top=Math.max(0,Math.min(1-lensSize,position.y-lensSize/2))
 useEffect(()=>{const node=dialog.current;node.showModal();return()=>node.close()},[])
 function point(event){const box=event.currentTarget.getBoundingClientRect();setPosition({x:clamp((event.clientX-box.left)/box.width),y:clamp((event.clientY-box.top)/box.height)});setActive(true)}
 function keyboard(event){const delta={ArrowLeft:[-.04,0],ArrowRight:[.04,0],ArrowUp:[0,-.04],ArrowDown:[0,.04]}[event.key];if(!delta)return;event.preventDefault();setActive(true);setPosition(p=>({x:clamp(p.x+delta[0]),y:clamp(p.y+delta[1])}))}
 return <dialog ref={dialog} className="product-zoom-dialog" aria-labelledby="zoom-title" onClose={event=>{if(!event.currentTarget.open)onClose()}} onClick={event=>{if(event.target===event.currentTarget)dialog.current.close()}}><header><h2 id="zoom-title">{product.name}</h2><button type="button" aria-label="Close image" onClick={()=>dialog.current.close()}><FiX /></button></header>{image?<><div className="rollover-layout"><div><div className="rollover-original" style={{aspectRatio:ratio}} tabIndex={0} role="group" aria-label="Image magnifier. Move over the image, drag a finger, or use arrow keys to inspect details." onPointerEnter={point} onPointerMove={point} onPointerLeave={()=>setActive(false)} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);point(event)}} onPointerCancel={()=>setActive(false)} onFocus={()=>setActive(true)} onBlur={()=>setActive(false)} onKeyDown={keyboard}><img src={image} alt={photo?.alt||product.name} draggable="false" onLoad={event=>setRatio(event.currentTarget.naturalWidth/event.currentTarget.naturalHeight)} /><span className={'rollover-lens '+(active?'is-active':'')} style={{width:lensSize*100+'%',height:lensSize*100+'%',left:left*100+'%',top:top*100+'%'}} /></div><p className="rollover-help"><FiSearch /> Move over the image to zoom. On mobile, touch and drag.</p></div><div className="rollover-enlarged" style={{aspectRatio:ratio}} aria-label="Magnified image detail"><img src={image} alt={'Magnified detail of '+product.name} draggable="false" style={{width:magnification*100+'%',height:magnification*100+'%',left:-left*magnification*100+'%',top:-top*magnification*100+'%'}} /><span className="rollover-scale">3? detail</span></div></div>{product.photos?.length>1&&<div className="rollover-thumbnails">{product.photos.map((item,index)=><button type="button" key={item.url} aria-label={'View photo '+(index+1)} aria-pressed={index===photoIndex} onClick={()=>{setPhotoIndex(index);setPosition({x:.5,y:.5})}}><img src={item.url} alt="" /></button>)}</div>}</>:<div className="rollover-fallback"><ProductVisual product={product} /><p>No product photo available yet.</p></div>}</dialog>
}
