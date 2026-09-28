import NotificationMessage from './NotificationMessage'
import { useEffect, useRef, useState } from 'react'
import { FiArrowUpRight, FiGift, FiX, FiCheck } from 'react-icons/fi'
import './WelcomeOffer.css'

export default function WelcomeOffer({ onDismiss }) {
  const dialog = useRef(null)
  const previousFocus = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  useEffect(() => {
    previousFocus.current = document.activeElement
    const element = dialog.current
    element?.showModal()
  }, [])
  const close = () => dialog.current?.close()
  const onClose = () => {
    setFullName('')
    setEmail('')
    previousFocus.current?.focus?.()
    onDismiss()
  }
  return <dialog ref={dialog} className="welcome-offer" aria-labelledby="welcome-title" aria-describedby={submitted ? undefined : "welcome-description"} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) close() }}>
    <div className="welcome-layout">
      <div className="welcome-art"><span className="welcome-brand">AUTO<span>FORGE</span></span><div><span className="welcome-kicker">A LITTLE SOMETHING FOR THE ROAD</span><h2>Your next mile.<br /><em>Our warmest welcome.</em></h2><p>Good parts. New possibilities.</p></div><span className="welcome-art-caption">BUILT AROUND YOUR DRIVE</span></div>
      <div className="welcome-content"><button autoFocus className="welcome-close" onClick={close} aria-label="Close welcome offer"><FiX /></button><span className="welcome-gift">{submitted ? <FiCheck /> : <FiGift />}</span>
        {submitted ? <div role="status"><span className="eyebrow">THANKS FOR STOPPING BY</span><h2 id="welcome-title">You're in good company.</h2><NotificationMessage type="info" message="This offer is a preview. Your details have not been saved or sent, and no discount has been issued yet." /><button className="welcome-claim" onClick={close}>Continue exploring <FiArrowUpRight /></button></div> : <><span className="eyebrow">WELCOME TO AUTOFORGE</span><h2 id="welcome-title">Claim a discount<br /><em>on your first purchase.</em></h2><p id="welcome-description">Start your journey with a welcome offer. Enter your name and email to preview claiming your discount.</p>
        <form onSubmit={event => { event.preventDefault(); if (!fullName.trim()) return; setSubmitted(true); setFullName(''); setEmail('') }}>
          <label htmlFor="welcome-name">Full name</label><input id="welcome-name" name="name" autoComplete="name" placeholder="Your full name" required maxLength={120} pattern=".*\S.*" value={fullName} onChange={event => setFullName(event.target.value)} />
          <label htmlFor="welcome-email">Email address</label><input id="welcome-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} />
          <button type="submit" className="welcome-claim">Claim my discount <FiArrowUpRight /></button>
          <p className="welcome-note">Preview only. Discount terms and email signup are not connected. Your details are not stored or sent.</p>
        </form><button className="welcome-skip" onClick={close}>No thanks, just browsing</button></>}
      </div>
    </div>
  </dialog>
}
