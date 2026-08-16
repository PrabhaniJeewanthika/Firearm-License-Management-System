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
  current_status: string;
  status_date: string | null;
  status_remarks: string | null;
  transfer_date: string | null;
  previous_holder: string | null;
  new_holder_reference: string | null;
  transfer_details: string | null;
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

  const getRenewalStatusText = (status: string | null) => {
    switch (status) {
      case 'renewed': return 'අලුත් කර ඇත'; // You can add translation keys here if needed
      case 'pending': return 'අලුත් කිරීමට නියමිතයි';
      case 'not_renewed': return t('status.not_renewed');
      case 'other': return t('status.other');
      default: return '-';
    }
  };

  const getCurrentStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('status.active');
      case 'deceased': return t('status.deceased');
      case 'transferred': return t('status.transferred');
      case 'not_renewed': return t('status.not_renewed');
      case 'other': return t('status.other');
      default: return '-';
    }
  };

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
            <div className="detail-item">
              <div className="detail-label">{t('view.renewedYear')}</div>
              <div className="detail-value">{record.renewal_year || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('view.renewedDate')}</div>
              <div className="detail-value">{record.renewal_date || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('view.renewStatus')}</div>
              <div className="detail-value">{getRenewalStatusText(record.renewal_status)}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">{t('view.notes')}</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.renewal_remarks || '-'}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">{t('view.notRenewedReason')}</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.non_renewal_information || '-'}</div>
            </div>
          </div>

          {/* Current Status */}
          <div className="form-section-divider">{t('form.section4').replace('04 ', '')}</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">{t('form.currentStatus')}</div>
              <div className="detail-value" style={{ fontWeight: '600' }}>{getCurrentStatusText(record.current_status)}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('form.statusDate')}</div>
              <div className="detail-value">{record.status_date || '-'}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">{t('form.statusRemarks')}</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.status_remarks || '-'}</div>
            </div>
          </div>

          {/* Firearm Transfer */}
          <div className="form-section-divider">{t('view.transferDetails')}</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">{t('view.transferDate')}</div>
              <div className="detail-value">{record.transfer_date || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('view.prevHolder')}</div>
              <div className="detail-value">{record.previous_holder || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t('view.newHolder')}</div>
              <div className="detail-value">{record.new_holder_reference || '-'}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">{t('form.transferDetails')}</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.transfer_details || '-'}</div>
            </div>
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
