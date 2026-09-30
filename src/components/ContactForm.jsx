import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiMail } from 'react-icons/fi'
import './InfoPages.css'

export default function ContactForm() {
  function sendMessage(event) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()
    const subject = 'AutoForge parts enquiry from ' + name
    const body = ['Name: ' + name, 'Email: ' + email, '', message].join('\n')
    window.location.href = 'mailto:autoforgeparts2@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body)
  }

  return <section className="container contact-section" id="contact" aria-labelledby="contact-title"><div className="contact-intro"><span className="eyebrow">A REAL CONVERSATION STARTS HERE</span><h2 id="contact-title">Let's talk<br /><em>about your next mile.</em></h2><p>Need help choosing a part? Send us your vehicle details and what you are looking for.</p><p className="contact-email-note">Your message will open in your email app addressed to autoforgeparts2@gmail.com.</p></div><form className="contact-form" onSubmit={sendMessage}><div className="contact-fields"><label>Full name<input name="name" autoComplete="name" required maxLength={120} pattern=".*\S.*" placeholder="Your full name" /></label><label>Email address<input name="email" autoComplete="email" type="email" required maxLength={254} placeholder="you@example.com" /></label></div><label>How can we help?<textarea name="message" required minLength={5} maxLength={2000} rows={4} placeholder="Tell us about your vehicle and the parts you need." /></label><p>Click Send message to open your email app with your details. <Link to="/privacy">Privacy details</Link></p><button type="submit" className="button button-dark"><FiMail /> Send message <FiArrowUpRight /></button></form></section>
}
