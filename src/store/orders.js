import { create } from 'zustand'
import { supabase } from '../lib/supabase'
export function orderFromRow(row){return {id:row.reference,databaseId:row.id,createdAt:row.created_at,total:Number(row.total_amount),status:row.status,seenAt:row.admin_seen_at,items:(row.order_items||[]).map(item=>({id:item.product_id,name:item.product_name,vehicle:item.vehicle_make+' '+item.vehicle_model,years:[item.year_from,item.year_to],quantity:item.quantity,price:Number(item.unit_price)}))}}
let refresh=null
export const useOrders=create((set,get)=>({
 orders:[],loading:false,error:'',busy:false,
 load:()=>{
  if(refresh)return refresh
  set({loading:true})
  refresh=(async()=>{try{const rows=[];for(let offset=0;;offset+=500){const {data,error}=await supabase.from('orders').select('*,order_items(*)').order('created_at',{ascending:false}).order('id').range(offset,offset+499);if(error)throw error;rows.push(...data);if(data.length<500)break}set({orders:rows.map(orderFromRow),error:''})}catch(error){set({error:error.message})}finally{set({loading:false});refresh=null}})();return refresh
 },
 addOrder:async(items,key)=>{const {data,error}=await supabase.rpc('place_order',{p_checkout_key:key,p_items:items.map(item=>({product_id:item.id,quantity:item.quantity}))});if(error)throw error;return orderFromRow(data)},
 markSeen:async()=>{const ids=get().orders.filter(o=>!o.seenAt).map(o=>o.databaseId);if(!ids.length)return;const now=new Date().toISOString();const {error}=await supabase.from('orders').update({admin_seen_at:now}).in('id',ids);if(error)throw error;set(state=>({orders:state.orders.map(o=>ids.includes(o.databaseId)?{...o,seenAt:now}:o)}))},
 updateStatus:async(reference,status)=>{if(get().busy)return;set({busy:true});try{const {error}=await supabase.from('orders').update({status}).eq('reference',reference).select('id').single();if(error)throw error;set(state=>({orders:state.orders.map(o=>o.id===reference?{...o,status}:o)}))}finally{set({busy:false})}},
 deleteOrder:async reference=>{if(get().busy)return;set({busy:true});try{const {error}=await supabase.from('orders').delete().eq('reference',reference).select('id').single();if(error)throw error;set(state=>({orders:state.orders.filter(o=>o.id!==reference)}))}finally{set({busy:false})}}
}))
