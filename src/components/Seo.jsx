import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useCatalog } from '../store/catalog'
import { useCollections } from '../store/collections'
import { categorySlug } from '../data/products'
import { salePrice } from '../lib/pricing'

const SITE_ORIGIN = 'https://autoforgeparts.com'
const SITE_NAME = 'AUTOFORGE PARTS'
const DEFAULT_IMAGE = SITE_ORIGIN + '/images/hero-car.jpg'
const DEFAULT_IMAGE_ALT = 'Silver sports car on a winding mountain road'
const FAQS = [
  ['How do I check if a part fits my vehicle?', 'Start with your make, model, and year. Before ordering, contact us with the product details and any relevant vehicle information so we can confirm compatibility.'],
  ['How do I complete my order?', 'Add your parts to the cart and select Place order. Use WhatsApp or SMS in the confirmation popup to send your order reference and item details to our team.'],
  ['Where do you deliver, and how much does it cost?', 'Contact us with your delivery location and order reference. Our team will confirm whether delivery is available, the cost, and the estimated timing before you proceed.'],
  ['Which payment methods can I use?', 'Our team will confirm the available payment options when you follow up on your order. Online payment is not currently available on this website.'],
  ['Can I return or exchange a part?', 'Please confirm return and exchange terms with our team before purchasing. If you have an issue with an order, contact us with your reference number and details so we can advise you on the next steps.'],
]

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function decodePathPart(value) {
  try { return decodeURIComponent(value) } catch { return value }
}

function absoluteUrl(path) {
  return SITE_ORIGIN + (path.startsWith('/') ? path : '/' + path)
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AutoPartsStore',
        '@id': SITE_ORIGIN + '/#business',
        name: SITE_NAME,
        url: SITE_ORIGIN,
        description: 'Automotive spare parts, replacement parts, vehicle components, and accessories from a supplier based in Phoenix, Arizona.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Phoenix',
          addressRegion: 'AZ',
          addressCountry: 'US',
        },
        areaServed: [
          { '@type': 'City', name: 'Phoenix' },
          { '@type': 'Country', name: 'United States' },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': SITE_ORIGIN + '/#website',
        name: SITE_NAME,
        url: SITE_ORIGIN,
        publisher: { '@id': SITE_ORIGIN + '/#business' },
        potentialAction: {
          '@type': 'SearchAction',
          target: SITE_ORIGIN + '/shop?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }
}

function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

function productSchema(product, path) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': absoluteUrl(path) + '#product',
    name: cleanText(product.name),
    url: absoluteUrl(path),
    brand: product.brand ? { '@type': 'Brand', name: cleanText(product.brand) } : undefined,
    image: product.photos?.map(photo => photo.url).filter(Boolean),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(path),
      priceCurrency: 'USD',
      price: String(salePrice(product)),
      availability: product.availability === 'sold-out' ? 'https://schema.org/OutOfStock' : product.availability === 'in-stock' ? 'https://schema.org/InStock' : undefined,
      seller: { '@type': 'Organization', name: SITE_NAME },
    },
  }
  if (product.description) schema.description = cleanText(product.description)
  if (product.sku) schema.sku = cleanText(product.sku)
  return schema
}

function productDescription(product) {
  const vehicle = cleanText([product.make, product.model].filter(Boolean).join(' '))
  const category = cleanText(product.category).toLowerCase()
  const fitment = vehicle ? ' for ' + vehicle : ''
  const categoryText = category ? category + ' ' : ''
  const years = product.years?.length ? ' covering ' + Math.min(...product.years) + '-' + Math.max(...product.years) : ''
  return ('Shop ' + cleanText(product.name) + ' from AUTOFORGE PARTS' + fitment + '. Review this ' + categoryText + 'replacement part, price, and ordering information' + years + '. Confirm exact fitment with our team before ordering.').replace(/\s+/g, ' ').trim()
}

function formatSlug(slug) {
  return decodePathPart(slug).replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
}

function buildSeo(pathname, products, categories, catalogReady) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const isAdmin = path === '/admin' || path.startsWith('/admin/') || path === '/login'
  if (isAdmin) return { title: 'Private area | AUTOFORGE PARTS', description: 'Private AutoForge Parts account area.', robots: 'noindex,nofollow', canonical: null, type: 'website', schemas: [] }

  if (path.startsWith('/product/')) {
    const id = decodePathPart(path.slice('/product/'.length))
    const product = products.find(item => item.id === id)
    if (!product && catalogReady) return { title: 'Product not found | AUTOFORGE PARTS', description: 'The requested AutoForge Parts product could not be found.', robots: 'noindex,follow', canonical: null, type: 'website', schemas: [] }
    if (!product) return { title: 'Auto Parts | AUTOFORGE PARTS', description: 'Explore automotive replacement parts from AUTOFORGE PARTS.', robots: 'index,follow', canonical: absoluteUrl(path), type: 'product', schemas: [] }
    const vehicle = cleanText([product.make, product.model].filter(Boolean).join(' '))
    const title = [cleanText(product.name), vehicle ? vehicle + ' Parts' : 'Auto Parts', SITE_NAME].join(' | ')
    return {
      title,
      description: productDescription(product),
      robots: 'index,follow',
      canonical: absoluteUrl(path),
      type: 'product',
      image: product.photos?.[0]?.url || DEFAULT_IMAGE,
      imageAlt: product.photos?.[0]?.alt || cleanText(product.name),
      schemas: [productSchema(product, path), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }, { name: cleanText(product.name), path }])],
    }
  }

  if (path.startsWith('/shop/')) {
    const slug = path.slice('/shop/'.length)
    const category = categories.find(item => categorySlug(item.name) === slug)
    const name = cleanText(category?.name || formatSlug(slug))
    const categoryPath = '/shop/' + (category ? categorySlug(category.name) : slug)
    return {
      title: name + ' Auto Parts | AUTOFORGE PARTS',
      description: 'Shop ' + name.toLowerCase() + ' and automotive replacement parts from AUTOFORGE PARTS. Browse vehicle fitment options and contact us to confirm details.',
      robots: 'index,follow',
      canonical: absoluteUrl(categoryPath),
      type: 'website',
      schemas: [breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }, { name, path: categoryPath }])],
    }
  }

  if (path === '/shop') return {
    title: 'Auto Parts Online | AUTOFORGE PARTS',
    description: 'Shop automotive replacement parts, vehicle components, and car accessories from AUTOFORGE PARTS in Phoenix, Arizona, with delivery beyond Phoenix.',
    robots: 'index,follow',
    canonical: absoluteUrl('/shop'),
    type: 'website',
    schemas: [breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop' }])],
  }

  if (path === '/about') return {
    title: 'About AUTOFORGE PARTS | Phoenix Auto Parts',
    description: 'Learn about AUTOFORGE PARTS, an automotive parts supplier based in Phoenix, Arizona, helping drivers find replacement parts and vehicle components.',
    robots: 'index,follow',
    canonical: absoluteUrl('/about'),
    type: 'website',
    schemas: [breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])],
  }

  if (path === '/privacy') return {
    title: 'Privacy Policy | AUTOFORGE PARTS',
    description: 'Read how AUTOFORGE PARTS handles contact details, browser storage, and external services on this website.',
    robots: 'index,follow',
    canonical: absoluteUrl('/privacy'),
    type: 'website',
    schemas: [breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy', path: '/privacy' }])],
  }

  if (path === '/') return {
    title: 'AUTOFORGE PARTS | Quality Auto Parts & Nationwide Delivery',
    description: 'AUTOFORGE PARTS is based in Phoenix, Arizona and supplies quality automotive parts, replacement components, and accessories with delivery beyond Phoenix.',
    robots: 'index,follow',
    canonical: SITE_ORIGIN + '/',
    type: 'website',
    image: DEFAULT_IMAGE,
    imageAlt: DEFAULT_IMAGE_ALT,
    schemas: [businessSchema(), faqSchema()],
  }

  return { title: 'Page not found | AUTOFORGE PARTS', description: 'The requested AutoForge Parts page could not be found.', robots: 'noindex,follow', canonical: null, type: 'website', schemas: [] }
}

function setMeta(kind, key, content) {
  const selector = 'meta[' + kind + '="' + key + '"]'
  let element = document.head.querySelector(selector)
  if (!content) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(kind, key)
    element.dataset.autoforgeSeo = 'true'
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!url) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    element.dataset.autoforgeSeo = 'true'
    document.head.appendChild(element)
  }
  element.href = url
}

function applySeo(seo) {
  document.title = seo.title
  setMeta('name', 'description', seo.description)
  setMeta('name', 'robots', seo.robots)
  setMeta('property', 'og:title', seo.title)
  setMeta('property', 'og:description', seo.description)
  setMeta('property', 'og:url', seo.canonical || '')
  setMeta('property', 'og:type', seo.type)
  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:image', seo.image || DEFAULT_IMAGE)
  setMeta('property', 'og:image:alt', seo.imageAlt || DEFAULT_IMAGE_ALT)
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', seo.title)
  setMeta('name', 'twitter:description', seo.description)
  setMeta('name', 'twitter:image', seo.image || DEFAULT_IMAGE)
  setMeta('name', 'twitter:image:alt', seo.imageAlt || DEFAULT_IMAGE_ALT)
  setCanonical(seo.canonical)
  document.head.querySelectorAll('script[data-autoforge-seo]').forEach(script => script.remove())
  seo.schemas.forEach((schema, index) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.autoforgeSeo = String(index)
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
  })
}

export default function SiteSeo() {
  const location = useLocation()
  const products = useCatalog(state => state.products).filter(product => product.status === 'active')
  const catalogReady = useCatalog(state => state.ready)
  const categories = useCollections(state => state.collections)
  const seo = useMemo(() => buildSeo(location.pathname, products, categories, catalogReady), [location.pathname, products, categories, catalogReady])
  useEffect(() => { applySeo(seo) }, [seo])
  return null
}

export { SITE_ORIGIN }