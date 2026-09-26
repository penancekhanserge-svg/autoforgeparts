import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCart = create(persist((set) => ({
  items: [],
  add: (id) => set((state) => ({
    items: state.items.some((item) => item.id === id)
      ? state.items.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...state.items, { id, quantity: 1 }],
  })),
  change: (id, delta) => set((state) => ({
    items: state.items.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0),
  })),
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}), { name: 'autoforge-cart' }))
