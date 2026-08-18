import re

with open('scratch/RecordForm_original.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add LicenseRenewalYear to Props
content = content.replace(
    '  customSections?: any[];\n  editingRecord: any | null;',
    '  renewalYears: any[];\n  customSections?: any[];\n  editingRecord: any | null;'
)

content = content.replace(
    '  customSections = [],\n  editingRecord,',
    '  renewalYears = [],\n  customSections = [],\n  editingRecord,'
)

# 2. Add getter and setter helpers inside the component
helpers = """
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
"""

content = content.replace('  // Scroll to Form Ref', helpers + '\n  // Scroll to Form Ref')

# 3. Replace the static sections with dynamic mapping
dynamic_form = """
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
                  {renewalYears.map(ry => {
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
"""

# Find the start of <div className="form-grid-2"> for fullName (line 401 approx)
import re
start_idx = content.find('<div className="form-grid-2">')
end_idx = content.find('{/* Dynamic Custom Sections */}', start_idx)
# also remove up to the end of Dynamic Custom Sections loop
end_idx_2 = content.find('</form>', end_idx)

if start_idx != -1 and end_idx_2 != -1:
    new_content = content[:start_idx] + dynamic_form + "\n" + content[end_idx_2:]
    
    with open('desktop/src/components/RecordForm.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
        print("Successfully rewrote RecordForm.tsx")
else:
    print("Could not find start/end indices")

