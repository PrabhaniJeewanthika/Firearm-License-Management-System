import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="header-meta">
        <span className="gov-branch">ශ්‍රී ලංකා ජනරජය | Republic of Sri Lanka</span>
        <div className="security-badge">
          <span className="security-dot"></span>
          <span>ආරක්ෂිත ඩිජිටල් පද්ධතිය (Secure System)</span>
        </div>
      </div>
      

      <h1>පඬුවස්නුවර ප්‍රාදේශීය ලේකම් කාර්යාලය</h1>
      <div className="header-subtitle">ගිනිඅවි බලපත්‍ර දත්ත කළමනාකරණ පද්ධතිය</div>
      <p className="header-desc">
        නිල බලපත්‍රලාභීන්ගේ තොරතුරු නිවැරදිව කළමනාකරණය කිරීම සඳහා ස්ථාපිත ආරක්ෂිත දත්ත ගොනුව.
      </p>
    </header>
  );
};

export default Header;
