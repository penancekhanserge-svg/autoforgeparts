import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiMessageCircle } from 'react-icons/fi'
import './InfoPages.css'

export default function ContactForm() {
  const [draft, setDraft] = useState('')
  function prepare(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name')).trim()
    const message = String(data.get('message')).trim()
    if (!name || !message) return
    setDraft('Hello AutoForge! My name is ' + name + '. My email is ' + data.get('email') + '.\n\n' + message)
  }
  return <section className="container contact-section" id="contact" aria-labelledby="contact-title"><div className="contact-intro"><span className="eyebrow">A REAL CONVERSATION STARTS HERE</span><h2 id="contact-title">Let's talk<br /><em>about your next mile.</em></h2><p>Need help choosing a part? Tell us your vehicle's make, model, year, and what you are looking for.</p><a href="https://wa.me/237678156882" target="_blank" rel="noopener noreferrer"><FiMessageCircle /> +237 6 78 15 68 82 <FiArrowUpRight /></a></div><form className="contact-form" onSubmit={prepare} onChange={() => setDraft('')}><div className="contact-fields"><label>Full name<input name="name" autoComplete="name" required maxLength={120} pattern=".*\S.*" placeholder="Your full name" /></label><label>Email address<input name="email" autoComplete="email" type="email" required maxLength={254} placeholder="you@example.com" /></label></div><label>How can we help?<textarea name="message" required minLength={5} maxLength={2000} rows={4} placeholder="Tell us about your vehicle and the parts you need." /></label><p>We'll prepare your message for WhatsApp. Nothing is sent until you open the chat and press Send. <Link to="/privacy">Privacy details</Link></p><button type="submit" className="button button-dark">Prepare message <FiArrowUpRight /></button>{draft && <div className="contact-ready" role="status"><p>Your message is ready. Review it in WhatsApp before sending.</p><a className="button button-dark" href={'https://wa.me/237678156882?text=' + encodeURIComponent(draft)} target="_blank" rel="noopener noreferrer">Open WhatsApp <FiArrowUpRight /></a></div>}</form></section>
}
