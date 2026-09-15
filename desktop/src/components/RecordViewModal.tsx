import React from 'react';
import { useTranslation } from 'react-i18next';

interface RecordViewModalProps {
  record: any | null;
  isOpen: boolean;
  onClose: () => void;
  renewalYears?: any[];
  customSections?: any[];
}

const RecordViewModal: React.FC<RecordViewModalProps> = ({ record, isOpen, onClose, renewalYears = [], customSections = [] }) => {
  const { t } = useTranslation();

  const getFieldValue = (field: any) => {
    if (!record) return null;
    if (field.system_name === 'gn_division') return record.gn_division_detail?.name;
    if (field.system_name === 'firearm_type') return record.firearm_type_detail?.name_si;
    if (field.system_name === 'outside_area_holder') return record.outside_area_holder ? t('form.yes') : t('form.no');
    
    if (field.system_name) {
      return record[field.system_name];
    }
    
    let value = record.custom_data?.[field.id];
    if (value === undefined || value === null || value === '') return null;
    
    if (field.field_type === 'boolean') {
      value = value ? t('form.yes') : t('form.no');
    } else if (field.field_type === 'checkbox' && Array.isArray(value)) {
      value = value.join(', ');
    }
    return value;
  };

  const getFieldValueById = (id: number) => {
    for (const sec of customSections) {
      const f = sec.fields?.find((f: any) => f.id === id);
      if (f) return getFieldValue(f);
    }
    return null;
  };

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
           {customSections && customSections.map((section: any) => {
            return (
              <React.Fragment key={section.id}>
                <div className="form-section-divider">{section.title_si} / {section.title_en}</div>
                <div className="detail-grid">
                  {section.fields?.map((field: any) => {
                    if (field.system_name === 'photo') return null; // Handled at the top

                    if (field.depends_on) {
                      const parentVal = getFieldValueById(field.depends_on);
                      // Exact string match for conditionals for view
                      if (String(parentVal) !== String(field.depends_on_value) && field.depends_on_value !== 'true') {
                          // Handle boolean special case
                          if (!(field.depends_on_value === 'true' && parentVal === t('form.yes'))) {
                             return null;
                          }
                      }
                    }

                    const value = getFieldValue(field);
                    if (value === null || value === '' || value === undefined) return null;

                    return (
                      <div key={field.id} className={`detail-item ${['textarea', 'image'].includes(field.field_type) ? 'detail-value-full' : ''}`}>
                        <div className="detail-label">{field.label_si} / {field.label_en}</div>
                        <div className="detail-value" style={{ whiteSpace: ['textarea'].includes(field.field_type) ? 'pre-wrap' : 'normal' }}>
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Special injections */}
                {section.title_en === 'Firearm and License Information' && (
                  <>
                    <div className="form-section-divider">{t('form.renewal').replace(' *', '')}</div>
                    <div className="detail-grid">
                      <div className="detail-item detail-value-full">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                          {renewalYears.map(ry => {
                            const yearStr = String(ry.year);
                            const info = record.renewal_history?.[yearStr];
                            const isRenewed = info?.renewed ?? false;
                            const reason = info?.reason ?? '';
                            return (
                              <div key={ry.id} style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: isRenewed ? '#f0fdf4' : '#fafaf9' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '14px', color: isRenewed ? '#166534' : '#57534e' }}>
                                    {ry.year} - {isRenewed ? 'අලුත් කර ඇත' : t('status.not_renewed')}
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
                  </>
                )}

                {section.title_en === 'Current Status and Other Information' && (
                  <>
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
                  </>
                )}
              </React.Fragment>
            );
          })}


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
