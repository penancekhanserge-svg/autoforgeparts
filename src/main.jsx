import { useCollections } from './store/collections'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Notifications from './components/Notifications'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient()
useCollections.getState().loadCollections()
window.addEventListener('focus', () => useCollections.getState().loadCollections())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Notifications />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
