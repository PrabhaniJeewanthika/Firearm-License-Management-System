import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../services/api';
import FormBuilder from './FormBuilder';

interface GNDivision {
  id: number;
  name: string;
}

interface AdminPanelProps {
  gnDivisions: GNDivision[];
  onDataChanged: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ gnDivisions, onDataChanged }) => {
  const { t } = useTranslation();
  const [newGnName, setNewGnName] = useState('');
  const [editingGnId, setEditingGnId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitGN = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGnName.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingGnId) {
        await api.put(`/gn-divisions/${editingGnId}/`, { name: newGnName.trim() });
        toast.success(t('admin.updateSuccess'));
      } else {
        await api.post('/gn-divisions/', { name: newGnName.trim() });
        toast.success(t('admin.addSuccess'));
      }
      setNewGnName('');
      setEditingGnId(null);
      onDataChanged();
    } catch (err: any) {
      console.error('Error saving GN Division:', err);
      if (err.response?.data?.name) {
        toast.error(t('admin.addErrorDuplicate'));
      } else {
        toast.error(t('admin.addError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (gn: GNDivision) => {
    setEditingGnId(gn.id);
    setNewGnName(gn.name);
  };

  const handleCancelEdit = () => {
    setEditingGnId(null);
    setNewGnName('');
  };

  const handleDeleteGN = async (id: number) => {
    if (!window.confirm(t('admin.deleteConfirmText'))) return;
    
    try {
      await api.delete(`/gn-divisions/${id}/`);
      toast.success(t('admin.deleteSuccess'));
      onDataChanged();
    } catch (err) {
      console.error('Error deleting GN Division:', err);
      toast.error(t('admin.deleteError'));
    }
  };

  return (
    <div className="admin-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card">
        <h2 className="section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
          {t('admin.manageGNDivisions')}
        </h2>
        
        <form onSubmit={handleSubmitGN} style={{ marginBottom: '30px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              {editingGnId ? t('admin.updateBtn') : t('admin.newGNDivision')}
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-control"
                value={newGnName}
                onChange={(e) => setNewGnName(e.target.value)}
                placeholder={t('admin.gnPlaceholder')}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !newGnName.trim()}
              >
                {isSubmitting ? t('actions.saving') : (editingGnId ? t('admin.updateBtn') : t('admin.addBtn'))}
              </button>
              {editingGnId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  {t('admin.cancelBtn')}
                </button>
              )}
            </div>
          </div>
        </form>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
            {t('admin.existingGNDivisions')} ({gnDivisions.length})
          </h3>
          
          {gnDivisions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>{t('admin.noGnDivisions')}</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {gnDivisions.map(gn => (
                <li key={gn.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)'
                }}>
                  <span style={{ fontWeight: '500' }}>{gn.name}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditClick(gn)}
                      className="btn-icon"
                      title={t('actions.edit')}
                      style={{ color: '#0284c7', padding: '6px', borderRadius: '4px', border: 'none', background: 'rgba(2, 132, 199, 0.1)', cursor: 'pointer' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteGN(gn.id)}
                      className="btn-icon"
                      title={t('actions.delete')}
                      style={{ color: 'var(--danger-color)', padding: '6px', borderRadius: '4px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', cursor: 'pointer' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <FormBuilder />
    </div>
  );
};

export default AdminPanel;
