import { create } from 'zustand'
import { supabase } from '../lib/supabase'
const hydrate=row=>({id:row.id,name:row.customer_name,label:row.customer_description,title:row.title,quote:row.review_text,rating:row.rating,published:row.is_published})
let request=0
export const useReviews=create((set,get)=>({
 reviews:[],loading:true,error:'',busy:false,
 load:async()=>{const version=++request;set({loading:true,error:''});try{const rows=[];for(let offset=0;;offset+=500){const {data,error}=await supabase.from('reviews').select('*').order('created_at',{ascending:false}).order('id').range(offset,offset+499);if(error)throw error;rows.push(...data);if(data.length<500)break}if(version===request)set({reviews:rows.map(hydrate)})}catch(error){if(version===request)set({error:error.message})}finally{if(version===request)set({loading:false})}},
 saveReview:async review=>{
  if(get().busy)throw new Error('Please wait for the current request.')
  set({busy:true})
  try{const payload={customer_name:review.name.trim(),customer_description:review.label?.trim()||'',title:review.title.trim(),review_text:review.quote.trim(),rating:Number(review.rating),is_published:review.published??true};if(!payload.customer_name||!payload.title||!payload.review_text)throw new Error('Complete all required review fields.');const query=review.id?supabase.from('reviews').update(payload).eq('id',review.id):supabase.from('reviews').insert(payload);const {data,error}=await query.select().single();if(error)throw error;set(state=>({reviews:review.id?state.reviews.map(r=>r.id===data.id?hydrate(data):r):[hydrate(data),...state.reviews]}))}finally{set({busy:false})}
 },
 deleteReview:async id=>{if(get().busy)throw new Error('Please wait for the current request.');set({busy:true});try{const {error}=await supabase.from('reviews').delete().eq('id',id).select('id').single();if(error)throw error;set(state=>({reviews:state.reviews.filter(r=>r.id!==id)}))}finally{set({busy:false})}}
}))
