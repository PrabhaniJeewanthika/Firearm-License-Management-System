import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('app_lang', lng);
  };

  return (
    <header className="main-header">
      <div className="header-meta" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', zIndex: 10, gap: '15px' }}>
        
        {/* Language Switcher */}
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

        {/* Logout Button */}
        <button 
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; }}
          title="Logout"
        >
          <LogOut size={16} />
          {i18n.language === 'si' ? 'ඉවත් වන්න' : i18n.language === 'ta' ? 'வெளியேறு' : 'Logout'}
        </button>
      </div>
      
      <h1>{t('header.secretariat')}</h1>
      <div className="header-subtitle">{t('header.title')}</div>
      <p className="header-desc">
        {t('header.description')}
      </p>
    </header>
  );
};

export default Header;
