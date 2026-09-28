import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Notifications() {
 const [host] = useState(() => { const element=document.createElement('div'); element.className='notification-host'; return element })
 useEffect(() => {
  function place() {
   const dialogs = [...document.querySelectorAll('dialog[open]')]
   const target = dialogs.at(-1) || document.body
   if(host.parentNode !== target) target.appendChild(host)
  }
  place()
  const observer = new MutationObserver(place)
  observer.observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:['open'] })
  function invalid(event) {
   event.preventDefault()
   const field=event.target
   const label=field.labels?.[0]?.textContent?.trim() || field.getAttribute('aria-label') || 'This field'
   toast.error(label + ': ' + field.validationMessage, {toastId:'form-validation'})
   if(!document.activeElement?.matches(':invalid')) field.focus()
  }
  document.addEventListener('invalid',invalid,true)
  return () => { observer.disconnect(); document.removeEventListener('invalid',invalid,true);host.remove() }
 },[host])
 return createPortal(<ToastContainer position="top-right" autoClose={5000} limit={3} newestOnTop closeOnClick pauseOnHover pauseOnFocusLoss theme="light" />,host)
}
