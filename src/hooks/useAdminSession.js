import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
export function useAdminSession() {
 const [state,setState]=useState({loading:true,user:null,error:''})
 useEffect(()=>{
  let active=true, version=0
  async function verify(){
   const current=++version
   try { const {data,error}=await supabase.auth.getUser(); if(active&&current===version)setState({loading:false,user:error?null:data.user,error:error&&error.name!=='AuthSessionMissingError'?error.message:''}) }
   catch { if(active&&current===version)setState({loading:false,user:null,error:'Unable to verify your session. Check your connection and reload.'}) }
  }
  function recheck() { if(document.visibilityState==='visible')void verify() }
  window.addEventListener('focus',recheck)
  window.addEventListener('pageshow',recheck)
  document.addEventListener('visibilitychange',recheck)
  void verify()
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event)=>{
   if(event==='SIGNED_OUT'){version++;setState({loading:false,user:null,error:''})}
   else setTimeout(()=>{if(active)void verify()},0)
  })
  return ()=>{active=false;version++;subscription.unsubscribe();window.removeEventListener('focus',recheck);window.removeEventListener('pageshow',recheck);document.removeEventListener('visibilitychange',recheck)}
 },[])
 return state
}
