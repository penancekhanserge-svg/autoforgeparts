import { FaWhatsapp } from 'react-icons/fa'
import './ContactOptions.css'

const whatsapp = 'https://wa.me/237678156882?text=' + encodeURIComponent('Hello AutoForge! I need help finding the right parts for my vehicle. Could you please assist me?')
const message = 'Hello, I would like more information about your services.'

export default function ContactOptions() {
 const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
 const sms = 'sms:+237678156882' + (ios ? '&' : '?') + 'body=' + encodeURIComponent(message)
 return <div className="whatsapp-contact contact-direct">
  <div className="contact-direct-icons">
   <a className="sms-orb" href={sms} aria-label="Contact us by SMS" title="Send an SMS"><span className="sms-bubble" aria-hidden="true"><i /><i /><i /></span></a>
   <a className="whatsapp-orb" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp (opens in a new tab)" title="Chat on WhatsApp"><FaWhatsapp aria-hidden="true" /></a>
  </div>
  <span className="whatsapp-caption"><strong>Need help?</strong><span>Contact us directly</span></span>
 </div>
}
