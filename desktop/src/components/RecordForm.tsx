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
  editingRecord: any | null;
  onSaveSuccess: () => void;
  onCancelEdit: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({
  gnDivisions,
  firearmTypes,
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

  // Image Upload State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        <div className="form-grid-2">
          <div className="form-group form-grid-full">
            <label className="form-label">{t('form.fullName')}</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.full_name && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('form.nic')}</label>
            <input
              type="text"
              className="form-input"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              placeholder="XXXXXXXXXV / XXXXXXXXXXXX"
            />
            {errors.nic && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.nic}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('form.telephone')}</label>
            <input
              type="text"
              className="form-input"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="07X XXXXXXX"
            />
            {errors.telephone && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.telephone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('form.whatsapp')}</label>
            <input
              type="text"
              className="form-input"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="07X XXXXXXX"
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">{t('form.address')}</label>
            <textarea
              className="form-textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('form.gnDivision')}</label>
            <select
              className="form-select"
              value={gnDivision}
              onChange={(e) => setGnDivision(e.target.value)}
            >
              <option value="">{t('form.select')}</option>
              {gnDivisions.map((gn) => (
                <option key={gn.id} value={gn.id}>
                  {gn.name}
                </option>
              ))}
            </select>
            {errors.gn_division && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.gn_division}</span>}
          </div>
        </div>

        {/* Section 2: Birthdate and Age */}
        <div className="form-section-header">
          <span className="section-num">02</span>
          <span className="section-title">{t('form.section2').replace('02 ', '')}</span>
        </div>
        
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">{t('form.dob')}</label>
            <input
              type="date"
              className="form-input"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            {errors.date_of_birth && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.date_of_birth}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('form.age65')}</label>
            <input
              type="date"
              className="form-input"
              value={sixtyFifthBirthday}
              readOnly
              style={{ backgroundColor: 'var(--bg-color)', cursor: 'not-allowed', fontWeight: '600', color: 'var(--state-maroon)' }}
            />
            <span className="sub-text">{t('form.ageHint')}</span>
          </div>
        </div>

        {/* Section 3: Firearm and License Info */}
        <div className="form-section-header">
          <span className="section-num">03</span>
          <span className="section-title">{t('form.section3').replace('03 ', '')}</span>
        </div>
        
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">{t('form.firearmType')}</label>
            <select
              className="form-select"
              value={firearmType}
              onChange={(e) => setFirearmType(e.target.value)}
            >
            <option value="">{t('form.select')}</option>
              {firearmTypes.map((ft) => (
                <option key={ft.id} value={ft.id}>
                  {ft.name_si}
                </option>
              ))}
            </select>
            {errors.firearm_type && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.firearm_type}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('form.firearmNumber')}</label>
            <input
              type="text"
              className="form-input"
              value={firearmNumber}
              onChange={(e) => setFirearmNumber(e.target.value)}
            />
            {errors.firearm_number && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.firearm_number}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('form.firstLicenseYear')}</label>
            <input
              type="number"
              className="form-input"
              value={firstLicensedYear}
              onChange={(e) => setFirstLicensedYear(e.target.value)}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">{t('form.renewal')}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => {
                const yearStr = String(year);
                const isRenewed = renewalHistory[yearStr]?.renewed ?? false;
                const reason = renewalHistory[yearStr]?.reason ?? '';
                return (
                  <div key={year} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                      {year}
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
        </div>

        {/* Section 4: Current Status and Other Info */}
        <div className="form-section-header">
          <span className="section-num">04</span>
          <span className="section-title">{t('form.section4').replace('04 ', '')}</span>
        </div>

        <div className="form-grid-2">
          <div className="form-group form-grid-full">
            <label className="form-label">{t('form.currentStatus')}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {['deceased', 'transferred', 'other'].map((statusKey) => {
                const info = currentStatusInfo[statusKey as keyof typeof currentStatusInfo];
                return (
                  <div key={statusKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', cursor: 'pointer', fontWeight: '600', color: 'var(--text-main)' }}>
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
                    {info.selected && statusKey !== 'deceased' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginTop: '12px', marginLeft: '32px' }}>
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

          <div className="form-group form-grid-full">
            <label className="form-label">{t('form.specialInfo')}</label>
            <textarea
              className="form-textarea"
              value={specialInformation}
              onChange={(e) => setSpecialInformation(e.target.value)}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">
              {t('form.outsideResident')}
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="outsideArea"
                  checked={outsideAreaHolder === true}
                  onChange={() => setOutsideAreaHolder(true)}
                />
                {t('form.yes')}
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="outsideArea"
                  checked={outsideAreaHolder === false}
                  onChange={() => setOutsideAreaHolder(false)}
                />
                {t('form.no')}
              </label>
            </div>
          </div>
        </div>

        {outsideAreaHolder && (
          <div className="form-grid-2" style={{ backgroundColor: 'var(--bg-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <div className="form-group form-grid-full">
              <label className="form-label">{t('form.outsideAddress')}</label>
              <textarea
                className="form-textarea"
                value={outsideResidentialAddress}
                onChange={(e) => setOutsideResidentialAddress(e.target.value)}
              />
            </div>
            <div className="form-group form-grid-full">
              <label className="form-label">{t('form.landDetails')}</label>
              <textarea
                className="form-textarea"
                value={landLocationDetails}
                onChange={(e) => setLandLocationDetails(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="btn-group">
          {editingRecord ? (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelEdit}
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('actions.updating') : t('actions.update')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => resetForm(true)}
              >
                {t('actions.clear')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('actions.saving') : t('actions.save')}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecordForm;
