import { create } from 'zustand'
import { products as sampleProducts } from '../data/products'
import { readCatalog, writeCatalog } from '../lib/catalogRepository'
import { normalizeProduct } from '../lib/productModel'
const initial = sampleProducts.map((product,index) => ({ ...product, sku: 'AF-' + String(index + 1).padStart(5,'0'), stock: 10, status: 'active', description: '', specifications: '', warranty: '', photos: [] }))
let loading
export const useCatalog = create((set,get) => ({
 products: initial, ready: false, error: '', saving: false,
 load: () => {
  if (!loading) loading = readCatalog().then(saved => set({ products: saved || initial, ready: true, error: '' })).catch(error => set({ ready: true, error: error.message }))
  return loading
 },
 saveProduct: async draft => {
  if (get().saving) throw new Error('Please wait for the current save to finish.')
  if (!get().ready || get().error) throw new Error('Catalog storage is not ready. Reload before editing.')
  const product = normalizeProduct(draft, get().products)
  set({ saving: true })
  try {
   const exists = get().products.some(item => item.id === product.id)
   const next = exists ? get().products.map(item => item.id === product.id ? product : item) : [product, ...get().products]
   await writeCatalog(next); set({ products: next }); return product
  } finally { set({ saving: false }) }
 },
 deleteProduct: async id => {
  if (get().saving || !get().ready || get().error) throw new Error('Catalog storage is not ready for changes.')
  set({ saving: true })
  try { const next = get().products.filter(item => item.id !== id); await writeCatalog(next); set({ products: next }) } finally { set({ saving:false }) }
 },
}))
