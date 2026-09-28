import { vehicles } from '../data/products.js'
export const departmentTypes = { Brakes: 'brake', Engine: 'filter', Suspension: 'shock', Lighting: 'light', 'Tyres & wheels': 'tyre', Accessories: 'battery' }
export function newProduct() {
 return { id: '', name: '', brand: '', category: 'Brakes', sku: '', price: '', discountPercent: 0, stock: 0, status: 'draft', description: '', specifications: '', warranty: '', make: 'Ford', model: 'F-150', yearFrom: 2000, yearTo: 2026, tag: '', photos: [] }
}
export function editProduct(product) {
 return { ...newProduct(), ...product, yearFrom: Math.min(...product.years), yearTo: Math.max(...product.years), photos: product.photos || [] }
}
export function normalizeProduct(draft, existing) {
 const name = draft.name.trim(), brand = draft.brand.trim(), sku = draft.sku.trim()
 if (!name || !brand || !sku) throw new Error('Product name, brand, and SKU are required.')
 if (existing.some(item => item.id !== draft.id && item.sku?.toLowerCase() === sku.toLowerCase())) throw new Error('That SKU already belongs to another product.')
 const price = Number(draft.price), stock = Number(draft.stock), from = Number(draft.yearFrom), to = Number(draft.yearTo)
 if (draft.price === '' || !Number.isFinite(price) || price < 0 || price > 1000000) throw new Error('Enter a valid price between $0 and $1,000,000.')
 if (!Number.isInteger(stock) || stock < 0 || stock > 1000000) throw new Error('Stock must be a whole number from 0 to 1,000,000.')
 if (!Number.isInteger(from) || !Number.isInteger(to) || from < 2000 || to > 2026 || from > to) throw new Error('Choose a valid year range between 2000 and 2026.')
 if (!vehicles[draft.make]?.includes(draft.model)) throw new Error('Choose a valid vehicle make and model.')
 if (!departmentTypes[draft.category] || !['active','draft'].includes(draft.status)) throw new Error('Choose a valid category and publication status.')
 if (draft.photos.length > 4) throw new Error('Use up to four photos per product.')
 const discountPercent = Number(draft.discountPercent || 0)
 if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) throw new Error('Discount must be between 0 and 100%.')
 const rest = { ...draft }; delete rest.yearFrom; delete rest.yearTo
 return { ...rest, id: draft.id || crypto.randomUUID(), name, brand, sku, discountPercent, price: Math.round(price * 100) / 100, stock, type: departmentTypes[draft.category], fit: [draft.make + ' ' + draft.model], years: Array.from({length:to-from+1},(_,i)=>from+i), updatedAt: new Date().toISOString() }
}
