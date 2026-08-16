import React from 'react';

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
  if (!isOpen || !record) return null;

  const getRenewalStatusText = (status: string | null) => {
    switch (status) {
      case 'renewed': return 'අලුත් කර ඇත';
      case 'pending': return 'අලුත් කිරීමට නියමිතයි';
      case 'not_renewed': return 'අලුත් කර නැත';
      case 'other': return 'වෙනත්';
      default: return 'නොදනී';
    }
  };

  const getCurrentStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'සක්‍රීය';
      case 'deceased': return 'මියගොස් ඇත';
      case 'transferred': return 'පවරා ඇත';
      case 'not_renewed': return 'බලපත්‍රය අලුත් කර නැත';
      case 'other': return 'වෙනත්';
      default: return 'නොදනී';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>බලපත්‍රලාභියාගේ සම්පූර්ණ තොරතුරු</h2>
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
          <div className="form-section-divider">පුද්ගලික තොරතුරු (Personal Information)</div>
          <div className="detail-grid">
            <div className="detail-item detail-value-full">
              <div className="detail-label">සම්පූර්ණ නම</div>
              <div className="detail-value">{record.full_name}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">ජාතික හැඳුනුම්පත් අංකය (NIC)</div>
              <div className="detail-value">{record.nic}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">දුරකථන අංකය</div>
              <div className="detail-value">{record.telephone}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">ලිපිනය</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.address}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">ග්‍රාම නිලධාරී කොට්ඨාසය</div>
              <div className="detail-value">{record.gn_division_detail?.name || 'නොදනී'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">උපන්දිනය</div>
              <div className="detail-value">{record.date_of_birth}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">අවුරුදු 65 සම්පූර්ණ වන දිනය</div>
              <div className="detail-value" style={{ fontWeight: 'bold', color: '#b45309' }}>
                {record.sixty_fifth_birthday || 'නොදනී'}
              </div>
            </div>
          </div>

          {/* Firearm Information */}
          <div className="form-section-divider">ගිනිඅවි තොරතුරු (Firearm Information)</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">ගිනිඅවි වර්ගය</div>
              <div className="detail-value">{record.firearm_type_detail?.name_si || 'නොදනී'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">ගිනිඅවි අංකය</div>
              <div className="detail-value">{record.firearm_number}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">මුලින්ම බලපත්‍ර ලද වර්ෂය</div>
              <div className="detail-value">{record.first_licensed_year}</div>
            </div>
          </div>

          {/* License Renewal */}
          <div className="form-section-divider">බලපත්‍ර අලුත් කිරීම (License Renewal)</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">අලුත් කළ වර්ෂය</div>
              <div className="detail-value">{record.renewal_year || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">අලුත් කළ දිනය</div>
              <div className="detail-value">{record.renewal_date || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">අලුත් කිරීමේ තත්ත්වය</div>
              <div className="detail-value">{getRenewalStatusText(record.renewal_status)}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">සටහන්</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.renewal_remarks || '-'}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">බලපත්‍රය අලුත් නොකිරීම සම්බන්ධ තොරතුරු</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.non_renewal_information || '-'}</div>
            </div>
          </div>

          {/* Current Status */}
          <div className="form-section-divider">බලපත්‍රහිමියාගේ වර්තමාන තත්ත්වය (Current Status)</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">වර්තමාන තත්ත්වය</div>
              <div className="detail-value" style={{ fontWeight: '600' }}>{getCurrentStatusText(record.current_status)}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">තත්ත්වය වෙනස් වූ දිනය</div>
              <div className="detail-value">{record.status_date || '-'}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">තත්ත්වය පිළිබඳ විස්තර / සටහන්</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.status_remarks || '-'}</div>
            </div>
          </div>

          {/* Firearm Transfer */}
          <div className="form-section-divider">ගිනිඅවිය පැවරීම පිළිබඳ විස්තර (Transfer Details)</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">පැවරූ දිනය</div>
              <div className="detail-value">{record.transfer_date || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">පෙර බලපත්‍ර හිමියා</div>
              <div className="detail-value">{record.previous_holder || '-'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">නව බලපත්‍ර හිමියා / නිල යොමුව</div>
              <div className="detail-value">{record.new_holder_reference || '-'}</div>
            </div>
            <div className="detail-item detail-value-full">
              <div className="detail-label">පැවරීම පිළිබඳ විස්තර සහ සටහන්</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.transfer_details || '-'}</div>
            </div>
          </div>

          {/* Special Information */}
          <div className="form-section-divider">වෙනත් විශේෂ තොරතුරු (Special Information)</div>
          <div className="detail-grid">
            <div className="detail-item detail-value-full">
              <div className="detail-label">විශේෂ තොරතුරු</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.special_information || '-'}</div>
            </div>
          </div>

          {/* Out of Area Residents */}
          <div className="form-section-divider">ප්‍රදේශයෙන් පිටත පදිංචිකරුවන් (Out-of-Area Residents)</div>
          <div className="detail-grid">
            <div className="detail-item detail-value-full">
              <div className="detail-label">පඬුවස්නුවරින් පිටත පදිංචි, මෙම බලප්‍රදේශය තුළ ඉඩම් හිමි බලපත්‍රලාභියෙක්ද?</div>
              <div className="detail-value">{record.outside_area_holder ? 'ඔව්' : 'නැත'}</div>
            </div>
            {record.outside_area_holder && (
              <>
                <div className="detail-item detail-value-full">
                  <div className="detail-label">වර්තමාන පදිංචි ලිපිනය</div>
                  <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.outside_residential_address || '-'}</div>
                </div>
                <div className="detail-item detail-value-full">
                  <div className="detail-label">මෙම බලප්‍රදේශය තුළ ඉඩම් / ස්ථාන විස්තර</div>
                  <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{record.land_location_details || '-'}</div>
                </div>
              </>
            )}
          </div>

        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            වසන්න
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordViewModal;
