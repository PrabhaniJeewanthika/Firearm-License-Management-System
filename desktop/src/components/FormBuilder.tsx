import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../services/api';

export interface CustomFormField {
  id: number;
  system_name: string | null;
  label_si: string;
  label_en: string;
  label_ta: string | null;
  field_type: string;
  options: any;
  is_required: boolean;
  order: number;
  depends_on?: number | null;
  depends_on_value?: string | null;
}

export interface CustomFormSection {
  id: number;
  title_si: string;
  title_en: string;
  title_ta: string | null;
  order: number;
  fields: CustomFormField[];
}

const FormBuilder: React.FC = () => {
  const { t } = useTranslation();
  const [sections, setSections] = useState<CustomFormSection[]>([]);
  const [loading, setLoading] = useState(true);

  // New Section State
  const [newSectionSi, setNewSectionSi] = useState('');
  const [newSectionEn, setNewSectionEn] = useState('');
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);

  // New Field State
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [newFieldLabelSi, setNewFieldLabelSi] = useState('');
  const [newFieldLabelEn, setNewFieldLabelEn] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [isSubmittingField, setIsSubmittingField] = useState(false);

  const fetchSections = async () => {
    try {
      const res = await api.get('/custom-sections/');
      setSections(res.data);
    } catch (err) {
      console.error('Error fetching custom sections:', err);
      toast.error('Failed to load custom form sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionSi.trim() || !newSectionEn.trim()) return;

    setIsSubmittingSection(true);
    try {
      await api.post('/custom-sections/', {
        title_si: newSectionSi,
        title_en: newSectionEn,
        order: sections.length + 1
      });
      toast.success('Section added successfully');
      setNewSectionSi('');
      setNewSectionEn('');
      fetchSections();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add section');
    } finally {
      setIsSubmittingSection(false);
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this section? All its fields will also be deleted.')) return;
    try {
      await api.delete(`/custom-sections/${id}/`);
      toast.success('Section deleted successfully');
      fetchSections();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete section');
    }
  };

  const handleAddField = async (e: React.FormEvent, sectionId: number) => {
    e.preventDefault();
    if (!newFieldLabelSi.trim() || !newFieldLabelEn.trim()) return;

    setIsSubmittingField(true);
    try {
      let optionsJson = null;
      if (['select', 'radio', 'checkbox'].includes(newFieldType) && newFieldOptions.trim()) {
        optionsJson = newFieldOptions.split(',').map(opt => opt.trim());
      }

      await api.post('/custom-fields/', {
        section: sectionId,
        label_si: newFieldLabelSi,
        label_en: newFieldLabelEn,
        field_type: newFieldType,
        options: optionsJson,
        is_required: newFieldRequired,
        order: 0
      });
      toast.success('Field added successfully');
      
      // Reset form
      setNewFieldLabelSi('');
      setNewFieldLabelEn('');
      setNewFieldType('text');
      setNewFieldOptions('');
      setNewFieldRequired(false);
      setActiveSectionId(null);
      fetchSections();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add field');
    } finally {
      setIsSubmittingField(false);
    }
  };

  const handleDeleteField = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this field? Data previously saved using this field will not be shown.')) return;
    try {
      await api.delete(`/custom-fields/${id}/`);
      toast.success('Field deleted successfully');
      fetchSections();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete field');
    }
  };

  if (loading) return <div>Loading Form Builder...</div>;

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h2 className="section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
        Dynamic Form Builder (Additional Fields)
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Add custom sections and fields to the bottom of the license form. These fields will be dynamically added to the Excel export.
      </p>

      {/* Add New Section */}
      <form onSubmit={handleAddSection} style={{ display: 'flex', gap: '10px', marginBottom: '30px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Section Title (Sinhala) *</label>
          <input className="form-control" value={newSectionSi} onChange={e => setNewSectionSi(e.target.value)} required />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Section Title (English) *</label>
          <input className="form-control" value={newSectionEn} onChange={e => setNewSectionEn(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmittingSection} style={{ padding: '10px 20px', height: '42px' }}>
          Add Section
        </button>
      </form>

      {/* Existing Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sections.map(section => (
          <div key={section.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{section.title_si} / {section.title_en}</h3>
              <button onClick={() => handleDeleteSection(section.id)} className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }}>
                Delete Section
              </button>
            </div>

            {/* Existing Fields in Section */}
            {section.fields && section.fields.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.fields.map(field => (
                  <li key={field.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '4px' }}>
                    <div>
                      <strong>{field.label_si} / {field.label_en}</strong> ({field.field_type}) 
                      {field.system_name && <span style={{ marginLeft: '10px', fontSize: '12px', background: 'var(--primary-color)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Core Field</span>}
                      {field.is_required && <span style={{ color: 'red', marginLeft: '5px' }}>*Required</span>}
                    </div>
                    {!field.system_name && (
                      <button onClick={() => handleDeleteField(field.id)} className="btn-icon" style={{ color: 'var(--danger-color)', cursor: 'pointer', background: 'none', border: 'none' }}>
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontStyle: 'italic' }}>No fields in this section.</p>
            )}

            {/* Add Field Button / Form */}
            {activeSectionId === section.id ? (
              <form onSubmit={(e) => handleAddField(e, section.id)} style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '6px' }}>
                <h4 style={{ marginBottom: '10px' }}>Add New Field</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Label (Sinhala) *</label>
                    <input className="form-control" value={newFieldLabelSi} onChange={e => setNewFieldLabelSi(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Label (English) *</label>
                    <input className="form-control" value={newFieldLabelEn} onChange={e => setNewFieldLabelEn(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Field Type *</label>
                    <select className="form-control" value={newFieldType} onChange={e => setNewFieldType(e.target.value)}>
                      <option value="text">Text (Short)</option>
                      <option value="textarea">Text Area (Long)</option>
                      <option value="number">Number</option>
                      <option value="phone">Phone Number</option>
                      <option value="nic">NIC Number</option>
                      <option value="date">Date</option>
                      <option value="select">Dropdown Select</option>
                      <option value="radio">Radio Buttons</option>
                      <option value="checkbox">Checkboxes</option>
                      <option value="boolean">Yes/No Toggle</option>
                      <option value="image">Image Upload</option>
                      <option value="autocalc_65">Auto Calculate (65th Birthday)</option>
                    </select>
                  </div>
                  {['select', 'radio', 'checkbox'].includes(newFieldType) && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Options (Comma separated) *</label>
                      <input className="form-control" value={newFieldOptions} onChange={e => setNewFieldOptions(e.target.value)} placeholder="Option 1, Option 2" required />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', gridColumn: '1 / -1' }}>
                    <input type="checkbox" id={`req-${section.id}`} checked={newFieldRequired} onChange={e => setNewFieldRequired(e.target.checked)} />
                    <label htmlFor={`req-${section.id}`}>Is this field required?</label>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" disabled={isSubmittingField}>Save Field</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveSectionId(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setActiveSectionId(section.id)} className="btn btn-secondary">
                + Add Field
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormBuilder;
