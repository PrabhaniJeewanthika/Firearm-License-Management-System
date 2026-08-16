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
        <div className="language-switcher" style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => changeLanguage('si')}
            className={`btn ${i18n.language === 'si' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '12px' }}
          >
            සිංහල
          </button>
          <button 
            onClick={() => changeLanguage('ta')}
            className={`btn ${i18n.language === 'ta' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '12px' }}
          >
            தமிழ்
          </button>
          <button 
            onClick={() => changeLanguage('en')}
            className={`btn ${i18n.language === 'en' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '12px' }}
          >
            English
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
