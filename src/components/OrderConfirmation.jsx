import { useEffect, useRef } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheck, FiMessageSquare, FiX } from 'react-icons/fi'
import { money } from '../data/products'
import './OrderConfirmation.css'

export default function OrderConfirmation({ order, onClose }) {
 const dialog = useRef(null)
 useEffect(() => { dialog.current.showModal() }, [])
 const message = 'Hello AutoForge! I would like to follow up on my order. Reference number: ' + order.id + '\n\nOrder details:\n' + order.items.map(item => item.quantity + ' x ' + item.name + ' - ' + item.vehicle + ' (' + money(item.price) + ' each)').join('\n') + '\nSubtotal: ' + money(order.total) + '\nPlease confirm availability, delivery and payment details.'
 const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
 return <dialog ref={dialog} className="order-confirmation" aria-labelledby="order-confirmation-title" onClose={onClose} onClick={event=>{if(event.target===event.currentTarget)dialog.current.close()}}><button autoFocus className="order-confirmation-close" aria-label="Close order confirmation" onClick={()=>dialog.current.close()}><FiX /></button><span className="order-confirmation-check"><FiCheck /></span><span className="eyebrow">ONE STEP CLOSER TO YOUR NEXT UPGRADE</span><h2 id="order-confirmation-title">Order placed successfully.</h2><p>Please follow up on your order via WhatsApp or SMS with your reference number. Tap either option below with your reference number to checkout.</p><div className="order-confirmation-summary"><span>Reference <strong>{order.id}</strong></span><span>Subtotal <strong>{money(order.total)}</strong></span></div><div className="order-confirmation-actions"><a href={'https://wa.me/237678156882?text='+encodeURIComponent(message)} target="_blank" rel="noopener noreferrer"><FaWhatsapp /> Follow up on WhatsApp</a><a href={'sms:+237678156882'+(ios?'&':'?')+'body='+encodeURIComponent(message)}><FiMessageSquare /> Follow up by SMS</a></div></dialog>
}
