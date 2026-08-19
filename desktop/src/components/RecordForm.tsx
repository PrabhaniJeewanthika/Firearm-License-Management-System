import React, { useState, useEffect, useRef } from 'react';
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

    if (!fullName.trim()) newErrors.full_name = 'සම්පූර්ණ නම ඇතුළත් කරන්න.';
    if (!nic.trim()) newErrors.nic = 'ජාතික හැඳුනුම්පත් අංකය ඇතුළත් කරන්න.';
    if (!firearmNumber.trim()) newErrors.firearm_number = 'ගිනිඅවි අංකය ඇතුළත් කරන්න.';
    if (!gnDivision) newErrors.gn_division = 'ග්‍රාම නිලධාරී කොට්ඨාසය තෝරන්න.';
    if (!firearmType) newErrors.firearm_type = 'ගිනිඅවි වර්ගය තෝරන්න.';

    // Phone validation (SL format: 07XXXXXXXX)
    const phoneRegex = /^(?:0)\d{9}$/;
    if (telephone && !phoneRegex.test(telephone)) {
      newErrors.telephone = 'වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න. (උදා: 0771234567)';
    }

    // DOB future date validation
    if (dateOfBirth) {
      const dobDate = new Date(dateOfBirth);
      const today = new Date();
      if (dobDate > today) {
        newErrors.date_of_birth = 'උපන්දිනය අනාගත දිනයක් විය නොහැක.';
      }
    } else {
      newErrors.date_of_birth = 'උපන්දිනය ඇතුළත් කරන්න.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = (askConfirmation = true) => {
    if (askConfirmation && (fullName || nic || firearmNumber || photoPreview)) {
      const confirmClear = window.confirm('සුරැකී නොමැති වෙනස්කම් ඉවත් කිරීමට ඔබට විශ්වාසද?');
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

    try {
      if (editingRecord) {
        await api.put(`/records/${editingRecord.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitSuccess('වාර්තාව සාර්ථකව යාවත්කාලීන කරන ලදී.');
        setTimeout(() => {
          onSaveSuccess();
        }, 1000);
      } else {
        await api.post('/records/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitSuccess('වාර්තාව සාර්ථකව සුරකින ලදී.');
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
          setSubmitError('මෙම NIC අංකය දැනටමත් පද්ධතියේ ඇත.');
        } else if (data.firearm_number) {
          setSubmitError('මෙම ගිනිඅවි අංකය දැනටමත් පද්ධතියේ ඇත.');
        } else {
          setSubmitError('වාර්තාව සුරැකීමට නොහැකි විය. නැවත උත්සාහ කරන්න.');
        }
      } else {
        setSubmitError('දත්ත සේවාව සමඟ සම්බන්ධ වීමට නොහැකි විය.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" ref={formRef}>
      <div className="card-header-area">
        <div className="card-title">
          {editingRecord ? '01 වාර්තාව සංස්කරණය' : '01 නව බලපත්‍රලාභී වාර්තාව'}
        </div>
        <div className="card-subtitle">* ලකුණ සහිත තොරතුරු අනිවාර්යයි</div>
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
        
        {/* Section 1: Personal Details */}
        <div className="form-section-header">
          <span className="section-num">01</span>
          <span className="section-title">පුද්ගලික තොරතුරු (Personal Information)</span>
        </div>

        {/* Photo Upload Section */}
        <div className="form-group">
          <label className="form-label">ඡායාරූපය ඇතුළත් කරන්න (JPG / PNG)</label>
          <div className="photo-uploader">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder" style={{ fontSize: '24px' }}>
                📷
                <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold' }}>JPG / PNG</span>
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
                {photoPreview ? 'ඡායාරූපය වෙනස් කරන්න' : 'ඡායාරූපයක් තෝරන්න'}
              </button>
              {photoPreview && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={removePhoto}
                  style={{ padding: '6px 12px', fontSize: '12px', marginTop: '4px' }}
                >
                  ඡායාරූපය ඉවත් කරන්න
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group form-grid-full">
            <label className="form-label">සම්පූර්ණ නම *</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="උදා: කේ. ඒ. පෙරේරා"
            />
            {errors.full_name && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">ජාතික හැඳුනුම්පත් අංකය *</label>
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
            <label className="form-label">දුරකථන අංකය</label>
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
            <label className="form-label">වට්ස්ඇප් අංකය (WhatsApp)</label>
            <input
              type="text"
              className="form-input"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="07X XXXXXXX"
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">ලිපිනය</label>
            <textarea
              className="form-textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="සම්පූර්ණ ලිපිනය ඇතුළත් කරන්න"
            />
          </div>

          <div className="form-group">
            <label className="form-label">ග්‍රාම නිලධාරී කොට්ඨාසය *</label>
            <select
              className="form-select"
              value={gnDivision}
              onChange={(e) => setGnDivision(e.target.value)}
            >
              <option value="">තෝරන්න</option>
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
          <span className="section-title">උපන්දිනය සහ වයස් තොරතුරු (DOB & Age Info)</span>
        </div>
        
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">උපන්දිනය *</label>
            <input
              type="date"
              className="form-input"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            {errors.date_of_birth && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.date_of_birth}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">අවුරුදු 65 සම්පූර්ණ වන දිනය</label>
            <input
              type="date"
              className="form-input"
              value={sixtyFifthBirthday}
              readOnly
              style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed', fontWeight: 'bold', color: '#b45309' }}
            />
            <span className="sub-text">ⓘ උපන්දිනය අනුව මෙම දිනය ස්වයංක්‍රීයව ගණනය වේ.</span>
          </div>
        </div>

        {/* Section 3: Firearm and License Info */}
        <div className="form-section-header">
          <span className="section-num">03</span>
          <span className="section-title">ගිනිඅවි සහ බලපත්‍ර තොරතුරු (Firearm & License Info)</span>
        </div>
        
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">ගිනිඅවි වර්ගය *</label>
            <select
              className="form-select"
              value={firearmType}
              onChange={(e) => setFirearmType(e.target.value)}
            >
              <option value="">තෝරන්න</option>
              {firearmTypes.map((ft) => (
                <option key={ft.id} value={ft.id}>
                  {ft.name_si}
                </option>
              ))}
            </select>
            {errors.firearm_type && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.firearm_type}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">ගිනිඅවි අංකය *</label>
            <input
              type="text"
              className="form-input"
              value={firearmNumber}
              onChange={(e) => setFirearmNumber(e.target.value)}
              placeholder="ගිනිඅවි අංකය ඇතුළත් කරන්න"
            />
            {errors.firearm_number && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.firearm_number}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">මුලින්ම බලපත්‍ර ලද වර්ෂය</label>
            <input
              type="number"
              className="form-input"
              value={firstLicensedYear}
              onChange={(e) => setFirstLicensedYear(e.target.value)}
              placeholder="YYYY"
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label" style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--danger-color)' }}>බලපත්‍ර අලුත් කිරීම *</label>
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
                          placeholder="අලුත් නොකිරීමට හේතුව මෙහි ඇතුළත් කරන්න (Reason for not renewing)"
                          style={{ maxWidth: '400px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}
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
          <span className="section-title">වර්තමාන තත්ත්වය සහ වෙනත් තොරතුරු (Current Status & Other Info)</span>
        </div>

        <div className="form-grid-2">
          <div className="form-group form-grid-full">
            <label className="form-label">වර්තමාන තත්ත්වය</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {['deceased', 'transferred', 'other'].map(statusKey => {
                const info = currentStatusInfo[statusKey as keyof typeof currentStatusInfo];
                const labels: any = {
                  deceased: 'මියගොස් ඇත',
                  transferred: 'පවරා ඇත',
                  other: 'වෙනත්'
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
                      <div style={{ display: 'grid', gridTemplateColumns: statusKey === 'deceased' ? '1fr' : '1fr 2fr', gap: '16px', marginTop: '12px', marginLeft: '32px' }}>
                        {statusKey !== 'deceased' && (
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '13px' }}>තත්ත්වය වෙනස් වූ දිනය</label>
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
                          <label className="form-label" style={{ fontSize: '13px' }}>තත්ත්වය පිළිබඳ විස්තර සහ සටහන්</label>
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
                            placeholder="විස්තර ඇතුළත් කරන්න..."
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
            <label className="form-label">ගිනිඅවිය පැවරීම පිළිබඳ විස්තර</label>
            <textarea
              className="form-textarea"
              value={transferDetails}
              onChange={(e) => setTransferDetails(e.target.value)}
              placeholder="පැවරීම සම්බන්ධ නිල විස්තර සහ සටහන් ඇතුළත් කරන්න..."
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">වෙනත් විශේෂ තොරතුරු</label>
            <textarea
              className="form-textarea"
              value={specialInformation}
              onChange={(e) => setSpecialInformation(e.target.value)}
              placeholder="අවශ්‍ය වෙනත් නිල තොරතුරු මෙහි ඇතුළත් කරන්න..."
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">
              පඬුවස්නුවරින් පිටත පදිංචි, මෙම බලප්‍රදේශය තුළ ඉඩම් හිමි බලපත්‍රලාභියෙක්ද?
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="outsideArea"
                  checked={outsideAreaHolder === true}
                  onChange={() => setOutsideAreaHolder(true)}
                />
                ඔව්
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="outsideArea"
                  checked={outsideAreaHolder === false}
                  onChange={() => setOutsideAreaHolder(false)}
                />
                නැත
              </label>
            </div>
          </div>
        </div>

        {outsideAreaHolder && (
          <div className="form-grid-2" style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div className="form-group form-grid-full">
              <label className="form-label">වර්තමාන පදිංචි ලිපිනය</label>
              <textarea
                className="form-textarea"
                value={outsideResidentialAddress}
                onChange={(e) => setOutsideResidentialAddress(e.target.value)}
                placeholder="වර්තමාන පදිංචි ලිපිනය ඇතුළත් කරන්න"
              />
            </div>
            <div className="form-group form-grid-full">
              <label className="form-label">මෙම බලප්‍රදේශය තුළ ඉඩම් / ස්ථාන විස්තර</label>
              <textarea
                className="form-textarea"
                value={landLocationDetails}
                onChange={(e) => setLandLocationDetails(e.target.value)}
                placeholder="මෙම බලප්‍රදේශය තුළ පිහිටි ඉඩම් හෝ ස්ථාන විස්තර ඇතුළත් කරන්න"
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
                සංස්කරණය අවලංගු කරන්න
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'යාවත්කාලීන වෙමින් පවතී...' : '✓ වාර්තාව යාවත්කාලීන කරන්න'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => resetForm(true)}
              >
                මකන්න
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'සුරැකෙමින් පවතී...' : '✓ වාර්තාව සුරකින්න'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecordForm;
