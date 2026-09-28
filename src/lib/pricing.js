export function discountPercent(product) { const value = Number(product.discountPercent || 0); return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0 }
export function salePrice(product) { return Math.round(product.price * (100 - discountPercent(product))) / 100 }
