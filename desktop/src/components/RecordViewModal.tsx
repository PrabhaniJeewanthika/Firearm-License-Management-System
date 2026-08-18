import React from 'react';
import { useTranslation } from 'react-i18next';

interface GNDivisionDetail {
  id: number;
  name: string;
}

interface FirearmTypeDetail {
  id: number;
  name_si: string;
  name_en: string;
}

interface RecordData {
  id: number;
  photo: string | null;
  full_name: string;
  nic: string;
  address: string;
  gn_division_detail?: GNDivisionDetail;
  date_of_birth: string;
  sixty_fifth_birthday: string | null;
  telephone: string;
  firearm_type_detail?: FirearmTypeDetail;
  firearm_number: string;
  first_licensed_year: number;
  renewal_year: number | null;
  renewal_date: string | null;
  renewal_status: string | null;
  renewal_remarks: string | null;
  non_renewal_information: string | null;
  current_status_info?: any;
  special_information: string | null;
  outside_area_holder: boolean;
  outside_residential_address: string | null;
  land_location_details: string | null;
}

interface RecordViewModalProps {
  isOpen: boolean;
  record: RecordData | null;
  onClose: () => void;
}
const RecordViewModal: React.FC<RecordViewModalProps> = ({
  isOpen,
  record,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !record) return null;





  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{t('view.recordDetails')}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
        </div>
        <div className="modal-body">
          {/* Photo Section */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            {record.photo ? (
              <img
                src={record.photo}
                alt="License Holder"
                style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #cbd5e1' }}
              />
            ) : (
              <div style={{ width: '150px', height: '150px', borderRadius: '8px', backgroundColor: '#fafaf9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', fontSize: '48px' }}>
                👤
                <span style={{ fontSize: '11px', color: '#78716c', marginTop: '8px', fontWeight: '600' }}>ඡායාරූපයක් නොමැත</span>
              </div>
            )}
          </div>

          {/* Personal Information */}
          {/* Personal Information */}
          <div className="form-section-divider">{t('form.section1').replace('01 ', '')}</div>
          <div className="detail-grid">
            <div className="detail-item detail-value-full">
              <div className="detail-label">{t('form.fullName').replace(' *', '')}</div>
              <div className="detail-value">{record.full_name}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('form.nic').replace(' *', '')}</div>
              <div className="detail-value">{record.nic}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('form.telephone')}</div>
              <div className="detail-value">{record.telephone}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('form.whatsapp')}</div>
              <div className="detail-value">{record.whatsapp_number || '-'}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">{t('form.address')}</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.address}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('form.gnDivision').replace(' *', '')}</div>
              <div className="detail-value">{record.gn_division_detail?.name || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('form.dob').replace(' *', '')}</div>
              <div className="detail-value">{record.date_of_birth}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('form.age65')}</div>
              <div className="detail-value" style={{ fontWeight: 'bold', color: '#b45309' }}>
                {record.sixty_fifth_birthday || '-'}
              </div>
            </div>
          </div>

          {/* Firearm Information */}
          <div className="form-section-divider">{t('form.section3').replace('03 ', '')}</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">{t('form.firearmType').replace(' *', '')}</div>
              <div className="detail-value">{record.firearm_type_detail?.name_si || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('form.firearmNumber').replace(' *', '')}</div>
              <div className="detail-value">{record.firearm_number}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('form.firstLicenseYear')}</div>
              <div className="detail-value">{record.first_licensed_year}</div>
            </div>
          </div>

          {/* License Renewal */}
          <div className="form-section-divider">{t('form.renewal').replace(' *', '')}</div>
          <div className="detail-grid">
            <div className="detail-item detail-value-full">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => {
                  const yearStr = String(year);
                  const info = record.renewal_history?.[yearStr];
                  const isRenewed = info?.renewed ?? false;
                  const reason = info?.reason ?? '';
                  
                  // if not renewed and no reason is given, it's just pending/default. We only show if explicitly set or we show all years.
                  // It's better to show all years with status.
                  return (
                    <div key={year} style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: isRenewed ? '#f0fdf4' : '#fafaf9' }}>
                       <div style={{ fontWeight: 'bold', fontSize: '14px', color: isRenewed ? '#166534' : '#57534e' }}>
                          {year} - {isRenewed ? 'අලුත් කර ඇත' : t('status.not_renewed')}
                       </div>
                       {!isRenewed && reason && (
                         <div style={{ marginTop: '8px', fontSize: '12px', color: '#991b1b' }}>
                           <strong>{t('form.statusReason')}:</strong> {reason}
                         </div>
                       )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="form-section-divider">{t('form.section4').replace('04 ', '')}</div>
          <div className="detail-grid">
            {['deceased', 'transferred', 'other'].map((statusKey) => {
              const info = record.current_status_info?.[statusKey];
              if (!info || !info.selected) return null;
              return (
                <React.Fragment key={statusKey}>
                  <div className="detail-item detail-value-full" style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div className="detail-label" style={{ fontSize: '15px', color: 'var(--state-maroon)', marginBottom: '12px' }}>{t(`status.${statusKey}`)}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: statusKey === 'deceased' ? '1fr' : '1fr 2fr', gap: '16px' }}>
                      {statusKey !== 'deceased' && (
                        <div>
                          <div className="detail-label" style={{ fontSize: '12px' }}>{t('form.statusModificationDate')}</div>
                          <div className="detail-value">{info.date || '-'}</div>
                        </div>
                      )}
                      <div>
                        <div className="detail-label" style={{ fontSize: '12px' }}>{t('form.statusReason')}</div>
                        <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{info.reason || '-'}</div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            {(!record.current_status_info || !['deceased', 'transferred', 'other'].some(k => record.current_status_info?.[k]?.selected)) && (
               <div className="detail-item detail-value-full">
                  <div className="detail-value" style={{ fontWeight: '600' }}>{t('status.active')}</div>
               </div>
            )}
          </div>

          {/* Special Information */}
          <div className="form-section-divider">{t('form.specialInfo')}</div>
          <div className="detail-grid">
            <div className="detail-item detail-value-full">
              <div className="detail-label">{t('form.specialInfo')}</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.special_information || '-'}</div>
            </div>
          </div>

          {/* Out of Area Residents */}
          <div className="form-section-divider">{t('form.outsideResident')}</div>
          <div className="detail-grid">
            <div className="detail-item detail-value-full">
              <div className="detail-label">{t('form.outsideResident')}</div>
              <div className="detail-value">{record.outside_area_holder ? t('form.yes') : t('form.no')}</div>
            </div>
            {record.outside_area_holder && (
              <>
                <div className="detail-item detail-value-full">
                  <div className="detail-label">{t('form.outsideAddress')}</div>
                  <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.outside_residential_address || '-'}</div>
                </div>
                <div className="detail-item detail-value-full">
                  <div className="detail-label">{t('form.landDetails')}</div>
                  <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.land_location_details || '-'}</div>
                </div>
              </>
            )}
          </div>

        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t('view.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordViewModal;
