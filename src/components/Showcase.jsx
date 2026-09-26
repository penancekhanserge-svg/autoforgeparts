import './Showcase.css'

const parts = [
  { title: 'Brake pads', description: 'Find the right brake pads for your car.', category: 'Brakes', position: '0% 0%' },
  { title: 'Engine filters', description: 'A fresh start for every journey.', category: 'Engine', position: '50% 0%' },
  { title: 'Suspension', description: 'Bring comfort back to every drive.', category: 'Suspension', position: '100% 0%' },
  { title: 'LED lighting', description: 'A brighter view of the road ahead.', category: 'Lighting', position: '0% 100%' },
  { title: 'Tyres & wheels', description: 'Find your grip. Go the distance.', category: 'Tyres & wheels', position: '50% 100%' },
  { title: 'Car batteries', description: 'Power up your next journey.', category: 'Accessories', position: '100% 100%' },
]

export default function Showcase({ onExplore }) {
  return (
    <section className="showcase" id="showcase" aria-label="Explore vehicle parts">
      <div className="container showcase-heading">
        <div><span className="eyebrow">THE RIGHT PART. THE RIGHT FIT.</span><h2>Built for your next mile.</h2></div>
        <p>Explore the essentials that keep you moving.</p>
      </div>
      <div className="container showcase-window">
        <div className="parts-viewport" role="region" aria-label="Parts collections">
          <div className="parts-marquee">
            {[0, 1].map((copy) => <div className="parts-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {parts.map((part) => <button className="parts-showcase-card" key={part.title} tabIndex={copy === 1 ? -1 : 0} aria-label={'Explore ' + part.title} onClick={() => onExplore(part.category)}>
                <span className="parts-photo" style={{ backgroundPosition: part.position }} />
                <span className="parts-photo-shade" />
                <span className="parts-card-copy"><strong>{part.title}</strong><span>{part.description}</span></span>
              </button>)}
            </div>)}
          </div>
        </div>
        <div className="parts-showcase-footer"><span>SIX COLLECTIONS. COUNTLESS POSSIBILITIES.</span></div>
      </div>
    </section>
  )
}
