import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.tsx'

// Handle 404 redirect from GitHub Pages
const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');
if (redirect) {
  // Remove the redirect parameter and restore the original URL
  // The redirect parameter contains the full path from 404.html
  const newUrl = window.location.origin + redirect;
  window.history.replaceState(null, '', newUrl);
}

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
