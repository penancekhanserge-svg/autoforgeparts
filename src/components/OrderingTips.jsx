import { useEffect, useState } from 'react'
import { FiTruck, FiMessageCircle } from 'react-icons/fi'
import './OrderingTips.css'
const tips=[['Start with the details.','Have your make, model, and year ready so we can help you check the right fit.'],['Keep your reference handy.','Your order reference helps our team find the details when you message us.'],['Ask before you order.','Confirm availability, delivery, payment, and return terms with our team.']]
function TipCard({ offset, Icon }){
 const [active,setActive]=useState(offset),[hover,setHover]=useState(false),[focus,setFocus]=useState(false),[touch,setTouch]=useState(false)
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');let timer;const start=()=>{clearInterval(timer);if(!media.matches&&!hover&&!focus&&!touch)timer=setInterval(()=>{if(!document.hidden)setActive(value=>(value+1)%tips.length)},1000)};start();media.addEventListener('change',start);return()=>{clearInterval(timer);media.removeEventListener('change',start)}},[hover,focus,touch])
 return <div className="ordering-tips tip-feature-card" role="region" aria-label="Helpful ordering tips" aria-roledescription="carousel" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setFocus(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocus(false)}} onPointerDown={()=>setTouch(true)} onPointerUp={()=>setTouch(false)} onPointerCancel={()=>setTouch(false)} onPointerLeave={()=>setTouch(false)}><span className="tip-feature-icon"><Icon /></span><div className="ordering-tip-copy" key={active}><h3>{tips[active][0]}</h3><p>{tips[active][1]}</p></div><div className="ordering-tip-dots" aria-label="Choose a tip">{tips.map(([title],index)=><button key={title} aria-label={'Tip '+(index+1)+': '+title} aria-pressed={active===index} onClick={()=>setActive(index)}><span /></button>)}</div></div>
}

export default function OrderingTips() { return <div className="tip-feature-grid"><TipCard offset={0} Icon={FiTruck} /><TipCard offset={1} Icon={FiMessageCircle} /></div> }
