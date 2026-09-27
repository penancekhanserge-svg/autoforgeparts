import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAdminSession } from '../../hooks/useAdminSession'
import './auth.css'
export default function ResetPassword(){
 const {loading,user,error:sessionError}=useAdminSession()
 const [error,setError]=useState(''),[busy,setBusy]=useState(false),[complete,setComplete]=useState(false)
 async function submit(event){
  event.preventDefault();const form=new FormData(event.currentTarget);const password=String(form.get('password'))
  if(password!==form.get('confirm')){setError('Passwords do not match.');return}
  setBusy(true);setError('')
  try{const {error}=await supabase.auth.updateUser({password});if(error)throw error;setComplete(true);await supabase.auth.signOut({scope:'local'})}catch(err){setError(err.message)}finally{setBusy(false)}
 }
 return <main className="merchant-auth"><section className="merchant-auth-form-panel reset-password-panel"><span className="merchant-auth-kicker">ACCOUNT RECOVERY</span><h2>Set a new password.</h2>{complete?<div role="status"><p className="merchant-auth-intro">Your password has been updated.</p><Link className="merchant-auth-submit" to="/admin/login">Return to login</Link></div>:loading?<p role="status">Checking your recovery link...</p>:!user||sessionError?<><p className="auth-error">This link is invalid or expired, or your session could not be verified.</p><Link to="/admin/forgot-password">Request a new reset link</Link></>:<form onSubmit={submit}><p className="merchant-auth-intro">Choose a unique password with at least 12 characters.</p><label htmlFor="new-password">New password</label><div className="merchant-auth-input"><input id="new-password" name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></div><label htmlFor="confirm-password">Confirm password</label><div className="merchant-auth-input"><input id="confirm-password" name="confirm" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></div>{error&&<p className="auth-error" role="alert">{error}</p>}<button disabled={busy} className="merchant-auth-submit">{busy?'Updating...':'Save new password'}</button></form>}</section></main>
}
