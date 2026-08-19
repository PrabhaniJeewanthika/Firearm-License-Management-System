import React, { useState, useEffect } from 'react';
import FormBuilder from './FormBuilder';
import api from '../services/api';
import { toast } from 'react-toastify';

const SettingsLayout: React.FC = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<'form_builder' | 'general'>('form_builder');
  
  // Lookup states for General Settings
  const [gnDivisions, setGnDivisions] = useState<any[]>([]);
  const [firearmTypes, setFirearmTypes] = useState<any[]>([]);
  const [newGnName, setNewGnName] = useState('');
  const [newFtNameSi, setNewFtNameSi] = useState('');
  const [newFtNameEn, setNewFtNameEn] = useState('');

  useEffect(() => {
    if (activeSettingsTab === 'general') {
      fetchLookups();
    }
  }, [activeSettingsTab]);

  const fetchLookups = async () => {
    try {
      const gnRes = await api.get('/gn-divisions/');
      setGnDivisions(gnRes.data.results || gnRes.data);
      const ftRes = await api.get('/firearm-types/');
      setFirearmTypes(ftRes.data.results || ftRes.data);
    } catch (err) {
      toast.error('දත්ත ලබාගැනීමට නොහැකි විය.');
    }
  };

  const handleAddGN = async () => {
    if (!newGnName.trim()) return;
    try {
      await api.post('/gn-divisions/', { name: newGnName });
      toast.success('ග්‍රාම නිලධාරී වසම එකතු කරන ලදී.');
      setNewGnName('');
      fetchLookups();
    } catch (err) {
      toast.error('දෝෂයක් මතු විය.');
    }
  };

  const handleDeleteGN = async (id: number) => {
    if (!window.confirm('මකා දැමීමට අවශ්‍යද?')) return;
    try {
      await api.delete(`/gn-divisions/${id}/`);
      toast.success('මකා දමන ලදී.');
      fetchLookups();
    } catch (err) {
      toast.error('දෝෂයක් මතු විය.');
    }
  };

  const handleAddFT = async () => {
    if (!newFtNameSi.trim() || !newFtNameEn.trim()) return;
    try {
      await api.post('/firearm-types/', { name_si: newFtNameSi, name_en: newFtNameEn });
      toast.success('ගිනිඅවි වර්ගය එකතු කරන ලදී.');
      setNewFtNameSi('');
      setNewFtNameEn('');
      fetchLookups();
    } catch (err) {
      toast.error('දෝෂයක් මතු විය.');
    }
  };

  const handleDeleteFT = async (id: number) => {
    if (!window.confirm('මකා දැමීමට අවශ්‍යද?')) return;
    try {
      await api.delete(`/firearm-types/${id}/`);
      toast.success('මකා දමන ලදී.');
      fetchLookups();
    } catch (err) {
      toast.error('දෝෂයක් මතු විය.');
    }
  };

  return (
    <div className="card" style={{ padding: '24px', minHeight: '600px' }}>
      <div className="card-header-area" style={{ marginBottom: '24px' }}>
        <div className="card-title">සැකසුම් (Settings)</div>
        <div className="card-subtitle">පද්ධතියේ පෝරම සහ අනෙකුත් සැකසුම් කළමනාකරණය කරන්න.</div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Settings Sidebar */}
        <div style={{ width: '250px', borderRight: '1px solid #e2e8f0', paddingRight: '20px' }}>
          <div
            onClick={() => setActiveSettingsTab('form_builder')}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderRadius: '8px',
              backgroundColor: activeSettingsTab === 'form_builder' ? 'var(--state-maroon)' : 'transparent',
              color: activeSettingsTab === 'form_builder' ? '#fff' : '#1e293b',
              fontWeight: activeSettingsTab === 'form_builder' ? '600' : '400',
              marginBottom: '8px',
              transition: 'all 0.2s'
            }}
          >
            පෝරම සැකසුම්
          </div>
          <div
            onClick={() => setActiveSettingsTab('general')}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderRadius: '8px',
              backgroundColor: activeSettingsTab === 'general' ? 'var(--state-maroon)' : 'transparent',
              color: activeSettingsTab === 'general' ? '#fff' : '#1e293b',
              fontWeight: activeSettingsTab === 'general' ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            සාමාන්‍ය සැකසුම්
          </div>
        </div>

        {/* Settings Content Area */}
        <div style={{ flex: 1, paddingLeft: '10px' }}>
          {activeSettingsTab === 'form_builder' && (
            <FormBuilder />
          )}
          {activeSettingsTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3>සාමාන්‍ය සැකසුම් (General Settings)</h3>
                <p>පද්ධතියේ ප්‍රධාන Dropdown ලැයිස්තු සඳහා දත්ත එකතු කිරීම හා ඉවත් කිරීම මෙතැනින් සිදු කළ හැක.</p>
              </div>

              {/* GN Divisions */}
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '16px' }}>ග්‍රාම නිලධාරී වසම් (GN Divisions)</h4>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input type="text" className="form-input" placeholder="නව ග්‍රාම නිලධාරී වසමේ නම" value={newGnName} onChange={e => setNewGnName(e.target.value)} />
                  <button className="btn btn-primary" onClick={handleAddGN}>එකතු කරන්න</button>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {gnDivisions.map(gn => (
                        <tr key={gn.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 12px' }}>{gn.name}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleDeleteGN(gn.id)}>🗑</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Firearm Types */}
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '16px' }}>ගිනිඅවි වර්ග (Firearm Types)</h4>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input type="text" className="form-input" placeholder="නම (සිංහල)" value={newFtNameSi} onChange={e => setNewFtNameSi(e.target.value)} />
                  <input type="text" className="form-input" placeholder="නම (English)" value={newFtNameEn} onChange={e => setNewFtNameEn(e.target.value)} />
                  <button className="btn btn-primary" onClick={handleAddFT}>එකතු කරන්න</button>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {firearmTypes.map(ft => (
                        <tr key={ft.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 12px' }}>{ft.name_si} ({ft.name_en})</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleDeleteFT(ft.id)}>🗑</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
