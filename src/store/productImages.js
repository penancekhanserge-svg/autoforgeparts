import { create } from 'zustand'
// Frontend demo only: photos stay in memory, with no server requests or authentication.
export const useProductImages = create(set => ({
 images: {},
 setImage: (id, image) => set(state => ({ images: { ...state.images, [id]: image } })),
 removeImage: id => set(state => { const images = { ...state.images }; delete images[id]; return { images } }),
}))
