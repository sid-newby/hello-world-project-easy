import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// UnoCSS imports
import 'virtual:uno.css' // Import the virtual module for Vite integration
import '@unocss/reset/tailwind.css' // Optional: Import Tailwind reset for consistency
import { AuthProvider } from './context/AuthProvider' // Import the AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
