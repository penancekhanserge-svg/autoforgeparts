import { FiTruck, FiRefreshCw, FiMessageCircle, FiEye, FiArrowUpRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import './ServiceStrip.css'

const services = [
  { icon: FiTruck, title: 'Plan your next delivery', description: 'Ask about delivery options for your location.', to: '/about#contact' },
  { icon: FiRefreshCw, title: 'Know your options', description: 'Discuss return terms before placing an order.', to: '/about#contact' },
  { icon: FiMessageCircle, title: 'A conversation away', description: 'Get help choosing your next part on WhatsApp.', to: 'https://wa.me/237678156882?text=Hello%20AutoForge!%20I%20need%20help%20choosing%20a%20part.' },
  { icon: FiEye, title: 'Your details, explained', description: 'See how we handle the information you share.', to: '/privacy' },
]

export default function ServiceStrip() {
  return <section className="service-strip" aria-label="Shopping guidance and customer care"><div className="container service-strip-inner"><div className="service-strip-caption"><span>THOUGHTFUL SERVICE. EVERY STEP.</span><span>THE AUTOFORGE APPROACH</span></div><div className="service-strip-grid">{services.map(({ icon: Icon, title, description, to }, index) => {
    const content = <><span className="service-strip-icon"><Icon aria-hidden="true" /></span><span className="service-strip-copy"><span className="service-strip-number" aria-hidden="true">0{index + 1}</span><strong>{title}</strong><span>{description}</span></span><FiArrowUpRight className="service-strip-arrow" aria-hidden="true" /></>
    return to.startsWith('https:') ? <a key={title} className="service-strip-item" href={to} target="_blank" rel="noopener noreferrer" aria-label={title + ' on WhatsApp (opens in a new tab)'}>{content}</a> : <Link key={title} className="service-strip-item" to={to}>{content}</Link>
  })}</div></div></section>
}
