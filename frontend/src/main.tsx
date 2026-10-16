import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// a hello for whoever opens the console
console.log('%chey, you found the console', 'font: 500 16px "DM Sans", system-ui; color: #1e1a15;')
console.log('%cthis site: React + Vite + hand-written CSS, built late at night, fuelled by matcha', 'font: 400 13px "DM Mono", monospace; color: #5a5248;')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
