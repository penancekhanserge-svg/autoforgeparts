import emailjs from '@emailjs/browser'

export function sendContactEmail(templateParams) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    return Promise.reject(new Error('Add your EmailJS settings to .env.local before sending email.'))
  }

  return emailjs.send(serviceId, templateId, templateParams, { publicKey })
}
