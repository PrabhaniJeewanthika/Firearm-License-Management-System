import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="header-meta">
        <span className="gov-branch">පඬුවස්නුවර ප්‍රාදේශීය ලේකම් කාර්යාලය</span>
        <div className="security-badge">
          <span className="security-dot"></span>
          <span>Device-local & Secure ඩිජිටල් වාර්තා පද්ධතිය</span>
        </div>
      </div>
      <h1>ගිනිඅවි බලපත්‍ර දත්ත කළමනාකරණ පද්ධතිය</h1>
      <div className="header-subtitle">බලපත්‍ර දත්ත කළමනාකරණ අංශය</div>
      <p className="header-desc">
        බලපත්‍රලාභීන්ගේ තොරතුරු නිවැරදිව සටහන් කර, සොයා බලන්න සහ Excel වාර්තාවක් ලෙස ලබාගන්න.
      </p>
    </header>
  );
};

export default Header;
