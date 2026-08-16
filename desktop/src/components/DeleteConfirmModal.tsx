import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>වාර්තාව මකා දැමීම</h2>
        </div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
          <p style={{ fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
            මෙම වාර්තාව මකා දැමීමට ඔබට විශ්වාසද?
          </p>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
            මෙම ක්‍රියාව ආපසු හැරවිය නොහැක.
          </p>
        </div>
        <div className="modal-footer" style={{ borderTop: 'none', padding: '16px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            අවලංගු කරන්න
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            මකා දමන්න
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
