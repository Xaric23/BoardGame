import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.tsx'

// Google OAuth Client ID - In production, this should be in environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1062538232786-ggbmujh9vfggvpqhb3bhcl8gnkn1uo02.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
