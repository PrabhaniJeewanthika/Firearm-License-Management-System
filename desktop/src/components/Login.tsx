import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { User, Lock, LogIn } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error(t('login.errorEmpty') || 'Please enter username and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/token/', {
        username,
        password,
      });
      
      login(response.data.access, response.data.refresh);
      toast.success(t('login.success') || 'Login successful!');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(t('login.errorInvalid') || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <div className="language-selector">
          <button 
            className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${i18n.language === 'si' ? 'active' : ''}`}
            onClick={() => changeLanguage('si')}
          >
            සිං
          </button>
          <button 
            className={`lang-btn ${i18n.language === 'ta' ? 'active' : ''}`}
            onClick={() => changeLanguage('ta')}
          >
            தமிழ்
          </button>
        </div>
      </div>
      <div className="login-card">
        <div className="login-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Emblem_of_Sri_Lanka.svg" 
            alt="Sri Lanka State Emblem" 
            style={{ width: '80px', marginBottom: '15px' }} 
          />
          <h2 style={{fontSize: '22px', textAlign: 'center'}}>{t('header.secretariat') || 'Panduwasnuwara Divisional Secretariat'}</h2>
          <p style={{ textAlign: 'center' }}>{t('header.title') || 'Firearm License Data Management System'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">{t('login.username') || 'Username'}</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="username"
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                placeholder={t('login.usernamePlaceholder') || 'Enter username'}
                autoComplete="username"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('login.password') || 'Password'}</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder={t('login.passwordPlaceholder') || 'Enter password'}
                autoComplete="current-password"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={isLoading || !username || !password}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>{t('settings.authenticating') || 'Authenticating...'}</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>{t('login.loginBtn') || 'Login'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
