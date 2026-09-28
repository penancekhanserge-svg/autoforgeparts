import { create } from 'zustand'
import { categorySlug } from '../data/products'
const defaults = [
  { name: 'Brakes', type: 'brake', description: 'Confidence at every stop' },
  { name: 'Engine', type: 'filter', description: 'Keep the heart running' },
  { name: 'Suspension', type: 'shock', description: 'A smoother road ahead' },
  { name: 'Lighting', type: 'light', description: 'See more. Go further.' },
  { name: 'Tyres & wheels', type: 'tyre', description: 'Made to go the distance' },
  { name: 'Accessories', type: 'battery', description: 'The finishing touches' },
]
let saved=[]
try { saved=JSON.parse(localStorage.getItem('autoforge-collections')||'[]') } catch { /* Keep built-in collections available. */ }
export const useCollections=create((set,get)=>({
 collections:[...defaults,...(Array.isArray(saved)?saved:[])],
 addCollection:({name,description,type})=>{
  name=name.trim(); description=description.trim()
  if(!name || !categorySlug(name))throw new Error('Enter a collection name.')
  if(get().collections.some(item=>categorySlug(item.name)===categorySlug(name)))throw new Error('That collection already exists.')
  const next=[...get().collections,{name,description,type}]
  localStorage.setItem('autoforge-collections',JSON.stringify(next.slice(defaults.length)))
  set({collections:next})
 }
}))
