import React from 'react';

interface SummaryCardsProps {
  totalRecords: number;
  totalGNDivisions: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ totalRecords, totalGNDivisions }) => {
  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div className="summary-card-val">{totalRecords}</div>
        <div className="summary-card-lbl">සම්පූර්ණ වාර්තා</div>
      </div>
      <div className="summary-card">
        <div className="summary-card-val">{totalGNDivisions}</div>
        <div className="summary-card-lbl">GN කොට්ඨාස</div>
      </div>
    </div>
  );
};

export default SummaryCards;
