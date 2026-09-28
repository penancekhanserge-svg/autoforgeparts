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
try { saved=JSON.parse(localStorage.getItem('autoforge-collections')||'[]') } catch { /* Use defaults. */ }
let all
try { all=JSON.parse(localStorage.getItem('autoforge-collections-v2')||'null') } catch { /* Use legacy data. */ }
export const useCollections=create((set,get)=>({
 collections:Array.isArray(all)?all:[...defaults,...(Array.isArray(saved)?saved:[])],
 saveCollection:(draft,original)=>{
  const name=draft.name.trim(),description=draft.description.trim()
  if(!name||!categorySlug(name))throw new Error('Enter a collection name.')
  if(get().collections.some(item=>item.name!==original&&categorySlug(item.name)===categorySlug(name)))throw new Error('That collection already exists.')
  const item={...draft,name,description}
  const next=original?get().collections.map(value=>value.name===original?item:value):[...get().collections,item]
  localStorage.setItem('autoforge-collections-v2',JSON.stringify(next));set({collections:next})
 },
 deleteCollection:name=>{const next=get().collections.filter(item=>item.name!==name);localStorage.setItem('autoforge-collections-v2',JSON.stringify(next));set({collections:next})}
}))
