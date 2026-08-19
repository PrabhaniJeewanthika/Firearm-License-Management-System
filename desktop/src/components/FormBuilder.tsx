import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

interface Field {
  id: number;
  system_name: string | null;
  label_si: string;
  label_en: string;
  field_type: string;
  is_required: boolean;
  order: number;
  options: any;
  depends_on?: number | null;
  depends_on_value?: string | null;
  _isNew?: boolean;
  _isDeleted?: boolean;
  _isUpdated?: boolean;
}

interface Section {
  id: number;
  title_si: string;
  title_en: string;
  order: number;
  fields: Field[];
  _isNew?: boolean;
  _isDeleted?: boolean;
  _isUpdated?: boolean;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text / Textarea' },
  { value: 'number', label: 'Number' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'nic', label: 'NIC Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox (Multiple)' },
  { value: 'boolean', label: 'Yes/No (Boolean)' },
  { value: 'image', label: 'Image Upload' },
  { value: 'autocalc_65', label: 'Auto Calculated (65th BDay)' },
  { value: 'renewal_history_grid', label: 'Renewal History Grid (Special)' },
  { value: 'current_status_checkboxes', label: 'Current Status Checkboxes (Special)' },
];

const FormBuilder: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modals state
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingField, setEditingField] = useState<{ field: Field, sectionId: number } | null>(null);

  useEffect(() => {
    fetchFormStructure();
  }, []);

  const fetchFormStructure = async () => {
    setLoading(true);
    try {
      const res = await api.get('/custom-sections/');
      const data = res.data.results || res.data;
      // Sort sections by order
      data.sort((a: any, b: any) => a.order - b.order);
      data.forEach((sec: any) => {
        sec.fields?.sort((a: any, b: any) => a.order - b.order);
      });
      setSections(data);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error(err);
      toast.error('පෝරම දත්ත ලබාගැනීමට නොහැකි විය.');
    } finally {
      setLoading(false);
    }
  };

  const markUnsaved = () => setHasUnsavedChanges(true);

  // SECTION ACTIONS
  const handleAddSection = () => {
    const newSection: Section = {
      id: Date.now(), // temporary ID
      title_si: 'නව කොටස',
      title_en: 'New Section',
      order: sections.length + 1,
      fields: [],
      _isNew: true
    };
    setSections([...sections, newSection]);
    setEditingSection(newSection);
    markUnsaved();
  };

  const handleUpdateSection = (id: number, updates: Partial<Section>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates, _isUpdated: !s._isNew } : s));
    markUnsaved();
  };

  const handleDeleteSection = (id: number) => {
    if (!window.confirm("මෙම කොටස මකා දැමීමට ඔබට විශ්වාසද? මෙම කොටස මකා දැමීමෙන් එයට අයත් සියලුම ක්ෂේත්‍රද ඉවත් වේ.")) return;
    setSections(sections.map(s => s.id === id ? { ...s, _isDeleted: true } : s));
    markUnsaved();
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    
    // Update orders
    newSections.forEach((s, i) => {
      s.order = i + 1;
      if (!s._isNew) s._isUpdated = true;
    });
    
    setSections(newSections);
    markUnsaved();
  };

  // FIELD ACTIONS
  const handleAddField = (sectionId: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const newField: Field = {
      id: Date.now(), // temp
      system_name: null,
      label_si: 'නව ක්ෂේත්‍රය',
      label_en: 'New Field',
      field_type: 'text',
      is_required: false,
      order: section.fields.length + 1,
      options: null,
      _isNew: true
    };
    
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, fields: [...s.fields, newField], _isUpdated: !s._isNew };
      }
      return s;
    }));
    setEditingField({ field: newField, sectionId });
    markUnsaved();
  };

  const handleUpdateField = (sectionId: number, fieldId: number, updates: Partial<Field>) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fields: s.fields.map(f => f.id === fieldId ? { ...f, ...updates, _isUpdated: !f._isNew } : f),
          _isUpdated: !s._isNew
        };
      }
      return s;
    }));
    markUnsaved();
  };

  const handleDeleteField = (sectionId: number, fieldId: number) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fields: s.fields.map(f => f.id === fieldId ? { ...f, _isDeleted: true } : f),
          _isUpdated: !s._isNew
        };
      }
      return s;
    }));
    markUnsaved();
  };

  const moveField = (sectionId: number, index: number, direction: 'up' | 'down') => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        if (direction === 'up' && index === 0) return s;
        if (direction === 'down' && index === s.fields.length - 1) return s;
        
        const newFields = [...s.fields];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        const temp = newFields[index];
        newFields[index] = newFields[targetIndex];
        newFields[targetIndex] = temp;
        
        newFields.forEach((f, i) => {
          f.order = i + 1;
          if (!f._isNew) f._isUpdated = true;
        });
        
        return { ...s, fields: newFields, _isUpdated: !s._isNew };
      }
      return s;
    }));
    markUnsaved();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Very basic sequential save logic to preserve relationships
      // 1. Delete fields & sections
      for (const section of sections) {
        if (section._isDeleted && !section._isNew) {
          await api.delete(`/custom-sections/${section.id}/`);
        } else if (!section._isDeleted) {
          for (const field of section.fields) {
            if (field._isDeleted && !field._isNew) {
              await api.delete(`/custom-fields/${field.id}/`);
            }
          }
        }
      }
      
      // 2. Create/Update sections
      for (const section of sections) {
        if (section._isDeleted) continue;
        
        let sectionId = section.id;
        const sectionData = {
          title_si: section.title_si,
          title_en: section.title_en,
          order: section.order
        };
        
        if (section._isNew) {
          const res = await api.post('/custom-sections/', sectionData);
          sectionId = res.data.id;
        } else if (section._isUpdated) {
          await api.put(`/custom-sections/${sectionId}/`, sectionData);
        }
        
        // 3. Create/Update fields for this section
        for (const field of section.fields) {
          if (field._isDeleted) continue;
          
          const fieldData = {
            section: sectionId,
            system_name: field.system_name,
            label_si: field.label_si,
            label_en: field.label_en,
            field_type: field.field_type,
            is_required: field.is_required,
            order: field.order,
            options: field.options,
            depends_on_value: field.depends_on_value
          };
          
          if (field._isNew) {
            await api.post('/custom-fields/', fieldData);
          } else if (field._isUpdated) {
            await api.put(`/custom-fields/${field.id}/`, fieldData);
          }
        }
      }
      
      toast.success('පෝරම සැකසුම් සාර්ථකව සුරකින ලදී.');
      fetchFormStructure();
    } catch (err) {
      console.error(err);
      toast.error('වෙනස්කම් සුරැකීමට නොහැකි විය. නැවත උත්සාහ කරන්න.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading Builder...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>පෝරම සැකසුම් (Form Builder)</h3>
          <p>නව වාර්තාවක් පෝරමයේ කොටස් සහ තොරතුරු ක්ෂේත්‍ර මෙහි කළමනාකරණය කළ හැක.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {hasUnsavedChanges && <span style={{ color: '#b45309', fontWeight: 'bold', alignSelf: 'center' }}>සුරැකී නොමැති වෙනස්කම් ඇත</span>}
          <button className="btn btn-secondary" onClick={handleAddSection}>+ නව කොටසක්</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'සුරැකෙමින්...' : 'වෙනස්කම් සුරකින්න'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {sections.filter(s => !s._isDeleted).map((section, sIndex) => (
          <div key={section.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Section Header */}
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ backgroundColor: 'var(--state-maroon)', color: '#fff', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {String(sIndex + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{section.title_si} ({section.title_en})</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => moveSection(sIndex, 'up')}>↑</button>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => moveSection(sIndex, 'down')}>↓</button>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setEditingSection(section)}>✎ සංස්කරණය</button>
                <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleDeleteSection(section.id)}>🗑 මකන්න</button>
              </div>
            </div>

            {/* Section Fields */}
            <div style={{ padding: '16px', backgroundColor: '#fff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>
                    <th style={{ padding: '8px' }}>ක්ෂේත්‍රය (Label)</th>
                    <th style={{ padding: '8px' }}>වර්ගය (Type)</th>
                    <th style={{ padding: '8px' }}>System Key</th>
                    <th style={{ padding: '8px' }}>අනිවාර්යයි</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>ක්‍රියා (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {section.fields.filter(f => !f._isDeleted).map((field, fIndex) => (
                    <tr key={field.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px', fontWeight: '500' }}>{field.label_si}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
                          {field.field_type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>
                        {field.system_name || <span style={{ fontStyle: 'italic' }}>custom</span>}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {field.is_required ? <span style={{ color: 'var(--danger-color)' }}>ඔව්</span> : 'නැත'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '11px', marginRight: '4px' }} onClick={() => moveField(section.id, fIndex, 'up')}>↑</button>
                        <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '11px', marginRight: '8px' }} onClick={() => moveField(section.id, fIndex, 'down')}>↓</button>
                        <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '11px', marginRight: '4px' }} onClick={() => setEditingField({ field, sectionId: section.id })}>✎ Edit</button>
                        <button className="btn btn-danger" style={{ padding: '2px 6px', fontSize: '11px' }} onClick={() => handleDeleteField(section.id, field.id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                  {section.fields.filter(f => !f._isDeleted).length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>ක්ෂේත්‍ර නොමැත</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button className="btn btn-secondary" style={{ fontSize: '13px' }} onClick={() => handleAddField(section.id)}>+ නව ක්ෂේත්‍රයක්</button>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION EDITOR MODAL */}
      {editingSection && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>කොටස සංස්කරණය</h3>
            <div className="form-group">
              <label className="form-label">කොටසේ නම (Sinhala)</label>
              <input type="text" className="form-input" value={editingSection.title_si} onChange={e => setEditingSection({...editingSection, title_si: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">කොටසේ නම (English)</label>
              <input type="text" className="form-input" value={editingSection.title_en} onChange={e => setEditingSection({...editingSection, title_en: e.target.value})} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setEditingSection(null)}>අවලංගු කරන්න</button>
              <button className="btn btn-primary" onClick={() => {
                handleUpdateSection(editingSection.id, { title_si: editingSection.title_si, title_en: editingSection.title_en });
                setEditingSection(null);
              }}>යාවත්කාලීන කරන්න</button>
            </div>
          </div>
        </div>
      )}

      {/* FIELD EDITOR MODAL */}
      {editingField && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '600px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '16px' }}>ක්ෂේත්‍රය සංස්කරණය</h3>
            
            <div className="form-group">
              <label className="form-label">ක්ෂේත්‍රයේ නම (Sinhala)</label>
              <input type="text" className="form-input" value={editingField.field.label_si} onChange={e => setEditingField({...editingField, field: {...editingField.field, label_si: e.target.value}})} />
            </div>
            
            <div className="form-group">
              <label className="form-label">ක්ෂේත්‍රයේ නම (English)</label>
              <input type="text" className="form-input" value={editingField.field.label_en} onChange={e => setEditingField({...editingField, field: {...editingField.field, label_en: e.target.value}})} />
            </div>

            <div className="form-group">
              <label className="form-label">System Key (අත්‍යවශ්‍යයි නම් පමණක් වෙනස් කරන්න)</label>
              <input type="text" className="form-input" style={{ backgroundColor: '#f1f5f9' }} value={editingField.field.system_name || ''} readOnly placeholder="පද්ධතිය මගින් ලබාදී ඇති key එක" />
              <span style={{ fontSize: '11px', color: '#64748b' }}>Existing records protect කිරීමට system keys වෙනස් කළ නොහැක.</span>
            </div>

            <div className="form-group">
              <label className="form-label">වර්ගය (Field Type)</label>
              <select className="form-select" value={editingField.field.field_type} onChange={e => setEditingField({...editingField, field: {...editingField.field, field_type: e.target.value}})}>
                {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="req" checked={editingField.field.is_required} onChange={e => setEditingField({...editingField, field: {...editingField.field, is_required: e.target.checked}})} style={{ width: '18px', height: '18px' }} />
              <label htmlFor="req" className="form-label" style={{ marginBottom: 0 }}>මෙය අනිවාර්ය තොරතුරක් ද?</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setEditingField(null)}>අවලංගු කරන්න</button>
              <button className="btn btn-primary" onClick={() => {
                handleUpdateField(editingField.sectionId, editingField.field.id, editingField.field);
                setEditingField(null);
              }}>යාවත්කාලීන කරන්න</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
