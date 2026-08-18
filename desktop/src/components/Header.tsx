import React from 'react';
import { useTranslation } from 'react-i18next';
const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="main-header">
      <div className="header-meta" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        
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
