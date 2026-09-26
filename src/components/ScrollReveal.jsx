import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const targets = [
  '.departments-heading > *', '.department-viewport', '.departments-footnote',
  '.finder-intro', '.finder-form > *', '.benefit-strip > div',
  '.showcase-heading > *', '.showcase-window', '.section-heading > *',
  '.category-card', '.product-toolbar', '.filter-summary', '.product-card',
  '.empty-results', '.fitment-note', '.testimonials-heading > *',
  '.testimonial-card', '.story-panel > :not(.story-outline)', '.help-panel > *',
  '.closing-line > *', '.forge-footer-invitation > *', '.forge-footer-grid > *',
  '.forge-footer-bottom > *',
].join(', ')

export default function ScrollReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!('IntersectionObserver' in window)) return
    const tracked = new Set()
    const animations = new Map()
    let lastScrollY = window.scrollY
    let scrollingDown = true
    const trackDirection = () => {
      const nextY = window.scrollY
      if (Math.abs(nextY - lastScrollY) > 2) {
        scrollingDown = nextY > lastScrollY
        lastScrollY = nextY
      }
    }
    window.addEventListener('scroll', trackDirection, { passive: true })
    const reveal = (element, animate = true) => {
      if (!element.classList.contains('scroll-reveal-pending')) return
      element.classList.remove('scroll-reveal-pending')
      animations.get(element)?.cancel()
      if (!animate || preference.matches || !element.animate) return
      const siblings = Array.from(element.parentElement.children).filter(child => child.matches(targets))
      const animation = element.animate([
        { opacity: 0, transform: 'translate3d(0, 44px, 0) scale(.975)' },
        { opacity: .85, transform: 'translate3d(0, 8px, 0) scale(.995)', offset: .6 },
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
      ], { duration: 900, delay: Math.min(Math.max(siblings.indexOf(element), 0), 3) * 75, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' })
      animations.set(element, animation)
      animation.onfinish = () => animations.delete(element)
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const element = entry.target
        if (entry.isIntersecting) {
          reveal(element, scrollingDown && !element.contains(document.activeElement))
        } else if (entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? window.innerHeight)) {
          // Reset only after an item is fully below the viewport, ready for another downward pass.
          if (!preference.matches && !element.contains(document.activeElement)) {
            animations.get(element)?.cancel()
            animations.delete(element)
            element.classList.add('scroll-reveal-pending')
          }
        }
      })
    }, { threshold: 0 })
    const register = () => {
      for (const element of tracked) {
        if (!element.isConnected) {
          observer.unobserve(element)
          animations.get(element)?.cancel()
          animations.delete(element)
          tracked.delete(element)
        }
      }
      document.querySelectorAll(targets).forEach(element => {
        if (tracked.has(element)) return
        tracked.add(element)
        if (!preference.matches) element.classList.add('scroll-reveal-pending')
        observer.observe(element)
      })
    }
    const showFocused = event => {
      for (const element of tracked) {
        if (element.contains(event.target)) {
          reveal(element, false)
          animations.get(element)?.cancel()
          animations.delete(element)
        }
      }
    }
    const onPreference = () => {
      if (preference.matches) {
        tracked.forEach(element => reveal(element, false))
        animations.forEach(animation => animation.cancel())
        animations.clear()
      }
    }
    register()
    const mutations = new MutationObserver(register)
    mutations.observe(document.getElementById('root'), { childList: true, subtree: true })
    preference.addEventListener('change', onPreference)
    document.addEventListener('focusin', showFocused)
    return () => {
      observer.disconnect()
      mutations.disconnect()
      preference.removeEventListener('change', onPreference)
      document.removeEventListener('focusin', showFocused)
      window.removeEventListener('scroll', trackDirection)
      tracked.forEach(element => element.classList.remove('scroll-reveal-pending'))
      animations.forEach(animation => animation.cancel())
    }
  }, [pathname])
  return null
}
