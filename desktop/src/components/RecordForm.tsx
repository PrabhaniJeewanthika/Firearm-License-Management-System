import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
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

interface RecordFormProps {
  gnDivisions: GNDivision[];
  firearmTypes: FirearmType[];
  editingRecord: any | null;
  customSections: any[];
  renewalYears?: any[];
  onSaveSuccess: () => void;
  onCancelEdit: () => void;
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

const RecordForm: React.FC<RecordFormProps> = ({
  gnDivisions,
  firearmTypes,
  editingRecord,
  customSections,
  renewalYears,
  onSaveSuccess,
  onCancelEdit,
}) => {
  // Form State
  const { t, i18n } = useTranslation();
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
    deceased: { selected: false, reason: '', date: '' },
    transferred: { selected: false, reason: '', date: '' },
    other: { selected: false, reason: '', date: '' }
  });

  const [currentStatus, setCurrentStatus] = useState('active');
  const [statusDate, setStatusDate] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');

  const [transferDate, setTransferDate] = useState('');
  const [previousHolder, setPreviousHolder] = useState('');
  const [newHolderReference, setNewHolderReference] = useState('');
  const [transferDetails, setTransferDetails] = useState('');

  const [specialInformation, setSpecialInformation] = useState('');

  const [outsideAreaHolder, setOutsideAreaHolder] = useState(false);
  const [outsideResidentialAddress, setOutsideResidentialAddress] = useState('');
  const [landLocationDetails, setLandLocationDetails] = useState('');

  // Attachments state
  interface AttachmentRow {
    id?: number;           // existing attachment id (edit mode)
    name: string;          // user-typed display name
    file: File | null;     // newly selected file
    existingUrl?: string;  // URL of already-saved file
    existingFileName?: string; // original filename on server
    markedForDelete: boolean;
  }
  const [attachments, setAttachments] = useState<AttachmentRow[]>([]);

  // Dynamic Custom Fields State
  const [customData, setCustomData] = useState<Record<string, any>>({});

  // Image Upload State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentFileRefs = useRef<(HTMLInputElement | null)[]>([]);

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

      setCurrentStatusInfo(editingRecord.current_status_info || {
        deceased: { selected: false, reason: '', date: '' },
        transferred: { selected: false, reason: '', date: '' },
        other: { selected: false, reason: '', date: '' }
      });
      setCurrentStatus(editingRecord.current_status || 'active');
      setStatusDate(editingRecord.status_date || '');
      setStatusRemarks(editingRecord.status_remarks || '');

      setTransferDate(editingRecord.transfer_date || '');
      setPreviousHolder(editingRecord.previous_holder || '');
      setNewHolderReference(editingRecord.new_holder_reference || '');
      setTransferDetails(editingRecord.transfer_details || '');

      setSpecialInformation(editingRecord.special_information || '');

      setOutsideAreaHolder(editingRecord.outside_area_holder || false);
      setOutsideResidentialAddress(editingRecord.outside_residential_address || '');
      setLandLocationDetails(editingRecord.land_location_details || '');

      // Load existing attachments
      const existingAtts: AttachmentRow[] = (editingRecord.attachments || []).map((att: any) => ({
        id: att.id,
        name: att.file_name,
        file: null,
        existingUrl: att.file_url,
        existingFileName: att.file_name,
        markedForDelete: false,
      }));
      setAttachments(existingAtts);

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

  // Real-time calculation of 70th birthday
  useEffect(() => {
    if (dateOfBirth) {
      const parts = dateOfBirth.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        setSixtyFifthBirthday(`${year + 70}-${parts[1]}-${parts[2]}`);
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
      newErrors.telephone = t('errors.telephone');
    }

    // DOB future date validation
    if (dateOfBirth) {
      const dobDate = new Date(dateOfBirth);
      const today = new Date();
      if (dobDate > today) {
        newErrors.date_of_birth = t('errors.dobFuture');
      }
    } else {
      newErrors.date_of_birth = t('errors.dob');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = (askConfirmation = true) => {
    if (askConfirmation && (fullName || nic || firearmNumber || photoPreview)) {
      const confirmClear = window.confirm(t('confirm.discard'));
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
      deceased: { selected: false, reason: '', date: '' },
      transferred: { selected: false, reason: '', date: '' },
      other: { selected: false, reason: '', date: '' }
    });
    setCurrentStatus('active');
    setStatusDate('');
    setStatusRemarks('');
    setTransferDate('');
    setPreviousHolder('');
    setNewHolderReference('');
    setTransferDetails('');
    setSpecialInformation('');
    setOutsideAreaHolder(false);
    setOutsideResidentialAddress('');
    setLandLocationDetails('');
    setAttachments([]);
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

    const actionText = editingRecord ? t('confirm.update') : t('confirm.save');
    if (!window.confirm(`${actionText} ${t('confirm.areYouSure')}`)) {
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
    formData.append('current_status', currentStatus);
    formData.append('status_date', statusDate || '');
    formData.append('status_remarks', statusRemarks);
    formData.append('transfer_date', transferDate || '');
    formData.append('previous_holder', previousHolder);
    formData.append('new_holder_reference', newHolderReference);
    formData.append('transfer_details', transferDetails);
    formData.append('special_information', specialInformation);
    formData.append('outside_area_holder', String(outsideAreaHolder));
    formData.append('outside_residential_address', outsideResidentialAddress);
    formData.append('land_location_details', landLocationDetails);
    formData.append('custom_data', JSON.stringify(customData));

    // Handle attachments: deletions + new uploads
    const deleteIds = attachments
      .filter(a => a.markedForDelete && a.id)
      .map(a => a.id)
      .join(',');
    if (deleteIds) formData.append('delete_attachment_ids', deleteIds);

    let attIdx = 0;
    attachments.forEach(a => {
      if (a.markedForDelete) return;
      if (a.file) {
        formData.append(`attachment_file_${attIdx}`, a.file);
        formData.append(`attachment_name_${attIdx}`, a.name);
        attIdx++;
      }
    });

    try {
      if (editingRecord) {
        await api.put(`/records/${editingRecord.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitSuccess(t('toast.updateSuccess'));
        setTimeout(() => {
          onSaveSuccess();
        }, 1000);
      } else {
        await api.post('/records/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitSuccess(t('toast.saveSuccess'));
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
          setSubmitError(t('toast.nicExists'));
        } else if (data.firearm_number) {
          setSubmitError(t('toast.firearmExists'));
        } else {
          setSubmitError(t('toast.saveFailed'));
        }
      } else {
        setSubmitError(t('toast.networkError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" ref={formRef}>
      <div className="card-header-area">
        <div className="card-title">
          {editingRecord ? t('form.editRecordTitle') : t('form.newRecordTitle')}
        </div>
        <div className="card-subtitle">{t('form.mandatoryInfo')}</div>
      </div>

      {submitError && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', fontWeight: '500' }}>
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', fontWeight: '500' }}>
          {submitSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Helper function to get field config */}
        {(() => {
          const getF = (sysName: string) => {
            for (const sec of customSections || []) {
              const f = sec.fields?.find((field: any) => field.system_name === sysName);
              if (f) return f;
            }
            return null;
          };

          const fPhoto = getF('photo');
          const fFullName = getF('full_name');
          const fNic = getF('nic');
          const fTel = getF('telephone');
          const fWa = getF('whatsapp_number');
          const fAddr = getF('address');
          const fGn = getF('gn_division');
          
          const fDob = getF('date_of_birth');
          const f65 = getF('sixty_fifth_birthday');
          
          const fFtype = getF('firearm_type');
          const fFnum = getF('firearm_number');
          const fFyear = getF('first_licensed_year');
          const fRenew = getF('renewal_history');

          const fStatus = getF('current_status_info');
          const fSpecial = getF('special_information');
          const fOutside = getF('outside_area_holder');
          const fOutAddr = getF('outside_residential_address');
          const fOutLand = getF('land_location_details');

          return (
            <>
        {/* Section 1: Personal Details */}
        <div className="form-section-header">
          <span className="section-num">01</span>
          <span className="section-title">{t('form.personalInfo')}</span>
        </div>

        {/* Photo Upload Section */}
        {fPhoto && (
        <div className="form-group">
          <label className="form-label">{t('form.photoLabel')}</label>
          <div className="photo-uploader">
            {photoPreview ? (
              <img src={getImageUrl(photoPreview) || undefined} alt="Preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder" style={{ fontSize: '24px' }}>
                📷
                <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold' }}>IMAGE</span>
              </div>
            )}
            <div className="photo-controls">
              <input
                type="file"
                accept="image/*"
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
                {photoPreview ? t('form.changePhoto') : t('form.selectPhoto')}
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
        )}

        <div className="form-grid-2">
          {fFullName && (
          <div className="form-group form-grid-full">
            <label className="form-label">{t('form.fullName').replace(' *', '')} {fFullName.is_required ? '*' : ''}</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('form.fullName').replace(' *', '')}
            />
            {errors.full_name && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.full_name}</span>}
          </div>
          )}

          {fNic && (
          <div className="form-group">
            <label className="form-label">{t('form.nic').replace(' *', '')} {fNic.is_required ? '*' : ''}</label>
            <input
              type="text"
              className="form-input"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              placeholder="XXXXXXXXXV / XXXXXXXXXXXX"
            />
            {errors.nic && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.nic}</span>}
          </div>
          )}

          {fTel && (
          <div className="form-group">
            <label className="form-label">{t('form.telephone')} {fTel.is_required ? '*' : ''}</label>
            <input
              type="text"
              className="form-input"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="07X XXXXXXX"
            />
            {errors.telephone && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.telephone}</span>}
          </div>
          )}

          {fWa && (
          <div className="form-group">
            <label className="form-label">{t('form.whatsapp')} {fWa.is_required ? '*' : ''}</label>
            <input
              type="text"
              className="form-input"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="07X XXXXXXX"
            />
          </div>
          )}

          {fAddr && (
          <div className="form-group form-grid-full">
            <label className="form-label">{t('form.address')} {fAddr.is_required ? '*' : ''}</label>
            <textarea
              className="form-textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('form.address')}
            />
          </div>
          )}

          {fGn && (
          <div className="form-group">
            <label className="form-label">{t('form.gnDivision').replace(' *', '')} {fGn.is_required ? '*' : ''}</label>
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
          )}
        </div>

        {/* Section 2: Birthdate and Age */}
        <div className="form-section-header">
          <span className="section-num">02</span>
          <span className="section-title">{t('form.section2')}</span>
        </div>
        
        <div className="form-grid-2">
          {fDob && (
          <div className="form-group">
            <label className="form-label">{t('form.dob').replace(' *', '')} {fDob.is_required ? '*' : ''}</label>
            <input
              type="date"
              className="form-input"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            {errors.date_of_birth && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.date_of_birth}</span>}
          </div>
          )}

          {f65 && (
          <div className="form-group">
            <label className="form-label">{t('form.age65')} {f65.is_required ? '*' : ''}</label>
            <input
              type="date"
              className="form-input"
              value={sixtyFifthBirthday}
              readOnly
              style={{ backgroundColor: '#ffffff', cursor: 'not-allowed' }}
            />
            <span className="sub-text">{t('form.ageHint')}</span>
          </div>
          )}
        </div>

        {/* Section 3: Firearm and License Info */}
        <div className="form-section-header">
          <span className="section-num">03</span>
          <span className="section-title">{t('form.section3')}</span>
        </div>
        
        <div className="form-grid-2">
          {fFtype && (
          <div className="form-group">
            <label className="form-label">{t('form.firearmType').replace(' *', '')} {fFtype.is_required ? '*' : ''}</label>
            <select
              className="form-select"
              value={firearmType}
              onChange={(e) => setFirearmType(e.target.value)}
            >
              <option value="">{t('form.select')}</option>
              {firearmTypes.map((ft) => (
                <option key={ft.id} value={ft.id}>
                  {i18n.language === 'en' ? ft.name_en : ft.name_si}
                </option>
              ))}
            </select>
            {errors.firearm_type && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.firearm_type}</span>}
          </div>
          )}

          {fFnum && (
          <div className="form-group">
            <label className="form-label">{t('form.firearmNumber').replace(' *', '')} {fFnum.is_required ? '*' : ''}</label>
            <input
              type="text"
              className="form-input"
              value={firearmNumber}
              onChange={(e) => setFirearmNumber(e.target.value)}
              placeholder={t('form.firearmNumberPlaceholder')}
            />
            {errors.firearm_number && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.firearm_number}</span>}
          </div>
          )}

          {fFyear && (
          <div className="form-group">
            <label className="form-label">{t('form.firstLicenseYear')} {fFyear.is_required ? '*' : ''}</label>
            <input
              type="number"
              className="form-input"
              value={firstLicensedYear}
              onChange={(e) => setFirstLicensedYear(e.target.value)}
              placeholder="YYYY"
            />
          </div>
          )}

          {fRenew && (
          <div className="form-group form-grid-full">
            <label className="form-label" style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{t('form.renewal').replace(' *', '')} {fRenew.is_required ? '*' : ''}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {(renewalYears && renewalYears.length > 0 ? renewalYears.map(ry => ry.year) : [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]).map(year => {
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
                          style={{ maxWidth: '400px', backgroundColor: '#ffffff' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>

        {/* Section 4: Current Status and Other Info */}
        <div className="form-section-header">
          <span className="section-num">04</span>
          <span className="section-title">{t('form.currentStatusSection')}</span>
        </div>

        <div className="form-grid-2">
          {fStatus && (
          <div className="form-group form-grid-full">
            <label className="form-label">{t('form.currentStatus')} {fStatus.is_required ? '*' : ''}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {['deceased', 'transferred', 'other'].map(statusKey => {
                const info = currentStatusInfo[statusKey as keyof typeof currentStatusInfo];
                const labels: any = {
                  deceased: t('status.deceased'),
                  transferred: t('status.transferred'),
                  other: t('status.other')
                };
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
                      {labels[statusKey]}
                    </label>
                    {info.selected && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginTop: '12px', marginLeft: '32px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">{t('form.statusDate')}</label>
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
                          <label className="form-label">{t('form.statusRemarks')}</label>
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
                            placeholder={t('form.detailsPlaceholder')}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}


          {fSpecial && (
          <div className="form-group form-grid-full">
            <label className="form-label">{t('form.specialInfo')} {fSpecial.is_required ? '*' : ''}</label>
            <textarea
              className="form-textarea"
              value={specialInformation}
              onChange={(e) => setSpecialInformation(e.target.value)}
              placeholder={t('form.specialInfo')}
            />
          </div>
          )}

          {/* Attachments Section */}
          <div className="form-group form-grid-full">
            <label className="form-label" style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
              📎 {t('form.attachmentsSection')}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {attachments.map((att, idx) => {
                if (att.markedForDelete) return null;
                return (
                  <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        📎 {t('form.attachmentsSection')} {attachments.filter(a => !a.markedForDelete).indexOf(att) + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachments(prev => prev.map((a, i) => i === idx ? { ...a, markedForDelete: true } : a));
                        }}
                        style={{ background: 'none', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '4px', padding: '2px 10px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        {t('form.removeAttachment')}
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{t('form.attachmentName')}</label>
                        <input
                          type="text"
                          className="form-input"
                          value={att.name}
                          onChange={(e) => setAttachments(prev => prev.map((a, i) => i === idx ? { ...a, name: e.target.value } : a))}
                          placeholder={t('form.attachmentNamePlaceholder')}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{t('form.attachmentFile')}</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            type="file"
                            accept="*/*"
                            ref={el => { attachmentFileRefs.current[idx] = el; }}
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              setAttachments(prev => prev.map((a, i) => i === idx ? { ...a, file: f } : a));
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => attachmentFileRefs.current[idx]?.click()}
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            {att.file ? t('form.attachmentFileChange') : att.existingUrl ? t('form.attachmentFileChange') : t('form.attachmentFile')}
                          </button>
                          {att.file && (
                            <span style={{ fontSize: '12px', color: '#166534', fontWeight: '500' }}>✓ {att.file.name}</span>
                          )}
                          {!att.file && att.existingUrl && (
                            <a
                              href={att.existingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '12px', color: 'var(--primary-color)', textDecoration: 'underline' }}
                            >
                              📄 {t('form.attachmentExisting')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => setAttachments(prev => [...prev, { name: '', file: null, markedForDelete: false }])}
                style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--primary-color)',
                  fontWeight: '600',
                  width: '100%',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f9ff')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {t('form.addAttachment')}
              </button>
            </div>
          </div>

          {fOutside && (
          <div className="form-group form-grid-full">
            <label className="form-label">
              {t('form.outsideResident')} {fOutside.is_required ? '*' : ''}
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
          )}
        </div>

        {outsideAreaHolder && (
          <div className="form-grid-2" style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            {fOutAddr && (
            <div className="form-group form-grid-full">
              <label className="form-label">{t('form.outsideAddress')} {fOutAddr.is_required ? '*' : ''}</label>
              <textarea
                className="form-textarea"
                value={outsideResidentialAddress}
                onChange={(e) => setOutsideResidentialAddress(e.target.value)}
                placeholder={t('form.currentAddressPlaceholder')}
              />
            </div>
            )}
            {fOutLand && (
            <div className="form-group form-grid-full">
              <label className="form-label">{t('form.landDetails')} {fOutLand.is_required ? '*' : ''}</label>
              <textarea
                className="form-textarea"
                value={landLocationDetails}
                onChange={(e) => setLandLocationDetails(e.target.value)}
                placeholder={t('form.landDetailsPlaceholder')}
              />
            </div>
            )}
          </div>
        )}

            {/* Completely Dynamic Custom Fields render here if needed */}
            {customSections && customSections.map((section: any, idx: number) => {
              const customFields = section.fields?.filter((f: any) => !f.system_name);
              if (!customFields || customFields.length === 0) return null;
              
              return (
                <div key={`custom-section-${section.id}`} style={{ marginTop: '20px' }}>
                  {idx > 3 && (
                    <div className="form-section-header">
                      <span className="section-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="section-title">{section.title_si}</span>
                    </div>
                  )}
                  <div className="form-grid-2" style={{ padding: idx > 3 ? '0' : '20px', border: idx > 3 ? 'none' : '1px dashed #cbd5e1', borderRadius: '8px', marginTop: '10px' }}>
                    {customFields.map((field: any) => (
                      <div key={field.id} className="form-group">
                        <label className="form-label">{i18n.language === 'en' ? field.label_en : field.label_si} {field.is_required ? '*' : ''}</label>
                        {field.field_type === 'textarea' ? (
                          <textarea
                            className="form-textarea"
                            value={customData[field.id] || ''}
                            onChange={(e) => setCustomData({...customData, [field.id]: e.target.value})}
                          />
                        ) : field.field_type === 'boolean' ? (
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <label><input type="radio" checked={customData[field.id] === true} onChange={() => setCustomData({...customData, [field.id]: true})} /> {t('form.yes')}</label>
                            <label><input type="radio" checked={customData[field.id] === false} onChange={() => setCustomData({...customData, [field.id]: false})} /> {t('form.no')}</label>
                          </div>
                        ) : field.field_type === 'select' ? (
                          <select
                            className="form-select"
                            value={customData[field.id] || ''}
                            onChange={(e) => setCustomData({...customData, [field.id]: e.target.value})}
                          >
                            <option value="">{t('form.selectEmpty')}</option>
                            {(Array.isArray(field.options) ? field.options : []).map((opt: string, i: number) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.field_type === 'radio' ? (
                          <div className="radio-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {(Array.isArray(field.options) ? field.options : []).map((opt: string, i: number) => (
                              <label key={i} className="radio-option">
                                <input
                                  type="radio"
                                  name={`custom_radio_${field.id}`}
                                  value={opt}
                                  checked={customData[field.id] === opt}
                                  onChange={() => setCustomData({...customData, [field.id]: opt})}
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        ) : field.field_type === 'checkbox' ? (
                          <div className="checkbox-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {(Array.isArray(field.options) ? field.options : []).map((opt: string, i: number) => {
                              const currentVals = Array.isArray(customData[field.id]) ? customData[field.id] : [];
                              return (
                                <label key={i} className="radio-option">
                                  <input
                                    type="checkbox"
                                    value={opt}
                                    checked={currentVals.includes(opt)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setCustomData({...customData, [field.id]: [...currentVals, opt]});
                                      } else {
                                        setCustomData({...customData, [field.id]: currentVals.filter((v: string) => v !== opt)});
                                      }
                                    }}
                                  />
                                  {opt}
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <input
                            type={field.field_type === 'number' ? 'number' : 'text'}
                            className="form-input"
                            value={customData[field.id] || ''}
                            onChange={(e) => setCustomData({...customData, [field.id]: e.target.value})}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            </>
          );
        })()}

        {/* Action Buttons */}
        <div className="btn-group">
          {editingRecord ? (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelEdit}
              >
                {t('form.cancelEdit')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('form.updating') : t('form.updateRecord')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => resetForm(true)}
              >
                {t('form.delete')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('form.saving') : t('form.saveRecord')}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecordForm;
