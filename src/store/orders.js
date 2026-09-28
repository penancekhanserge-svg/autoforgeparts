import { create } from 'zustand'
let initial=[]
try { initial=JSON.parse(localStorage.getItem('autoforge-orders')||'[]');if(!Array.isArray(initial))initial=[];const old=JSON.parse(localStorage.getItem('autoforge-order-request')||'null');if(old?.id&&!localStorage.getItem('autoforge-orders')&&!initial.some(item=>item.id===old.id))initial.push(old) } catch { /* Start with an empty list. */ }
export const useOrders=create((set,get)=>({
 orders:initial,
 addOrder:order=>{const next=[order,...get().orders.filter(item=>item.id!==order.id)];localStorage.setItem('autoforge-orders',JSON.stringify(next));set({orders:next})},
 deleteOrder:id=>{const next=get().orders.filter(item=>item.id!==id);localStorage.setItem('autoforge-orders',JSON.stringify(next));set({orders:next})},
}))
