import React from 'react';

const LoadingSpinner: React.FC = () => {
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
      <span>දත්ත ලබා ගනිමින් පවතී...</span>
    </div>
  );
};

export default LoadingSpinner;
