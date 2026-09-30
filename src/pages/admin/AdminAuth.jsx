import { toast } from 'react-toastify'
import NotificationMessage from '../../components/NotificationMessage'
import { supabase } from '../../lib/supabase'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiArrowUpRight, FiEye, FiEyeOff, FiMail, FiLock, FiGrid, FiImage, FiPackage, FiKey } from 'react-icons/fi'
import './auth.css'

export default function AdminAuth({ recovery=false }) {
 const navigate=useNavigate()
 const [visible,setVisible]=useState(false)
 const [submitted,setSubmitted]=useState(false)
 const [email,setEmail]=useState('')
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 async function submit(event){
  event.preventDefault();setError('');setBusy(true)
  const password = new FormData(event.currentTarget).get('password')
  try {
   if(recovery){
    const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+'/admin/reset-password'})
    if(error)throw error
    setSubmitted(true)
   }else{
    const {data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password})
    if(error)throw error
    if(data.user?.app_metadata?.role!=='admin'){await supabase.auth.signOut({scope:'local'});throw new Error('This account does not have admin access.')}
    toast.success('Welcome back. You are signed in.');navigate('/admin',{replace:true})
   }
  }catch(err){setError(err.message||'Unable to connect. Please try again.')}finally{setBusy(false)}
 }
 return <main className="merchant-auth"><header className="merchant-auth-top"><Link to="/" className="merchant-auth-brand">AUTO<span>FORGE</span><small>MERCHANT WORKSPACE</small></Link><Link to="/"><FiArrowLeft /> Back to store</Link></header>
 <div className="merchant-auth-card"><aside className="merchant-auth-story"><span className="merchant-auth-kicker">THE WORK BEHIND EVERY GREAT DRIVE</span><div className="merchant-auth-story-copy"><span className="merchant-auth-rule" /><h1>Your vision.<br />Your collection.<br /><em>Your next chapter.</em></h1><p>A considered space to shape your store, bring your products to life, and keep every detail in order.</p></div><div className="merchant-auth-features"><span><FiPackage /> Curate your catalog</span><span><FiImage /> Tell the story in pictures</span><span><FiGrid /> Keep everything connected</span></div><div className="merchant-auth-story-bottom"><span>AUTOFORGE / STORE STUDIO</span><span>01 ? BUILT FOR POSSIBILITY</span></div></aside>
 <section className="merchant-auth-form-panel" aria-labelledby="auth-title"><div className="merchant-auth-emblem">{recovery?<FiKey />:<FiLock />}</div><span className="merchant-auth-kicker">{recovery?'ACCOUNT RECOVERY':'WELCOME TO YOUR WORKSPACE'}</span><h2 id="auth-title">{recovery?'A fresh start.':'Good to see you.'}</h2><p className="merchant-auth-intro">{recovery?'Forgot your password? Start here to get back to your workspace.':'Your next store update starts here. Step inside and make it yours.'}</p>
 {submitted ? <div className="merchant-recovery-result" role="status"><NotificationMessage type="success" message="If an account exists for this address, you will receive a password reset link. Check your spam folder too." /><FiMail /><h3>Check your inbox.</h3><Link className="merchant-auth-submit" to="/admin/login" state={{ adminLoginEntry: true }}>Back to login <FiArrowUpRight /></Link><button className="merchant-auth-text" onClick={()=>setSubmitted(false)}>Use another email</button></div> : <form onSubmit={submit} >
 <label htmlFor="merchant-email">Email address</label><div className="merchant-auth-input"><FiMail aria-hidden="true" /><input id="merchant-email" name="email" type="email" autoComplete="username" value={email} onChange={event=>setEmail(event.target.value)} required maxLength={254} placeholder="you@example.com" /></div>
 {!recovery&&<><div className="merchant-auth-password-label"><label htmlFor="merchant-password">Password</label><Link to="/admin/forgot-password">Forgot password?</Link></div><div className="merchant-auth-input"><FiLock aria-hidden="true" /><input id="merchant-password" name="password" required type={visible?'text':'password'} autoComplete="current-password" placeholder="Enter your password" maxLength={256} /><button type="button" aria-label={visible?'Hide password':'Show password'} aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible?<FiEyeOff />:<FiEye />}</button></div></>}
 <button disabled={busy} type="submit" className="merchant-auth-submit">{busy?'Please wait...':recovery?'Send reset link':'Sign in to dashboard'} <FiArrowUpRight /></button><p className="merchant-auth-demo">{recovery?'Use the email address associated with your account.':'Access is restricted to authorized administrators.'}</p>
 {error&&<NotificationMessage message={error} />}
 </form>}
 <div className="merchant-auth-footer">{recovery?<Link to="/admin/login" state={{ adminLoginEntry: true }}><FiArrowLeft /> Back to login</Link>:<><span>Need a hand?</span><a href="https://wa.me/16025296403?text=Hello%20AutoForge!%20I%20need%20help%20with%20the%20admin%20workspace." target="_blank" rel="noopener noreferrer">Contact support <FiArrowUpRight /></a></>}</div>
 </section></div><footer className="merchant-auth-bottom"><span>AutoForge Parts ? A better drive starts here.</span><Link to="/privacy">Privacy</Link></footer>
 </main>
}
