import React from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

interface RecordViewModalProps {
  record: any | null;
  isOpen: boolean;
  onClose: () => void;
  renewalYears?: any[];
  customSections?: any[];
}

const getImageUrl = (path: string | null) => {
  if (!path) return null;
  // If it's a blob url for a newly selected file, don't modify it
  if (path.startsWith('blob:')) return path;
  
  // If it's already a full HTTP URL (like Cloudinary), return it directly
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Exception: If the backend returns its own absolute URL, we might want to let it pass
    return path;
  }

  let cleanPath = path;
  let baseUrl = api.defaults.baseURL || '';
  baseUrl = baseUrl.replace(/\/api\/?$/, '');
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  if (!cleanPath.startsWith('/media/')) {
    cleanPath = '/media' + cleanPath;
  }
  return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;
};

const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="form-section-divider" style={{ marginTop: '20px', marginBottom: '10px' }}>{label}</div>
);

const DetailRow: React.FC<{ label: string; value: React.ReactNode; full?: boolean }> = ({ label, value, full }) => (
  <div className={`detail-item${full ? ' detail-value-full' : ''}`}>
    <div className="detail-label">{label}</div>
    <div className="detail-value">{value}</div>
  </div>
);

const RecordViewModal: React.FC<RecordViewModalProps> = ({ record, isOpen, onClose, renewalYears = [], customSections = [] }) => {
  const { t } = useTranslation();

  const getFieldValue = (field: any) => {
    if (!record) return null;
    if (field.system_name === 'gn_division') return record.gn_division_detail?.name;
    if (field.system_name === 'firearm_type') return record.firearm_type_detail?.name_si;
    if (field.system_name === 'outside_area_holder') return record.outside_area_holder ? t('form.yes') : t('form.no');
    if (field.system_name) return record[field.system_name];
    let value = record.custom_data?.[field.id];
    if (value === undefined || value === null || value === '') return null;
    if (field.field_type === 'boolean') value = value ? t('form.yes') : t('form.no');
    else if (field.field_type === 'checkbox' && Array.isArray(value)) value = value.join(', ');
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

  const hasStatusSelected = ['deceased', 'transferred', 'other'].some(
    k => record.current_status_info?.[k]?.selected
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <h2>{t('view.recordDetails')}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
        </div>

        <div className="modal-body">

          {/* ── Photo ── */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            {record.photo ? (
              <img
                src={getImageUrl(record.photo) || ''}
                alt="License Holder"
                style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #cbd5e1' }}
              />
            ) : (
              <div style={{ width: '150px', height: '150px', borderRadius: '8px', backgroundColor: '#fafaf9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', fontSize: '48px' }}>
                👤
                <span style={{ fontSize: '11px', color: '#78716c', marginTop: '8px', fontWeight: '600' }}>{t('view.noPhoto')}</span>
              </div>
            )}
          </div>

          {/* ── Dynamic custom sections (all fields except specially-handled ones) ── */}
          {customSections && customSections.map((section: any) => {
            const regularFields = section.fields?.filter((f: any) =>
              !['photo', 'renewal_history', 'current_status_info'].includes(f.system_name)
            ) ?? [];

            return (
              <React.Fragment key={section.id}>
                <SectionDivider label={`${section.title_si} / ${section.title_en}`} />
                <div className="detail-grid">
                  {regularFields.map((field: any) => {
                    // Dependency check
                    if (field.depends_on) {
                      const parentVal = getFieldValueById(field.depends_on);
                      if (field.depends_on_value === 'true') {
                        // Boolean field: parent must be truthy / Yes
                        const isTruthy = parentVal === true || parentVal === t('form.yes') || parentVal === 'Yes' || parentVal === 'ඔව්' || parentVal === 'ஆம்';
                        if (!isTruthy) return null;
                      } else {
                        if (String(parentVal) !== String(field.depends_on_value)) return null;
                      }
                    }

                    const value = getFieldValue(field);
                    if (value === null || value === '' || value === undefined) return null;

                    return (
                      <div
                        key={field.id}
                        className={`detail-item ${['textarea', 'image'].includes(field.field_type) ? 'detail-value-full' : ''}`}
                      >
                        <div className="detail-label">{field.label_si} / {field.label_en}</div>
                        <div className="detail-value" style={{ whiteSpace: ['textarea'].includes(field.field_type) ? 'pre-wrap' : 'normal' }}>
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Renewal History Table (injected after Firearm section) ── */}
                {section.title_en === 'Firearm and License Information' && renewalYears.length > 0 && (
                  <>
                    <SectionDivider label={`${t('form.renewal').replace(' *', '')} / License Renewal`} />
                    <div className="detail-grid">
                      <div className="detail-item detail-value-full">
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '14px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          <thead>
                            <tr style={{ backgroundColor: 'var(--bg-secondary, #f1f5f9)' }}>
                              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid var(--border-color)', width: '120px' }}>
                                වර්ෂය / Year
                              </th>
                              <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid var(--border-color)', width: '100px' }}>
                                තත්ත්වය / Status
                              </th>
                              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                                හේතුව / Reason
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {renewalYears.map((ry, idx) => {
                              const yearStr = String(ry.year);
                              const info = record.renewal_history?.[yearStr];
                              const isRenewed = info?.renewed ?? false;
                              const reason = info?.reason ?? '';
                              return (
                                <tr
                                  key={ry.id}
                                  style={{
                                    backgroundColor: isRenewed
                                      ? 'rgba(22, 101, 52, 0.04)'
                                      : idx % 2 === 0 ? '#fff' : '#fafaf9',
                                    borderBottom: '1px solid var(--border-color)'
                                  }}
                                >
                                  <td style={{ padding: '10px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {ry.year}
                                  </td>
                                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                    {isRenewed ? (
                                      <span style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        backgroundColor: '#dcfce7', color: '#166534',
                                        fontSize: '16px', fontWeight: 'bold'
                                      }}>✓</span>
                                    ) : (
                                      <span style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        backgroundColor: '#fee2e2', color: '#991b1b',
                                        fontSize: '16px', fontWeight: 'bold'
                                      }}>✗</span>
                                    )}
                                  </td>
                                  <td style={{ padding: '10px 16px', color: isRenewed ? '#166534' : '#991b1b', fontSize: '13px' }}>
                                    {isRenewed
                                      ? t('status.renewed')
                                      : reason
                                        ? reason
                                        : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>
                                    }
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Current Status (injected after status section) ── */}
                {section.title_en === 'Current Status and Other Information' && (
                  <>
                    <SectionDivider label={`${t('form.currentStatus')} / Current Status`} />
                    <div className="detail-grid">
                      {hasStatusSelected ? (
                        ['deceased', 'transferred', 'other'].map(statusKey => {
                          const info = record.current_status_info?.[statusKey];
                          if (!info || !info.selected) return null;
                          const statusColors: Record<string, string> = {
                            deceased: '#991b1b',
                            transferred: '#1e40af',
                            other: '#92400e'
                          };
                          const statusBg: Record<string, string> = {
                            deceased: '#fff1f2',
                            transferred: '#eff6ff',
                            other: '#fffbeb'
                          };
                          return (
                            <div
                              key={statusKey}
                              className="detail-item detail-value-full"
                              style={{
                                backgroundColor: statusBg[statusKey] || '#f8fafc',
                                padding: '16px',
                                borderRadius: '8px',
                                border: `1px solid ${statusColors[statusKey]}40`
                              }}
                            >
                              <div style={{ fontWeight: '700', fontSize: '15px', color: statusColors[statusKey], marginBottom: '12px' }}>
                                ⚑ {t(`status.${statusKey}`)}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                                <div>
                                  <div className="detail-label" style={{ fontSize: '12px' }}>{t('form.statusModificationDate')}</div>
                                  <div className="detail-value">{info.date || '—'}</div>
                                </div>
                                <div>
                                  <div className="detail-label" style={{ fontSize: '12px' }}>{t('form.statusReason')}</div>
                                  <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{info.reason || '—'}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="detail-item detail-value-full">
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#dcfce7', borderRadius: '6px', color: '#166534', fontWeight: '600', fontSize: '14px' }}>
                            <span>✓</span> {t('status.active')}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Outside area holder */}
                    {record.outside_area_holder && (
                      <>
                        <SectionDivider label={`${t('form.outsideResident')}`} />
                        <div className="detail-grid">
                          {record.outside_residential_address && (
                            <DetailRow
                              label={`${t('form.outsideAddress')}`}
                              value={<span style={{ whiteSpace: 'pre-wrap' }}>{record.outside_residential_address}</span>}
                              full
                            />
                          )}
                          {record.land_location_details && (
                            <DetailRow
                              label={`${t('form.landDetails')}`}
                              value={<span style={{ whiteSpace: 'pre-wrap' }}>{record.land_location_details}</span>}
                              full
                            />
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}

              </React.Fragment>
            );
          })}

          {/* ── Attachments ── */}
          {record.attachments && record.attachments.length > 0 && (
            <>
              <SectionDivider label={`${t('form.attachmentsSection')} / Attachments`} />
              <div className="detail-grid">
                <div className="detail-item detail-value-full">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                    {record.attachments.map((att: any) => {
                      const fileUrl = att.file_url || att.file;
                      const ext = (fileUrl || '').split('.').pop()?.toLowerCase();
                      const icon = ['jpg','jpeg','png','gif','webp','bmp'].includes(ext || '') ? '🖼️'
                        : ['pdf'].includes(ext || '') ? '📕'
                        : ['doc','docx'].includes(ext || '') ? '📘'
                        : ['xls','xlsx'].includes(ext || '') ? '📗'
                        : '📎';
                      return (
                        <div key={att.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px', backgroundColor: '#f8fafc' }}>
                          <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
                          <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px', wordBreak: 'break-word' }}>
                            {att.file_name}
                          </div>
                          {att.uploaded_at && (
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                              {new Date(att.uploaded_at).toLocaleDateString()}
                            </div>
                          )}
                          {fileUrl && (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                backgroundColor: 'var(--primary-color)',
                                color: '#fff',
                                borderRadius: '4px',
                                fontSize: '12px',
                                textDecoration: 'none',
                                fontWeight: '600'
                              }}
                            >
                              ⬇ {t('form.downloadAttachment')}
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

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
