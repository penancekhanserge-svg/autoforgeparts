import { useEffect } from 'react'
import { toast } from 'react-toastify'

// Bridges asynchronous screen states to notifications without firing during render.
export default function NotificationMessage({ message, type='error' }) {
 useEffect(() => {
  if(message) toast[type](message, {toastId:type + ':' + message})
 },[message,type])
 return null
}
