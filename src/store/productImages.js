import { create } from 'zustand'
export const useProductImages = create((set) => ({ images: {}, load: async () => {
 try { const response = await fetch('/api/product-images'); if (response.ok) set({ images: await response.json() }) } catch { /* Keep illustrations when the API is unavailable. */ }
} }))
