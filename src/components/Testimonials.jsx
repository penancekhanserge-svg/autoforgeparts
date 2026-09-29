import { useEffect } from 'react'
import { useReviews } from '../store/reviews'
import { FaStar } from 'react-icons/fa'

export default function Testimonials() {
  const {reviews:allReviews,loading,error,load}=useReviews()
  useEffect(()=>{load();window.addEventListener('focus',load);return()=>window.removeEventListener('focus',load)},[load])
  const reviews=allReviews.filter(review=>review.published)
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="testimonials-heading"><div><span className="eyebrow">THE PEOPLE BEHIND THE MILES</span><h2 id="testimonials-title">Good journeys.<br /><em>Great company.</em></h2></div><div className="testimonials-note"><span>What people say about us</span></div></div>
        {loading?<p role="status">Loading reviews...</p>:error?<div role="alert">Unable to load reviews. <button onClick={load}>Retry</button></div>:!reviews.length?<div className="reviews-empty-state"><h3>No reviews yet</h3><p>Customer feedback will appear here when published.</p></div>:null}
        <div className="testimonial-grid">{reviews.map((review, index) => <article className="testimonial-card" key={review.id||review.name}><div className="review-stars" aria-label={(review.rating||5)+' out of 5 stars'}>{Array.from({ length: review.rating||5 }, (_, star) => <FaStar key={star} aria-hidden="true" />)}</div><h3>{review.title}</h3><blockquote>{review.quote}</blockquote><div className="review-person"><span className="review-avatar" aria-hidden="true">{review.name.charAt(0)}</span><div><strong>{review.name}</strong><small>{review.label}</small></div><span className="review-number" aria-hidden="true">0{index + 1}</span></div></article>)}</div>
      </div>
    </section>
  )
}
