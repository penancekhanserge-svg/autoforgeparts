import { create } from 'zustand'
import { supabase } from '../lib/supabase'
const bucket='product-images'
const selection='*, collection:collections(name), make:vehicle_makes!products_make_id_fkey(name), model:vehicle_models!products_model_matches_make(name)'
function hydrate(row){
 const make=row.make?.name||'',model=row.model?.name||''
 return {...row,make,model,category:row.collection?.name||'',price:Number(row.price),discountPercent:Number(row.discount_percent),status:'active',brand:'AUTOFORGE',sku:'',type:'battery',stock:row.availability==='sold-out'?0:99,fit:[make+' '+model],years:Array.from({length:row.year_to-row.year_from+1},(_,i)=>row.year_from+i),photos:row.image_path?[{url:supabase.storage.from(bucket).getPublicUrl(row.image_path).data.publicUrl,alt:row.image_alt}]:[],description:'',specifications:'',warranty:''}
}
let loading
export const useCatalog=create((set,get)=>({
 products:[],ready:false,error:'',saving:false,
 load:()=>{
  if(loading)return loading
  loading=(async()=>{try{
   const rows=[]
   for(let offset=0;;offset+=1000){const {data,error}=await supabase.from('products').select(selection).order('created_at',{ascending:false}).order('id').range(offset,offset+999);if(error)throw error;rows.push(...data);if(data.length<1000)break}
   set({products:rows.map(hydrate),ready:true,error:''})
  }catch(error){set({ready:true,error:error.message||'Unable to load products.'})}finally{loading=null}})()
  return loading
 },
 saveProduct:async draft=>{
  if(get().saving)throw new Error('Please wait for the current request.')
  set({saving:true});let uploaded=null
  try{
   const name=draft.name.trim(),price=Number(draft.price),discount=Number(draft.discountPercent||0),from=Number(draft.yearFrom),to=Number(draft.yearTo)
   if(!name||draft.price===''||!Number.isFinite(price)||price<0||price>1000000)throw new Error('Enter a product name and valid price.')
   if(!Number.isFinite(discount)||discount<0||discount>100)throw new Error('Discount must be between 0 and 100%.')
   if(!Number.isInteger(from)||!Number.isInteger(to)||from<1900||to>2100||to<from)throw new Error('Choose a valid year range.')
   const lookups=await Promise.all([supabase.from('collections').select('id').eq('name',draft.category).single(),supabase.from('vehicle_makes').select('id').eq('name',draft.make).single()])
   for(const result of lookups)if(result.error)throw result.error
   const collectionId=lookups[0].data.id,makeId=lookups[1].data.id
   const modelResult=await supabase.from('vehicle_models').select('id').eq('make_id',makeId).eq('name',draft.model).single()
   if(modelResult.error)throw modelResult.error
   const existing=get().products.find(p=>p.id===draft.id),id=existing?.id||crypto.randomUUID()
   const photo=draft.photos?.[0];let path=photo?existing?.image_path||null:null
   if(photo?.url?.startsWith('data:')){
    const blob=await(await fetch(photo.url)).blob(),ext={'image/webp':'webp','image/jpeg':'jpg','image/png':'png'}[blob.type]
    if(!ext||blob.size>1000000)throw new Error('Choose a JPG, PNG or WebP image under 1 MB.')
    path=id+'/'+crypto.randomUUID()+'.'+ext
    const {error}=await supabase.storage.from(bucket).upload(path,blob,{contentType:blob.type})
    if(error)throw error;uploaded=path
   }
   const payload={name,collection_id:collectionId,make_id:makeId,model_id:modelResult.data.id,year_from:from,year_to:to,price,discount_percent:discount,availability:draft.availability||'unspecified',image_path:path,image_alt:photo?.alt||''}
   const query=existing?supabase.from('products').update(payload).eq('id',id):supabase.from('products').insert({...payload,id})
   const {data,error}=await query.select(selection).single();if(error)throw error
   const product=hydrate(data)
   set(state=>({products:existing?state.products.map(p=>p.id===id?product:p):[product,...state.products]}));uploaded=null
   if(existing?.image_path&&existing.image_path!==path)await supabase.storage.from(bucket).remove([existing.image_path])
   return product
  }catch(error){if(uploaded)await supabase.storage.from(bucket).remove([uploaded]);throw error}finally{set({saving:false})}
 },
 deleteProduct:async id=>{
  if(get().saving)throw new Error('Please wait for the current request.')
  set({saving:true})
  try{const product=get().products.find(p=>p.id===id);const {error}=await supabase.from('products').delete().eq('id',id).select('id').single();if(error)throw error;set(state=>({products:state.products.filter(p=>p.id!==id)}));if(product?.image_path)await supabase.storage.from(bucket).remove([product.image_path])}finally{set({saving:false})}
 }
}))
