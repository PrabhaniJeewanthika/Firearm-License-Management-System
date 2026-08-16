import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import './AddLicenseHolderWizard.css';

const AddLicenseHolderWizard = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    photograph: null as File | null,
    full_name: '',
    address: '',
    gn_division: '',
    nic: '',
    date_of_birth: '',
    telephone_number: '',
    outside_area_holder: false,
    firearm_type: '',
    firearm_number: '',
    first_licensed_year: new Date().getFullYear(),
    license_year: new Date().getFullYear(),
    notes: ''
  });

  const [gnDivisions, setGnDivisions] = useState<any[]>([]);
  const [firearmTypes, setFirearmTypes] = useState<any[]>([]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [gnRes, ftRes] = await Promise.all([
          api.get('/gn-divisions/'),
          api.get('/firearm-types/')
        ]);
        setGnDivisions(gnRes.data.results || gnRes.data);
        setFirearmTypes(ftRes.data.results || ftRes.data);
      } catch (err) {
        toast.error('Failed to load lookup data');
      }
    };
    fetchLookups();
  }, []);

  const handleNext = () => setStep(s => Math.min(s + 1, 8));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSave = async () => {
    try {
      // Basic implementation without multipart for simplicity in first pass
      // Need to use FormData if sending files
      const data = new FormData();
      data.append('full_name', formData.full_name);
      data.append('address', formData.address);
      data.append('gn_division', formData.gn_division);
      data.append('nic', formData.nic);
      data.append('date_of_birth', formData.date_of_birth);
      data.append('telephone_number', formData.telephone_number);
      data.append('outside_area_holder', formData.outside_area_holder ? 'True' : 'False');
      data.append('notes', formData.notes);

      // Create License Holder First
      const res = await api.post('/license-holders/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const holderId = res.data.id;

      // Then Create Firearm
      if (formData.firearm_number && formData.firearm_type) {
        const firearmRes = await api.post('/firearms/', {
          license_holder: holderId,
          firearm_type: formData.firearm_type,
          firearm_number: formData.firearm_number,
          first_licensed_year: formData.first_licensed_year
        });

        // Then Create Renewal
        await api.post('/renewals/', {
          license_holder: holderId,
          firearm: firearmRes.data.id,
          license_year: formData.license_year,
          renewal_status: 'Renewed'
        });
      }

      toast.success('Record saved successfully.');
      navigate('/license-holders');
    } catch (error: any) {
      toast.error('Failed to save record. Please check inputs.');
      console.error(error);
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h1>Add New License Holder</h1>
        <div className="wizard-progress">
          Step {step} of 8
        </div>
      </div>
      
      <div className="wizard-body">
        {step === 1 && (
          <div className="wizard-step">
            <h2>Step 1 – Photograph</h2>
            <p>Upload a clear photograph of the license holder.</p>
            <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, photograph: e.target.files?.[0] || null})} />
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <h2>Step 2 – Personal Information</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>NIC *</label>
              <input type="text" value={formData.nic} onChange={e => setFormData({...formData, nic: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input type="date" value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Telephone Number *</label>
              <input type="text" value={formData.telephone_number} onChange={e => setFormData({...formData, telephone_number: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required></textarea>
            </div>
            <div className="form-group">
              <label>GN Division *</label>
              <select value={formData.gn_division} onChange={e => setFormData({...formData, gn_division: e.target.value})} required>
                <option value="">Select GN Division</option>
                {gnDivisions.map(gn => <option key={gn.id} value={gn.id}>{gn.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step">
            <h2>Step 3 – Firearm Information</h2>
            <div className="form-group">
              <label>Firearm Type *</label>
              <select value={formData.firearm_type} onChange={e => setFormData({...formData, firearm_type: e.target.value})}>
                <option value="">Select Firearm Type</option>
                {firearmTypes.map(ft => <option key={ft.id} value={ft.id}>{ft.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Firearm Number *</label>
              <input type="text" value={formData.firearm_number} onChange={e => setFormData({...formData, firearm_number: e.target.value})} />
            </div>
            <div className="form-group">
              <label>First Licensed Year</label>
              <input type="number" value={formData.first_licensed_year} onChange={e => setFormData({...formData, first_licensed_year: parseInt(e.target.value)})} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="wizard-step">
            <h2>Step 4 – License Information</h2>
            <p>Initial license setup information.</p>
            {/* Can add more specific fields if needed */}
          </div>
        )}

        {step === 5 && (
          <div className="wizard-step">
            <h2>Step 5 – Renewal Information</h2>
            <div className="form-group">
              <label>Current License Year</label>
              <input type="number" value={formData.license_year} onChange={e => setFormData({...formData, license_year: parseInt(e.target.value)})} />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="wizard-step">
            <h2>Step 6 – Other Details</h2>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={formData.outside_area_holder} onChange={e => setFormData({...formData, outside_area_holder: e.target.checked})} id="outside_area" />
              <label htmlFor="outside_area" style={{marginBottom: 0}}>Is an Outside Area Holder</label>
            </div>
            <div className="form-group" style={{marginTop: '16px'}}>
              <label>Notes / Remarks</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="wizard-step">
            <h2>Step 7 – Review</h2>
            <div className="review-section">
              <p><strong>Name:</strong> {formData.full_name}</p>
              <p><strong>NIC:</strong> {formData.nic}</p>
              <p><strong>Firearm Number:</strong> {formData.firearm_number}</p>
            </div>
            <p>Please ensure all details are correct before saving.</p>
          </div>
        )}

        {step === 8 && (
          <div className="wizard-step">
            <h2>Step 8 – Save</h2>
            <p>Ready to save this record into the system.</p>
          </div>
        )}
      </div>

      <div className="wizard-footer">
        <button className="btn-secondary" onClick={() => navigate('/license-holders')}>Cancel</button>
        <div style={{display: 'flex', gap: '12px'}}>
          {step > 1 && <button className="btn-secondary" onClick={handlePrev}>Previous</button>}
          {step < 8 ? (
            <button className="btn-primary" onClick={handleNext}>Next</button>
          ) : (
            <button className="btn-primary success-btn" onClick={handleSave}>Save Record</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLicenseHolderWizard;
