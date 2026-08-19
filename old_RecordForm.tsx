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
  customSections: any[];
  renewalYears?: any[];
  onSaveSuccess: () => void;
  onCancelEdit: () => void;
}

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

  // Dynamic Custom Fields State
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

    if (!fullName.trim()) newErrors.full_name = 'α╖âα╢╕α╖èα╢┤α╖ûα╢╗α╖èα╢½ α╢▒α╢╕ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒.';
    if (!nic.trim()) newErrors.nic = 'α╢óα╖Åα╢¡α╖Æα╢Ü α╖äα╖Éα╢│α╖öα╢▒α╖öα╢╕α╖èα╢┤α╢¡α╖è α╢àα╢éα╢Üα╢║ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒.';
    if (!firearmNumber.trim()) newErrors.firearm_number = 'α╢£α╖Æα╢▒α╖Æα╢àα╖Çα╖Æ α╢àα╢éα╢Üα╢║ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒.';
    if (!gnDivision) newErrors.gn_division = 'α╢£α╖èΓÇìα╢╗α╖Åα╢╕ α╢▒α╖Æα╢╜α╢░α╖Åα╢╗α╖ô α╢Üα╖£α╢ºα╖èα╢¿α╖Åα╖âα╢║ α╢¡α╖¥α╢╗α╢▒α╖èα╢▒.';
    if (!firearmType) newErrors.firearm_type = 'α╢£α╖Æα╢▒α╖Æα╢àα╖Çα╖Æ α╖Çα╢╗α╖èα╢£α╢║ α╢¡α╖¥α╢╗α╢▒α╖èα╢▒.';

    // Phone validation (SL format: 07XXXXXXXX)
    const phoneRegex = /^(?:0)\d{9}$/;
    if (telephone && !phoneRegex.test(telephone)) {
      newErrors.telephone = 'α╖Çα╢╜α╢éα╢£α╖ö α╢»α╖öα╢╗α╢Üα╢«α╢▒ α╢àα╢éα╢Üα╢║α╢Üα╖è α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒. (α╢ïα╢»α╖Å: 0771234567)';
    }

    // DOB future date validation
    if (dateOfBirth) {
      const dobDate = new Date(dateOfBirth);
      const today = new Date();
      if (dobDate > today) {
        newErrors.date_of_birth = 'α╢ïα╢┤α╢▒α╖èα╢»α╖Æα╢▒α╢║ α╢àα╢▒α╖Åα╢£α╢¡ α╢»α╖Æα╢▒α╢║α╢Üα╖è α╖Çα╖Æα╢║ α╢▒α╖£α╖äα╖Éα╢Ü.';
      }
    } else {
      newErrors.date_of_birth = 'α╢ïα╢┤α╢▒α╖èα╢»α╖Æα╢▒α╢║ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = (askConfirmation = true) => {
    if (askConfirmation && (fullName || nic || firearmNumber || photoPreview)) {
      const confirmClear = window.confirm('α╖âα╖öα╢╗α╖Éα╢Üα╖ô α╢▒α╖£α╢╕α╖Éα╢¡α╖Æ α╖Çα╖Öα╢▒α╖âα╖èα╢Üα╢╕α╖è α╢ëα╖Çα╢¡α╖è α╢Üα╖Æα╢╗α╖ôα╢╕α╢º α╢öα╢╢α╢º α╖Çα╖Æα╖üα╖èα╖Çα╖Åα╖âα╢»?');
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

    try {
      if (editingRecord) {
        await api.put(`/records/${editingRecord.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitSuccess('α╖Çα╖Åα╢╗α╖èα╢¡α╖Åα╖Ç α╖âα╖Åα╢╗α╖èα╢«α╢Üα╖Ç α╢║α╖Åα╖Çα╢¡α╖èα╢Üα╖Åα╢╜α╖ôα╢▒ α╢Üα╢╗α╢▒ α╢╜α╢»α╖ô.');
        setTimeout(() => {
          onSaveSuccess();
        }, 1000);
      } else {
        await api.post('/records/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSubmitSuccess('α╖Çα╖Åα╢╗α╖èα╢¡α╖Åα╖Ç α╖âα╖Åα╢╗α╖èα╢«α╢Üα╖Ç α╖âα╖öα╢╗α╢Üα╖Æα╢▒ α╢╜α╢»α╖ô.');
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
          setSubmitError('α╢╕α╖Öα╢╕ NIC α╢àα╢éα╢Üα╢║ α╢»α╖Éα╢▒α╢ºα╢╕α╢¡α╖è α╢┤α╢»α╖èα╢░α╢¡α╖Æα╢║α╖Ü α╢çα╢¡.');
        } else if (data.firearm_number) {
          setSubmitError('α╢╕α╖Öα╢╕ α╢£α╖Æα╢▒α╖Æα╢àα╖Çα╖Æ α╢àα╢éα╢Üα╢║ α╢»α╖Éα╢▒α╢ºα╢╕α╢¡α╖è α╢┤α╢»α╖èα╢░α╢¡α╖Æα╢║α╖Ü α╢çα╢¡.');
        } else {
          setSubmitError('α╖Çα╖Åα╢╗α╖èα╢¡α╖Åα╖Ç α╖âα╖öα╢╗α╖Éα╢Üα╖ôα╢╕α╢º α╢▒α╖£α╖äα╖Éα╢Üα╖Æ α╖Çα╖Æα╢║. α╢▒α╖Éα╖Çα╢¡ α╢ïα╢¡α╖èα╖âα╖Åα╖ä α╢Üα╢╗α╢▒α╖èα╢▒.');
        }
      } else {
        setSubmitError('α╢»α╢¡α╖èα╢¡ α╖âα╖Üα╖Çα╖Åα╖Ç α╖âα╢╕α╢ƒ α╖âα╢╕α╖èα╢╢α╢▒α╖èα╢░ α╖Çα╖ôα╢╕α╢º α╢▒α╖£α╖äα╖Éα╢Üα╖Æ α╖Çα╖Æα╢║.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" ref={formRef}>
      <div className="card-header-area">
        <div className="card-title">
          {editingRecord ? '01 α╖Çα╖Åα╢╗α╖èα╢¡α╖Åα╖Ç α╖âα╢éα╖âα╖èα╢Üα╢╗α╢½α╢║' : '01 α╢▒α╖Ç α╢╢α╢╜α╢┤α╢¡α╖èΓÇìα╢╗α╢╜α╖Åα╢╖α╖ô α╖Çα╖Åα╢╗α╖èα╢¡α╖Åα╖Ç'}
        </div>
        <div className="card-subtitle">* α╢╜α╢Üα╖öα╢½ α╖âα╖äα╖Æα╢¡ α╢¡α╖£α╢╗α╢¡α╖öα╢╗α╖ö α╢àα╢▒α╖Æα╖Çα╖Åα╢╗α╖èα╢║α╢║α╖Æ</div>
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
          <span className="section-title">{(customSections && customSections.length > 0) ? customSections[0]?.title_si : 'α╢┤α╖öα╢»α╖èα╢£α╢╜α╖Æα╢Ü α╢¡α╖£α╢╗α╢¡α╖öα╢╗α╖ö (Personal Information)'}</span>
        </div>

        {/* Photo Upload Section */}
        {fPhoto && (
        <div className="form-group">
          <label className="form-label">{fPhoto.label_si} {fPhoto.is_required ? '*' : ''} (JPG / PNG)</label>
          <div className="photo-uploader">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder" style={{ fontSize: '24px' }}>
                ≡ƒô╖
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
                {photoPreview ? 'α╢íα╖Åα╢║α╖Åα╢╗α╖ûα╢┤α╢║ α╖Çα╖Öα╢▒α╖âα╖è α╢Üα╢╗α╢▒α╖èα╢▒' : 'α╢íα╖Åα╢║α╖Åα╢╗α╖ûα╢┤α╢║α╢Üα╖è α╢¡α╖¥α╢╗α╢▒α╖èα╢▒'}
              </button>
              {photoPreview && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={removePhoto}
                  style={{ padding: '6px 12px', fontSize: '12px', marginTop: '4px' }}
                >
                  α╢íα╖Åα╢║α╖Åα╢╗α╖ûα╢┤α╢║ α╢ëα╖Çα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒
                </button>
              )}
            </div>
          </div>
        </div>
        )}

        <div className="form-grid-2">
          {fFullName && (
          <div className="form-group form-grid-full">
            <label className="form-label">{fFullName.label_si} {fFullName.is_required ? '*' : ''}</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="α╢ïα╢»α╖Å: α╢Üα╖Ü. α╢Æ. α╢┤α╖Öα╢╗α╖Üα╢╗α╖Å"
            />
            {errors.full_name && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.full_name}</span>}
          </div>
          )}

          {fNic && (
          <div className="form-group">
            <label className="form-label">{fNic.label_si} {fNic.is_required ? '*' : ''}</label>
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
            <label className="form-label">{fTel.label_si} {fTel.is_required ? '*' : ''}</label>
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
            <label className="form-label">{fWa.label_si} {fWa.is_required ? '*' : ''}</label>
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
            <label className="form-label">{fAddr.label_si} {fAddr.is_required ? '*' : ''}</label>
            <textarea
              className="form-textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="α╖âα╢╕α╖èα╢┤α╖ûα╢╗α╖èα╢½ α╢╜α╖Æα╢┤α╖Æα╢▒α╢║ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒"
            />
          </div>
          )}

          {fGn && (
          <div className="form-group">
            <label className="form-label">{fGn.label_si} {fGn.is_required ? '*' : ''}</label>
            <select
              className="form-select"
              value={gnDivision}
              onChange={(e) => setGnDivision(e.target.value)}
            >
              <option value="">α╢¡α╖¥α╢╗α╢▒α╖èα╢▒</option>
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
          <span className="section-title">{(customSections && customSections.length > 1) ? customSections[1]?.title_si : 'α╢ïα╢┤α╢▒α╖èα╢»α╖Æα╢▒α╢║ α╖âα╖ä α╖Çα╢║α╖âα╖è α╢¡α╖£α╢╗α╢¡α╖öα╢╗α╖ö (DOB & Age Info)'}</span>
        </div>
        
        <div className="form-grid-2">
          {fDob && (
          <div className="form-group">
            <label className="form-label">{fDob.label_si} {fDob.is_required ? '*' : ''}</label>
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
            <label className="form-label">{f65.label_si} {f65.is_required ? '*' : ''}</label>
            <input
              type="date"
              className="form-input"
              value={sixtyFifthBirthday}
              readOnly
              style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed', fontWeight: 'bold', color: '#b45309' }}
            />
            <span className="sub-text">Γôÿ α╢ïα╢┤α╢▒α╖èα╢»α╖Æα╢▒α╢║ α╢àα╢▒α╖öα╖Ç α╢╕α╖Öα╢╕ α╢»α╖Æα╢▒α╢║ α╖âα╖èα╖Çα╢║α╢éα╢Üα╖èΓÇìα╢╗α╖ôα╢║α╖Ç α╢£α╢½α╢▒α╢║ α╖Çα╖Ü.</span>
          </div>
          )}
        </div>

        {/* Section 3: Firearm and License Info */}
        <div className="form-section-header">
          <span className="section-num">03</span>
          <span className="section-title">{(customSections && customSections.length > 2) ? customSections[2]?.title_si : 'α╢£α╖Æα╢▒α╖Æα╢àα╖Çα╖Æ α╖âα╖ä α╢╢α╢╜α╢┤α╢¡α╖èΓÇìα╢╗ α╢¡α╖£α╢╗α╢¡α╖öα╢╗α╖ö (Firearm & License Info)'}</span>
        </div>
        
        <div className="form-grid-2">
          {fFtype && (
          <div className="form-group">
            <label className="form-label">{fFtype.label_si} {fFtype.is_required ? '*' : ''}</label>
            <select
              className="form-select"
              value={firearmType}
              onChange={(e) => setFirearmType(e.target.value)}
            >
              <option value="">α╢¡α╖¥α╢╗α╢▒α╖èα╢▒</option>
              {firearmTypes.map((ft) => (
                <option key={ft.id} value={ft.id}>
                  {ft.name_si}
                </option>
              ))}
            </select>
            {errors.firearm_type && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.firearm_type}</span>}
          </div>
          )}

          {fFnum && (
          <div className="form-group">
            <label className="form-label">{fFnum.label_si} {fFnum.is_required ? '*' : ''}</label>
            <input
              type="text"
              className="form-input"
              value={firearmNumber}
              onChange={(e) => setFirearmNumber(e.target.value)}
              placeholder="α╢£α╖Æα╢▒α╖Æα╢àα╖Çα╖Æ α╢àα╢éα╢Üα╢║ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒"
            />
            {errors.firearm_number && <span style={{ color: 'var(--danger-color)', fontSize: '11px', marginTop: '4px' }}>{errors.firearm_number}</span>}
          </div>
          )}

          {fFyear && (
          <div className="form-group">
            <label className="form-label">{fFyear.label_si} {fFyear.is_required ? '*' : ''}</label>
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
            <label className="form-label" style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--danger-color)' }}>{fRenew.label_si} {fRenew.is_required ? '*' : ''}</label>
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
                          placeholder="α╢àα╢╜α╖öα╢¡α╖è α╢▒α╖£α╢Üα╖Æα╢╗α╖ôα╢╕α╢º α╖äα╖Üα╢¡α╖öα╖Ç α╢╕α╖Öα╖äα╖Æ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒ (Reason for not renewing)"
                          style={{ maxWidth: '400px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}
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
          <span className="section-title">{(customSections && customSections.length > 3) ? customSections[3]?.title_si : 'α╖Çα╢╗α╖èα╢¡α╢╕α╖Åα╢▒ α╢¡α╢¡α╖èα╢¡α╖èα╖Çα╢║ α╖âα╖ä α╖Çα╖Öα╢▒α╢¡α╖è α╢¡α╖£α╢╗α╢¡α╖öα╢╗α╖ö (Current Status & Other Info)'}</span>
        </div>

        <div className="form-grid-2">
          {fStatus && (
          <div className="form-group form-grid-full">
            <label className="form-label">{fStatus.label_si} {fStatus.is_required ? '*' : ''}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {['deceased', 'transferred', 'other'].map(statusKey => {
                const info = currentStatusInfo[statusKey as keyof typeof currentStatusInfo];
                const labels: any = {
                  deceased: 'α╢╕α╖Æα╢║α╢£α╖£α╖âα╖è α╢çα╢¡',
                  transferred: 'α╢┤α╖Çα╢╗α╖Å α╢çα╢¡',
                  other: 'α╖Çα╖Öα╢▒α╢¡α╖è'
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
                            <label className="form-label" style={{ fontSize: '13px' }}>α╢¡α╢¡α╖èα╢¡α╖èα╖Çα╢║ α╖Çα╖Öα╢▒α╖âα╖è α╖Çα╖û α╢»α╖Æα╢▒α╢║</label>
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
                          <label className="form-label" style={{ fontSize: '13px' }}>α╢¡α╢¡α╖èα╢¡α╖èα╖Çα╢║ α╢┤α╖Æα╖àα╖Æα╢╢α╢│ α╖Çα╖Æα╖âα╖èα╢¡α╢╗ α╖âα╖ä α╖âα╢ºα╖äα╢▒α╖è</label>
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
                            placeholder="α╖Çα╖Æα╖âα╖èα╢¡α╢╗ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒..."
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
            <label className="form-label">{fSpecial.label_si} {fSpecial.is_required ? '*' : ''}</label>
            <textarea
              className="form-textarea"
              value={specialInformation}
              onChange={(e) => setSpecialInformation(e.target.value)}
              placeholder="α╢àα╖Çα╖üα╖èΓÇìα╢║ α╖Çα╖Öα╢▒α╢¡α╖è α╢▒α╖Æα╢╜ α╢¡α╖£α╢╗α╢¡α╖öα╢╗α╖ö α╢╕α╖Öα╖äα╖Æ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒..."
            />
          </div>
          )}

          {fOutside && (
          <div className="form-group form-grid-full">
            <label className="form-label">
              {fOutside.label_si} {fOutside.is_required ? '*' : ''}
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="outsideArea"
                  checked={outsideAreaHolder === true}
                  onChange={() => setOutsideAreaHolder(true)}
                />
                α╢öα╖Çα╖è
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="outsideArea"
                  checked={outsideAreaHolder === false}
                  onChange={() => setOutsideAreaHolder(false)}
                />
                α╢▒α╖Éα╢¡
              </label>
            </div>
          </div>
          )}
        </div>

        {outsideAreaHolder && (
          <div className="form-grid-2" style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            {fOutAddr && (
            <div className="form-group form-grid-full">
              <label className="form-label">{fOutAddr.label_si} {fOutAddr.is_required ? '*' : ''}</label>
              <textarea
                className="form-textarea"
                value={outsideResidentialAddress}
                onChange={(e) => setOutsideResidentialAddress(e.target.value)}
                placeholder="α╖Çα╢╗α╖èα╢¡α╢╕α╖Åα╢▒ α╢┤α╢»α╖Æα╢éα╢áα╖Æ α╢╜α╖Æα╢┤α╖Æα╢▒α╢║ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒"
              />
            </div>
            )}
            {fOutLand && (
            <div className="form-group form-grid-full">
              <label className="form-label">{fOutLand.label_si} {fOutLand.is_required ? '*' : ''}</label>
              <textarea
                className="form-textarea"
                value={landLocationDetails}
                onChange={(e) => setLandLocationDetails(e.target.value)}
                placeholder="α╢╕α╖Öα╢╕ α╢╢α╢╜α╢┤α╖èΓÇìα╢╗α╢»α╖Üα╖üα╢║ α╢¡α╖öα╖à α╢┤α╖Æα╖äα╖Æα╢ºα╖Æ α╢ëα╢⌐α╢╕α╖è α╖äα╖¥ α╖âα╖èα╢«α╖Åα╢▒ α╖Çα╖Æα╖âα╖èα╢¡α╢╗ α╢çα╢¡α╖öα╖àα╢¡α╖è α╢Üα╢╗α╢▒α╖èα╢▒"
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
                        <label className="form-label">{field.label_si} {field.is_required ? '*' : ''}</label>
                        {field.field_type === 'textarea' ? (
                          <textarea
                            className="form-textarea"
                            value={customData[field.id] || ''}
                            onChange={(e) => setCustomData({...customData, [field.id]: e.target.value})}
                          />
                        ) : field.field_type === 'boolean' ? (
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <label><input type="radio" checked={customData[field.id] === true} onChange={() => setCustomData({...customData, [field.id]: true})} /> α╢öα╖Çα╖è</label>
                            <label><input type="radio" checked={customData[field.id] === false} onChange={() => setCustomData({...customData, [field.id]: false})} /> α╢▒α╖Éα╢¡</label>
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
                α╖âα╢éα╖âα╖èα╢Üα╢╗α╢½α╢║ α╢àα╖Çα╢╜α╢éα╢£α╖ö α╢Üα╢╗α╢▒α╖èα╢▒
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'α╢║α╖Åα╖Çα╢¡α╖èα╢Üα╖Åα╢╜α╖ôα╢▒ α╖Çα╖Öα╢╕α╖Æα╢▒α╖è α╢┤α╖Çα╢¡α╖ô...' : 'Γ£ô α╖Çα╖Åα╢╗α╖èα╢¡α╖Åα╖Ç α╢║α╖Åα╖Çα╢¡α╖èα╢Üα╖Åα╢╜α╖ôα╢▒ α╢Üα╢╗α╢▒α╖èα╢▒'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => resetForm(true)}
              >
                α╢╕α╢Üα╢▒α╖èα╢▒
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'α╖âα╖öα╢╗α╖Éα╢Üα╖Öα╢╕α╖Æα╢▒α╖è α╢┤α╖Çα╢¡α╖ô...' : 'Γ£ô α╖Çα╖Åα╢╗α╖èα╢¡α╖Åα╖Ç α╖âα╖öα╢╗α╢Üα╖Æα╢▒α╖èα╢▒'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecordForm;
