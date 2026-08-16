import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="loading-spinner">
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #1e3a8a',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        marginBottom: '12px'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span>{t('actions.saving')}</span>
    </div>
  );
};

export default LoadingSpinner;
