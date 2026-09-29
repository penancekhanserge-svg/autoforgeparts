import { create } from 'zustand'
import { categorySlug } from '../data/products'
import { supabase } from '../lib/supabase'
const bucket = 'collection-images'
const hydrate = row => ({ ...row, image: row.image_path ? supabase.storage.from(bucket).getPublicUrl(row.image_path).data.publicUrl : '' })
export const useCollections = create((set,get) => ({
 collections: [], loading: false, error: '',
 loadCollections: async () => {
  if(get().loading)return
  set({loading:true,error:''})
  try {
   const {data,error}=await supabase.from('collections').select('*').order('created_at')
   if(error)throw error
   set({collections:data.map(hydrate)})
  } catch(error) { set({error:error.message || 'Unable to load collections.'}) }
  finally {set({loading:false})}
 },
 saveCollection: async (draft,original) => {
  const name=draft.name.trim(), slug=categorySlug(name)
  if(!name||!slug)throw new Error('Enter a collection name.')
  const existing=get().collections.find(item=>item.name===original)
  const collectionId=existing?.id || crypto.randomUUID()
  let path=draft.image ? existing?.image_path || null : null
  let uploaded=null
  try {
   if(draft.image?.startsWith('data:')) {
    const blob=await (await fetch(draft.image)).blob()
    if(blob.size>1000000)throw new Error('Image must be 1 MB or smaller.')
    const extension={'image/webp':'webp','image/png':'png','image/jpeg':'jpg'}[blob.type]
    if(!extension)throw new Error('Choose a JPEG, PNG, or WebP image.')
    path=collectionId+'/'+crypto.randomUUID()+'.'+extension
    const {error}=await supabase.storage.from(bucket).upload(path,blob,{contentType:blob.type,upsert:false})
    if(error)throw error
    uploaded=path
   }
   const payload={name,slug,description:draft.description.trim(),image_path:path}
   const query=existing ? supabase.from('collections').update(payload).eq('id',existing.id) : supabase.from('collections').insert({...payload,id:collectionId})
   const {data,error}=await query.select().single()
   if(error)throw error
   set(state=>({collections:existing ? state.collections.map(item=>item.id===existing.id?hydrate(data):item) : [...state.collections,hydrate(data)]}))
  } catch(error) {
   if(uploaded)await supabase.storage.from(bucket).remove([uploaded])
   throw new Error(error.code==='23505'?'That collection already exists.':error.message || 'Unable to save collection.', {cause:error})
  }
  if(existing?.image_path && existing.image_path!==path) {
   const {error}=await supabase.storage.from(bucket).remove([existing.image_path])
   if(error)return 'Collection saved, but the old image could not be removed.'
  }
 },
 deleteCollection: async name => {
  const item=get().collections.find(value=>value.name===name)
  if(!item)throw new Error('Collection no longer exists. Refresh and try again.')
  const {data,error}=await supabase.from('collections').delete().eq('id',item.id).select('id').single()
  if(error){if(error.code==='23503')throw new Error('This collection has linked records in the database. Move those records before deleting it.',{cause:error});throw error}
  set(state=>({collections:state.collections.filter(value=>value.id!==data.id)}))
  if(item.image_path){const {error}=await supabase.storage.from(bucket).remove([item.image_path]);if(error)return 'Collection deleted, but its image could not be removed.'}
 }
}))
