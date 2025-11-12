import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types/game';
import './LoginScreen.css';

// Decode JWT to get user info
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [showUsernameLogin, setShowUsernameLogin] = useState(false);

  const handleUsernameLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const user: User = {
        id: `user_${Date.now()}`,
        name: username.trim(),
        loginMethod: 'username',
        loginTime: Date.now(),
      };
      login(user);
    }
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = parseJwt(credentialResponse.credential);
      if (decoded) {
        const user: User = {
          id: decoded.sub,
          name: decoded.name || decoded.email,
          email: decoded.email,
          loginMethod: 'google',
          loginTime: Date.now(),
        };
        login(user);
      }
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <h1>⚔️ Dungeon Delvers ⚔️</h1>
        <h2>Login to Begin Your Adventure</h2>

        <div className="login-methods">
          {!showUsernameLogin ? (
            <>
              <div className="login-section">
                <h3>Sign in with Google</h3>
                <div className="google-login-wrapper">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    theme="filled_black"
                  />
                </div>
              </div>

              <div className="divider">
                <span>OR</span>
              </div>

              <div className="login-section">
                <button
                  className="username-button"
                  onClick={() => setShowUsernameLogin(true)}
                >
                  Continue with Username
                </button>
              </div>
            </>
          ) : (
            <div className="login-section">
              <h3>Enter Your Name</h3>
              <form onSubmit={handleUsernameLogin}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="username-input"
                  autoFocus
                  maxLength={30}
                />
                <div className="button-group">
                  <button type="submit" className="login-button" disabled={!username.trim()}>
                    Continue
                  </button>
                  <button
                    type="button"
                    className="back-button"
                    onClick={() => setShowUsernameLogin(false)}
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="login-info">
          <p>Sign in to save your progress and compete on leaderboards</p>
        </div>
      </div>
    </div>
  );
};
