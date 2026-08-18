import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      <div className="login-card">
        <div className="login-header">
          <img src="/police_logo.png" alt="Police Logo" className="login-logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <h2>{t('login.title') || 'Sri Lanka Police'}</h2>
          <p>{t('login.subtitle') || 'Firearm License Management System'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">{t('login.username') || 'Username'}</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              placeholder={t('login.usernamePlaceholder') || 'Enter username'}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('login.password') || 'Password'}</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder={t('login.passwordPlaceholder') || 'Enter password'}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={isLoading || !username || !password}
          >
            {isLoading ? (t('actions.saving') || 'Loading...') : (t('login.loginBtn') || 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
