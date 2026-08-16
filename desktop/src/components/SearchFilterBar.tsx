import React from 'react';
import { useTranslation } from 'react-i18next';

interface GNDivision {
  id: number;
  name: string;
}

interface FirearmType {
  id: number;
  name_si: string;
  name_en: string;
}

interface SearchFilterBarProps {
  gnDivisions: GNDivision[];
  firearmTypes: FirearmType[];
  search: string;
  filters: {
    gn_division: string;
    firearm_type: string;
    renewal_status: string;
    current_status: string;
    outside_area_holder: string;
  };
  onSearchChange: (val: string) => void;
  onFilterChange: (key: string, val: string) => void;
  onSearchSubmit: () => void;
  onReset: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  gnDivisions,
  firearmTypes,
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onSearchSubmit,
  onReset,
}) => {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <div className="card">
      <div className="card-title">සෙවීම සහ පෙරහන් (Search & Filters)</div>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            className="form-input"
            placeholder={t('search.placeholder')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div>
          <button className="btn btn-primary" onClick={onSearchSubmit}>සොයන්න</button>
        </div>
      </div>

      <div className="search-filter-grid">
        <div className="form-group">
          <label className="form-label">{t('form.gnDivision').replace(' *', '')}</label>
          <select
            className="form-select"
            value={filters.gn_division}
            onChange={(e) => onFilterChange('gn_division', e.target.value)}
          >
            <option value="">{t('search.allGN')}</option>
            {gnDivisions.map((gn) => (
              <option key={gn.id} value={gn.id}>
                {gn.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t('form.firearmType').replace(' *', '')}</label>
          <select
            className="form-select"
            value={filters.firearm_type}
            onChange={(e) => onFilterChange('firearm_type', e.target.value)}
          >
            <option value="">{t('search.allTypes')}</option>
            {firearmTypes.map((ft) => (
              <option key={ft.id} value={ft.id}>
                {ft.name_si}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t('form.renewal').replace(' *', '')}</label>
          <select
            className="form-select"
            value={filters.renewal_status}
            onChange={(e) => onFilterChange('renewal_status', e.target.value)}
          >
            <option value="">සියල්ල (All)</option>
            <option value="renewed">අලුත් කර ඇත</option>
            <option value="pending">අලුත් කිරීමට නියමිතයි</option>
            <option value="not_renewed">අලුත් කර නැත</option>
            <option value="other">{t('status.other')}</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t('form.currentStatus')}</label>
          <select
            className="form-select"
            value={filters.current_status}
            onChange={(e) => onFilterChange('current_status', e.target.value)}
          >
            <option value="">{t('search.allStatus')}</option>
            <option value="active">{t('status.active')}</option>
            <option value="deceased">{t('status.deceased')}</option>
            <option value="transferred">{t('status.transferred')}</option>
            <option value="not_renewed">{t('status.not_renewed')}</option>
            <option value="other">{t('status.other')}</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t('form.outsideResident')}</label>
          <select
            className="form-select"
            value={filters.outside_area_holder}
            onChange={(e) => onFilterChange('outside_area_holder', e.target.value)}
          >
            <option value="">සියල්ල (All)</option>
            <option value="true">{t('form.yes')}</option>
            <option value="false">{t('form.no')}</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button className="btn btn-secondary" onClick={onReset}>{t('search.reset')}</button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
