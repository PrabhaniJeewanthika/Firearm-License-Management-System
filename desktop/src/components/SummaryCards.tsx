import React from 'react';
import { useTranslation } from 'react-i18next';

interface SummaryCardsProps {
  totalRecords: number;
  totalGNDivisions: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ totalRecords, totalGNDivisions }) => {
  const { t } = useTranslation();

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div className="summary-card-val">{totalRecords}</div>
        <div className="summary-card-lbl">{t('summary.totalLicenses')}</div>
      </div>
      <div className="summary-card">
        <div className="summary-card-val">{totalGNDivisions}</div>
        <div className="summary-card-lbl">{t('summary.gnDivisions')}</div>
      </div>
    </div>
  );
};

export default SummaryCards;
