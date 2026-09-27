const normalize = value => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
export function matchesCatalogSearch(product, query) {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  const searchable = normalize([product.name, product.brand, product.category, product.make, product.model].join(' '))
  return words.every(word => searchable.includes(word))
}
