import React, { useState } from 'react';
import FormBuilder from './FormBuilder';

const SettingsLayout: React.FC = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<'form_builder' | 'general'>('form_builder');

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
            <div>
              <h3>සාමාන්‍ය සැකසුම්</h3>
              <p>මෙම විශේෂාංගය තවමත් සංවර්ධනය කර නොමැත.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
