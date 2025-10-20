import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

// Register a simple service worker for offline support (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}service-worker.js`
    navigator.serviceWorker.register(swUrl).then((reg) => {
      // eslint-disable-next-line no-console
      console.log('Service worker registered:', reg.scope)
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Service worker registration failed:', err)
    })
  })
}
