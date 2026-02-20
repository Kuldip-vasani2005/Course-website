import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StripeBlockBanner from './components/StripeBlockBanner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StripeBlockBanner />
    <App />
  </StrictMode>,
)
