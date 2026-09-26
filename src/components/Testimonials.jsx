import { FaStar } from 'react-icons/fa'

const reviews = [
  { name: 'Alex M.', label: 'Everyday driver', title: 'A much simpler way to shop.', quote: 'Finding the right part felt straightforward. I loved being able to start with my vehicle and explore from there.' },
  { name: 'Jordan K.', label: 'Weekend enthusiast', title: 'Made for people who love cars.', quote: 'A thoughtful selection and a clean shopping experience. It makes planning the next garage project a pleasure.' },
  { name: 'Sam R.', label: 'Hands-on owner', title: 'All the essentials, together.', quote: 'From filters to brake pads, having the essentials in one place makes my maintenance checklist feel manageable.' },
  { name: 'Taylor D.', label: 'Daily commuter', title: 'Clarity at every step.', quote: 'The categories are easy to explore, and the vehicle finder is a great starting point. Everything feels considered.' },
  { name: 'Chris A.', label: 'Road-trip enthusiast', title: 'Ready for the next journey.', quote: 'A welcoming place to discover useful upgrades. I would happily recommend this experience to another car enthusiast.' },
]

export default function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="testimonials-heading"><div><span className="eyebrow">THE PEOPLE BEHIND THE MILES</span><h2 id="testimonials-title">Good journeys.<br /><em>Great company.</em></h2></div><div className="testimonials-note"><span>What people say about us</span><p>Sample testimonials for this store preview.<br />These are illustrative, not verified customer reviews.</p></div></div>
        <div className="testimonial-grid">{reviews.map((review, index) => <article className="testimonial-card" key={review.name}><div className="review-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, star) => <FaStar key={star} aria-hidden="true" />)}</div><h3>{review.title}</h3><blockquote>{review.quote}</blockquote><div className="review-person"><span className="review-avatar" aria-hidden="true">{review.name.charAt(0)}</span><div><strong>{review.name}</strong><small>{review.label} ? Sample review</small></div><span className="review-number" aria-hidden="true">0{index + 1}</span></div></article>)}</div>
      </div>
    </section>
  )
}
