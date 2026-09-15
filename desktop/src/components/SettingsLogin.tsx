import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, User, LogIn } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './SettingsLogin.css';

const SettingsLogin: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/token/`, {
        username,
        password
      });

      if (response.data.access && response.data.refresh) {
        login(response.data.access, response.data.refresh);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(t('settings.loginError') || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-login-container">
      <div className="settings-login-card">
        <div className="settings-login-header">
          <div className="icon-circle">
            <Shield size={32} color="#0284c7" />
          </div>
          <h2>{t('settings.loginTitle') || 'Admin Authentication'}</h2>
          <p>{t('settings.loginSubtitle') || 'Please enter credentials to access settings.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="settings-login-form">
          {error && <div className="error-alert">{error}</div>}
          
          <div className="form-group">
            <label>
              <User size={16} />
              <span>{t('settings.username') || 'Username'}</span>
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder={t('settings.usernamePlaceholder') || 'Enter username'}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={16} />
              <span>{t('settings.password') || 'Password'}</span>
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder={t('settings.passwordPlaceholder') || 'Enter password'}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            <LogIn size={18} />
            {loading ? (t('settings.authenticating') || 'Authenticating...') : (t('settings.loginBtn') || 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsLogin;
