import NotificationMessage from '../../components/NotificationMessage'
import { useState } from 'react'
import { FiUser, FiLock, FiMail, FiMessageCircle } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import { useAdminSession } from '../../hooks/useAdminSession'

export function AdminProfile() {
 const {user,loading,error:sessionError}=useAdminSession()
 const [busy,setBusy]=useState(false)
 const [message,setMessage]=useState('')
 const [error,setError]=useState('')
 async function update(event,kind){
  event.preventDefault()
  if(busy)return
  const form=event.currentTarget, values=new FormData(form)
  setError('');setMessage('')
  const email=String(values.get('email')||'').trim()
  const password=String(values.get('password')||'')
  if(kind==='email'&&email.toLowerCase()===user.email.toLowerCase()){setError('Enter a different email address.');return}
  if(kind==='password'&&password.length<6){setError('Use at least 6 characters for your password.');return}
  if(kind==='password'&&password!==values.get('confirm')){setError('The passwords do not match.');return}
  setBusy(true)
  try {
   const {data,error}=await supabase.auth.updateUser(kind==='email'?{email}:{password})
   if(error)throw error
   setMessage(kind==='email'?(data.user.email===email?'Your email address has been updated.':'Email change requested. Check your current and new inboxes for confirmation instructions.'):'Your password has been updated.')
   form.reset()
  }catch(err){setError(err.message||'Unable to update your account. Please try again.')}
  finally{setBusy(false)}
 }
 if(loading)return <p role="status">Loading your account...</p>
 if(sessionError||!user)return <NotificationMessage message={sessionError||'Please sign in again to manage your profile.'} />
 return <div className="adm-account">
  <div className="adm-account-banner"><FiUser /><div><span className="adm-eyebrow">YOUR ADMIN ACCOUNT</span><h2>{user.email}</h2><p>Manage your sign-in details in one place.</p></div></div>
  {error&&<NotificationMessage message={error} />}{message&&<NotificationMessage message={message} type="success" />}
  <div className="adm-account-grid">
   <form className="adm-panel adm-account-card" onSubmit={event=>update(event,'email')}><FiMail /><h2>Email address</h2><p>Use an inbox you can access. Follow the confirmation instructions to complete your change.</p><label>New email address<input type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label><button className="adm-primary" disabled={busy}>{busy?'Please wait...':'Update email'}</button></form>
   <form className="adm-panel adm-account-card" onSubmit={event=>update(event,'password')}><FiLock /><h2>Change password</h2><p>Choose a unique password with at least 6 characters.</p><label>New password<input type="password" name="password" autoComplete="new-password" required minLength={6} maxLength={128} /></label><label>Confirm new password<input type="password" name="confirm" autoComplete="new-password" required minLength={6} maxLength={128} /></label><button className="adm-primary" disabled={busy}>{busy?'Please wait...':'Update password'}</button></form>
  </div>
 </div>
}

export function AdminSupport(){
 const [subject,setSubject]=useState('')
 const [details,setDetails]=useState('')
 function report(event){
  event.preventDefault()
  const text='AutoForge system issue\n\nSubject: '+subject.trim()+'\n\n'+details.trim()
  if(event.nativeEvent.submitter?.value==='whatsapp')window.open('https://wa.me/16025296403?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')
  else window.location.href='mailto:khanpenancesearch@gmail.com?subject='+encodeURIComponent('AutoForge: '+subject.trim())+'&body='+encodeURIComponent(text)
 }
 return <div className="adm-account-grid">
  <form className="adm-panel adm-account-card" onSubmit={report}><FiMessageCircle /><h2>Report a system issue</h2><p>Tell us what happened and the steps to reproduce it. Your report opens as a draft for you to send.</p><label>Issue summary<input required maxLength={120} value={subject} onChange={e=>setSubject(e.target.value)} placeholder="What went wrong?" /></label><label>Details<textarea required maxLength={1800} rows={6} value={details} onChange={e=>setDetails(e.target.value)} placeholder="Which page were you on? What did you expect to happen?" /></label><div className="adm-support-actions"><button className="adm-primary" name="channel" value="email"><FiMail /> Open email draft</button><button className="adm-secondary" name="channel" value="whatsapp"><FiMessageCircle /> Open WhatsApp</button></div></form>
 </div>
}
