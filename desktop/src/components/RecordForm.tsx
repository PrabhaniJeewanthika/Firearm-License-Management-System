import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

interface GNDivision {
  id: number;
  name: string;
}

interface FirearmType {
  id: number;
  name_si: string;
  name_en: string;
}

interface RecordFormProps {
  gnDivisions: GNDivision[];
  firearmTypes: FirearmType[];
  renewalYears: any[];
  customSections?: any[];
  editingRecord: any | null;
  onSaveSuccess: () => void;
  onCancelEdit: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({
  gnDivisions,
  firearmTypes,
  renewalYears = [],
  customSections = [],
  editingRecord,
  onSaveSuccess,
  onCancelEdit,
}) => {
  const { t } = useTranslation();
  // Form State
  const [fullName, setFullName] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');
  const [gnDivision, setGnDivision] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sixtyFifthBirthday, setSixtyFifthBirthday] = useState('');
  const [telephone, setTelephone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [firearmType, setFirearmType] = useState('');
  const [firearmNumber, setFirearmNumber] = useState('');
  const [firstLicensedYear, setFirstLicensedYear] = useState('');

  const [renewalYear, setRenewalYear] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [renewalStatus, setRenewalStatus] = useState('');
  const [renewalRemarks, setRenewalRemarks] = useState('');
  const [nonRenewalInformation, setNonRenewalInformation] = useState('');
  const [renewalHistory, setRenewalHistory] = useState<Record<string, { renewed: boolean; reason: string }>>({});

  const [currentStatusInfo, setCurrentStatusInfo] = useState({
    deceased: { selected: false, date: '', reason: '' },
    transferred: { selected: false, date: '', reason: '' },
    other: { selected: false, date: '', reason: '' }
  });

  const [specialInformation, setSpecialInformation] = useState('');

  const [outsideAreaHolder, setOutsideAreaHolder] = useState(false);
  const [outsideResidentialAddress, setOutsideResidentialAddress] = useState('');
  const [landLocationDetails, setLandLocationDetails] = useState('');

  // Dynamic Custom Data State
  const [customData, setCustomData] = useState<Record<string, any>>({});

  // Image Upload State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const getFieldValue = (field: any) => {
    if (field.system_name === 'full_name') return fullName;
    if (field.system_name === 'nic') return nic;
    if (field.system_name === 'telephone') return telephone;
    if (field.system_name === 'whatsapp_number') return whatsappNumber;
    if (field.system_name === 'address') return address;
    if (field.system_name === 'gn_division') return gnDivision;
    if (field.system_name === 'date_of_birth') return dateOfBirth;
    if (field.system_name === 'sixty_fifth_birthday') return sixtyFifthBirthday;
    if (field.system_name === 'firearm_type') return firearmType;
    if (field.system_name === 'firearm_number') return firearmNumber;
    if (field.system_name === 'first_licensed_year') return firstLicensedYear;
    if (field.system_name === 'special_information') return specialInformation;
    if (field.system_name === 'outside_area_holder') return outsideAreaHolder;
    if (field.system_name === 'outside_residential_address') return outsideResidentialAddress;
    if (field.system_name === 'land_location_details') return landLocationDetails;
    
    return customData[field.id] !== undefined ? customData[field.id] : (field.field_type === 'checkbox' ? [] : field.field_type === 'boolean' ? false : '');
  };

  const getFieldValueById = (id: number) => {
    for (const sec of customSections) {
      const f = sec.fields?.find((f: any) => f.id === id);
      if (f) return getFieldValue(f);
    }
    return null;
  };

  const setFieldValue = (field: any, val: any) => {
    if (field.system_name === 'full_name') setFullName(val);
    else if (field.system_name === 'nic') setNic(val);
    else if (field.system_name === 'telephone') setTelephone(val);
    else if (field.system_name === 'whatsapp_number') setWhatsappNumber(val);
    else if (field.system_name === 'address') setAddress(val);
    else if (field.system_name === 'gn_division') setGnDivision(val);
    else if (field.system_name === 'date_of_birth') {
      setDateOfBirth(val);
      if (val) {
        const dobDate = new Date(val);
        dobDate.setFullYear(dobDate.getFullYear() + 65);
        setSixtyFifthBirthday(dobDate.toISOString().split('T')[0]);
      } else {
        setSixtyFifthBirthday('');
      }
    }
    else if (field.system_name === 'sixty_fifth_birthday') setSixtyFifthBirthday(val);
    else if (field.system_name === 'firearm_type') setFirearmType(val);
    else if (field.system_name === 'firearm_number') setFirearmNumber(val);
    else if (field.system_name === 'first_licensed_year') setFirstLicensedYear(val);
    else if (field.system_name === 'special_information') setSpecialInformation(val);
    else if (field.system_name === 'outside_area_holder') setOutsideAreaHolder(val);
    else if (field.system_name === 'outside_residential_address') setOutsideResidentialAddress(val);
    else if (field.system_name === 'land_location_details') setLandLocationDetails(val);
    else {
      setCustomData(prev => ({ ...prev, [field.id]: val }));
    }
  };

  // Scroll to Form Ref
  const formRef = useRef<HTMLDivElement>(null);

  // Load editing record details
  useEffect(() => {
    if (editingRecord) {
      setFullName(editingRecord.full_name || '');
      setNic(editingRecord.nic || '');
      setAddress(editingRecord.address || '');
      setGnDivision(editingRecord.gn_division ? String(editingRecord.gn_division) : '');
      setDateOfBirth(editingRecord.date_of_birth || '');
      setSixtyFifthBirthday(editingRecord.sixty_fifth_birthday || '');
      setTelephone(editingRecord.telephone || '');
      setWhatsappNumber(editingRecord.whatsapp_number || '');

      setFirearmType(editingRecord.firearm_type ? String(editingRecord.firearm_type) : '');
      setFirearmNumber(editingRecord.firearm_number || '');
      setFirstLicensedYear(editingRecord.first_licensed_year ? String(editingRecord.first_licensed_year) : '');

      setRenewalYear(editingRecord.renewal_year ? String(editingRecord.renewal_year) : '');
      setRenewalDate(editingRecord.renewal_date || '');
      setRenewalStatus(editingRecord.renewal_status || '');
      setRenewalRemarks(editingRecord.renewal_remarks || '');
      setNonRenewalInformation(editingRecord.non_renewal_information || '');
      setRenewalHistory(editingRecord.renewal_history || {});

      const csi = editingRecord.current_status_info || {};
      setCurrentStatusInfo({
        deceased: {
          selected: csi.deceased?.selected || false,
          date: csi.deceased?.date || '',
          reason: csi.deceased?.reason || ''
        },
        transferred: {
          selected: csi.transferred?.selected || false,
          date: csi.transferred?.date || '',
          reason: csi.transferred?.reason || ''
        },
        other: {
          selected: csi.other?.selected || false,
          date: csi.other?.date || '',
          reason: csi.other?.reason || ''
        }
      });

      setSpecialInformation(editingRecord.special_information || '');

      setOutsideAreaHolder(editingRecord.outside_area_holder || false);
      setOutsideResidentialAddress(editingRecord.outside_residential_address || '');
      setLandLocationDetails(editingRecord.land_location_details || '');

      setCustomData(editingRecord.custom_data || {});

      setPhotoFile(null);
      setPhotoPreview(editingRecord.photo || null);
      setErrors({});
      setSubmitError('');
      setSubmitSuccess('');

      // Scroll to form
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      resetForm(false);
    }
  }, [editingRecord]);

  // Real-time calculation of 65th birthday
  useEffect(() => {
    if (dateOfBirth) {
      const parts = dateOfBirth.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        setSixtyFifthBirthday(`${year + 65}-${parts[1]}-${parts[2]}`);
      }
    } else {
      setSixtyFifthBirthday('');
    }
  }, [dateOfBirth]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.full_name = t('errors.fullName');
    if (!nic.trim()) newErrors.nic = t('errors.nic');
    if (!firearmNumber.trim()) newErrors.firearm_number = t('errors.firearmNumber');
    if (!gnDivision) newErrors.gn_division = t('errors.gnDivision');
    if (!firearmType) newErrors.firearm_type = t('errors.firearmType');

    // Phone validation (SL format: 07XXXXXXXX)
    const phoneRegex = /^(?:0)\d{9}$/;
    if (telephone && !phoneRegex.test(telephone)) {
      newErrors.telephone = t('errors.phone');
    }

    // DOB future date validation
    if (dateOfBirth) {
      const dobDate = new Date(dateOfBirth);
      const today = new Date();
      if (dobDate > today) {
        newErrors.date_of_birth = t('errors.dobFuture');
      }
    } else {
      newErrors.date_of_birth = t('errors.dobReq');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = (askConfirmation = true) => {
    if (askConfirmation && (fullName || nic || firearmNumber || photoPreview)) {
      const confirmClear = window.confirm(t('errors.confirmClear'));
      if (!confirmClear) return;
    }

    setFullName('');
    setNic('');
    setAddress('');
    setGnDivision('');
    setDateOfBirth('');
    setSixtyFifthBirthday('');
    setTelephone('');
    setWhatsappNumber('');
    setFirearmType('');
    setFirearmNumber('');
    setFirstLicensedYear('');
    setRenewalYear('');
    setRenewalDate('');
    setRenewalStatus('');
    setRenewalRemarks('');
    setNonRenewalInformation('');
    setRenewalHistory({});
    setCurrentStatusInfo({
      deceased: { selected: false, date: '', reason: '' },
      transferred: { selected: false, date: '', reason: '' },
      other: { selected: false, date: '', reason: '' }
    });
    setSpecialInformation('');
    setOutsideAreaHolder(false);
    setOutsideResidentialAddress('');
    setLandLocationDetails('');
    setCustomData({});
    setPhotoFile(null);
    setPhotoPreview(null);
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!validate()) {
      const firstError = Object.values(errors)[0];
      if (firstError) setSubmitError(firstError);
      return;
    }

    setIsSubmitting(true);

    // Create Form Data for file upload
    const formData = new FormData();
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    formData.append('full_name', fullName);
    formData.append('nic', nic);
    formData.append('address', address);
    formData.append('gn_division', gnDivision);
    formData.append('date_of_birth', dateOfBirth);
    formData.append('telephone', telephone);
    formData.append('whatsapp_number', whatsappNumber);
    formData.append('firearm_type', firearmType);
    formData.append('firearm_number', firearmNumber);
    formData.append('first_licensed_year', firstLicensedYear || '0');
    formData.append('renewal_year', renewalYear || '');
    formData.append('renewal_date', renewalDate || '');
    formData.append('renewal_status', renewalStatus || '');
    formData.append('renewal_remarks', renewalRemarks);
    formData.append('non_renewal_information', nonRenewalInformation);
    formData.append('renewal_history', JSON.stringify(renewalHistory));
    formData.append('current_status_info', JSON.stringify(currentStatusInfo));
    formData.append('special_information', specialInformation);
    formData.append('outside_area_holder', String(outsideAreaHolder));
    formData.append('outside_residential_address', outsideResidentialAddress);
    formData.append('land_location_details', landLocationDetails);
    formData.append('custom_data', JSON.stringify(customData));

    try {
      if (editingRecord) {
        await api.put(`/records/${editingRecord.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitSuccess(t('errors.updateSuccess'));
        setTimeout(() => {
          onSaveSuccess();
        }, 1000);
      } else {
        await api.post('/records/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitSuccess(t('errors.saveSuccess'));
        resetForm(false);
        setTimeout(() => {
          onSaveSuccess();
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data) {
        const data = err.response.data;
        if (data.nic) {
          setSubmitError(t('errors.duplicateNIC'));
        } else if (data.firearm_number) {
          setSubmitError(t('errors.duplicateFirearm'));
        } else {
          setSubmitError(t('errors.saveFailed'));
        }
      } else {
        setSubmitError(t('errors.apiError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" ref={formRef}>
      <div className="card-header-area">
        <div className="card-title">
          {editingRecord ? t('tabs.editRecord') : t('tabs.newRecord')}
        </div>
        <div className="card-subtitle">{t('form.mandatory')}</div>
      </div>

      {submitError && (
        <div style={{ backgroundColor: 'var(--danger-color)', color: '#fff', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: '600', boxShadow: 'var(--shadow-sm)' }}>
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div style={{ backgroundColor: 'var(--success-color)', color: '#fff', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: '600', boxShadow: 'var(--shadow-sm)' }}>
          {submitSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Section 1: Personal Details */}
        <div className="form-section-header">
          <span className="section-num">01</span>
          <span className="section-title">{t('form.section1').replace('01 ', '')}</span>
        </div>

        {/* Photo Upload Section */}
        <div className="form-group">
          <label className="form-label">{t('form.photoLabel')}</label>
          <div className="photo-uploader">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">
                <span style={{ fontSize: '24px' }}></span>
                <span style={{ marginTop: '8px', fontWeight: '600' }}>JPG / PNG</span>
              </div>
            )}
            <div className="photo-controls">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handlePhotoChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                {photoPreview ? t('form.changePhoto') : t('form.choosePhoto')}
              </button>
              {photoPreview && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={removePhoto}
                  style={{ padding: '6px 12px', fontSize: '12px', marginTop: '4px' }}
                >
                  {t('form.removePhoto')}
                </button>
              )}
            </div>
          </div>
        </div>

        
        {customSections && customSections.map((section: any, idx: number) => (
          <React.Fragment key={section.id}>
            <div className="form-section-header">
              <span className="section-num">{String(idx + 1).padStart(2, '0')}</span>
              <span className="section-title">{section.title_si} / {section.title_en}</span>
            </div>
            <div className="form-grid-2">
              {section.fields?.map((field: any) => {
                if (field.system_name === 'photo') return null; // Handled at the top

                if (field.depends_on) {
                  const parentVal = getFieldValueById(field.depends_on);
                  if (String(parentVal) !== String(field.depends_on_value)) {
                    return null;
                  }
                }

                const value = getFieldValue(field);
                
                return (
                  <div key={field.id} className={`form-group ${['textarea', 'image'].includes(field.field_type) ? 'form-grid-full' : ''}`}>
                    <label className="form-label">
                      {field.label_si} / {field.label_en} {field.is_required && <span style={{ color: 'red' }}>*</span>}
                    </label>

                    {['text', 'nic', 'phone'].includes(field.field_type) && (
                      <input type="text" className="form-input" value={value} onChange={e => setFieldValue(field, e.target.value)} />
                    )}

                    {field.field_type === 'number' && (
                      <input type="number" className="form-input" value={value} onChange={e => setFieldValue(field, e.target.value)} />
                    )}

                    {['date', 'autocalc_65'].includes(field.field_type) && (
                      <input type="date" className="form-input" value={value} onChange={e => setFieldValue(field, e.target.value)} readOnly={field.field_type === 'autocalc_65'} style={field.field_type === 'autocalc_65' ? { backgroundColor: 'var(--bg-color)', cursor: 'not-allowed' } : {}} />
                    )}

                    {field.field_type === 'textarea' && (
                      <textarea className="form-textarea" value={value} onChange={e => setFieldValue(field, e.target.value)} />
                    )}

                    {field.field_type === 'select' && (
                      <select className="form-select" value={value} onChange={e => setFieldValue(field, e.target.value)}>
                        <option value="">{t('form.select')}</option>
                        {field.system_name === 'gn_division' && gnDivisions.map(gn => <option key={gn.id} value={gn.id}>{gn.name}</option>)}
                        {field.system_name === 'firearm_type' && firearmTypes.map(ft => <option key={ft.id} value={ft.id}>{ft.name_si}</option>)}
                        {!field.system_name && field.options && field.options.map((opt: string, i: number) => <option key={i} value={opt}>{opt}</option>)}
                      </select>
                    )}

                    {field.field_type === 'radio' && field.options && (
                      <div className="radio-group" style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                        {field.options.map((opt: string, i: number) => (
                          <label key={i} className="radio-option" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input type="radio" name={`field_${field.id}`} checked={value === opt} onChange={() => setFieldValue(field, opt)} /> {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {field.field_type === 'boolean' && (
                      <div className="radio-group" style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                        <label className="radio-option" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input type="radio" name={`field_${field.id}`} checked={value === true || value === 'true'} onChange={() => setFieldValue(field, true)} /> {t('form.yes')}
                        </label>
                        <label className="radio-option" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input type="radio" name={`field_${field.id}`} checked={value === false || value === 'false'} onChange={() => setFieldValue(field, false)} /> {t('form.no')}
                        </label>
                      </div>
                    )}

                    {field.field_type === 'checkbox' && field.options && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                        {field.options.map((opt: string, i: number) => {
                          const isChecked = Array.isArray(value) && value.includes(opt);
                          return (
                            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input type="checkbox" checked={isChecked} onChange={(e) => {
                                const currentArr = Array.isArray(value) ? value : [];
                                if (e.target.checked) setFieldValue(field, [...currentArr, opt]);
                                else setFieldValue(field, currentArr.filter((v: any) => v !== opt));
                              }} /> {opt}
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {field.system_name && errors[field.system_name] && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors[field.system_name]}</span>}
                  </div>
                );
              })}
            </div>

            {/* Special injections for complex blocks */}
            {section.title_en === 'Firearm and License Information' && (
              <div className="form-group form-grid-full" style={{ marginTop: '20px' }}>
                <label className="form-label">{t('form.renewal')}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                  {(Array.isArray(renewalYears) ? renewalYears : []).map(ry => {
                    const yearStr = String(ry.year);
                    const isRenewed = renewalHistory[yearStr]?.renewed ?? false;
                    const reason = renewalHistory[yearStr]?.reason ?? '';
                    return (
                      <div key={ry.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isRenewed}
                            onChange={(e) => {
                              setRenewalHistory(prev => ({
                                ...prev,
                                [yearStr]: { ...prev[yearStr], renewed: e.target.checked, reason: e.target.checked ? '' : prev[yearStr]?.reason || '' }
                              }));
                            }}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                          />
                          {ry.year}
                        </label>
                        {!isRenewed && (
                          <div style={{ marginLeft: '32px' }}>
                            <input
                              type="text"
                              className="form-input"
                              value={reason}
                              onChange={(e) => {
                                setRenewalHistory(prev => ({
                                  ...prev,
                                  [yearStr]: { ...prev[yearStr], renewed: false, reason: e.target.value }
                                }));
                              }}
                              placeholder={t('form.reasonPlaceholder')}
                              style={{ maxWidth: '100%', borderColor: 'var(--danger-color)' }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {section.title_en === 'Current Status and Other Information' && (
              <div className="form-grid-2" style={{ marginTop: '20px' }}>
                <div className="form-group form-grid-full">
                  <label className="form-label">{t('form.currentStatus')}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                    {['deceased', 'transferred', 'other'].map(statusKey => {
                      const info = currentStatusInfo[statusKey as keyof typeof currentStatusInfo];
                      return (
                        <div key={statusKey} style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px', backgroundColor: info.selected ? 'rgba(153, 27, 27, 0.05)' : 'transparent' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: info.selected ? '600' : '400', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={info.selected}
                              onChange={(e) => {
                                setCurrentStatusInfo(prev => ({
                                  ...prev,
                                  [statusKey]: { ...prev[statusKey as keyof typeof currentStatusInfo], selected: e.target.checked }
                                }));
                              }}
                              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--state-maroon)' }}
                            />
                            {t(`status.${statusKey}`)}
                          </label>
                          {info.selected && (
                            <div style={{ display: 'grid', gridTemplateColumns: statusKey === 'deceased' ? '1fr' : '1fr 2fr', gap: '16px', marginTop: '12px', marginLeft: '32px' }}>
                              {statusKey !== 'deceased' && (
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="form-label" style={{ fontSize: '13px' }}>{t('form.statusModificationDate')}</label>
                                  <input
                                    type="date"
                                    className="form-input"
                                    value={info.date}
                                    onChange={(e) => {
                                      setCurrentStatusInfo(prev => ({
                                        ...prev,
                                        [statusKey]: { ...prev[statusKey as keyof typeof currentStatusInfo], date: e.target.value }
                                      }));
                                    }}
                                  />
                                </div>
                              )}
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: '13px' }}>{t('form.statusReason')}</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={info.reason}
                                  onChange={(e) => {
                                    setCurrentStatusInfo(prev => ({
                                      ...prev,
                                      [statusKey]: { ...prev[statusKey as keyof typeof currentStatusInfo], reason: e.target.value }
                                    }));
                                  }}
                                  placeholder={t('form.reasonPlaceholder')}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

</form>
    </div>
  );
};

export default RecordForm;
