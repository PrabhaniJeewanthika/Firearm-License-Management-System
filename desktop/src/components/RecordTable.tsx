import React from 'react';

interface GNDivisionDetail {
  id: number;
  name: string;
}

interface FirearmTypeDetail {
  id: number;
  name_si: string;
  name_en: string;
}

interface RecordData {
  id: number;
  photo: string | null;
  full_name: string;
  nic: string;
  telephone: string;
  address: string;
  gn_division_detail?: GNDivisionDetail;
  firearm_type_detail?: FirearmTypeDetail;
  firearm_number: string;
  renewal_status: string | null;
  current_status: string;
  sixty_fifth_birthday: string | null;
}

interface RecordTableProps {
  records: RecordData[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onView: (record: RecordData) => void;
  onEdit: (record: RecordData) => void;
  onDelete: (recordId: number) => void;
  onNewRecordTabClick: () => void;
}

const RecordTable: React.FC<RecordTableProps> = ({
  records,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onNewRecordTabClick,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary-color)' }}>සුරැකි වාර්තා (Saved Records)</h3>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
          මුළු වාර්තා: {totalCount}
        </span>
      </div>

      <div className="table-responsive">
        {records.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>තවම වාර්තා නොමැත</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>පළමු බලපත්‍රලාභී වාර්තාව දැන් එක් කරන්න.</div>
            <button className="btn btn-primary" onClick={onNewRecordTabClick}>＋ නව වාර්තාවක්</button>
          </div>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>බලපත්‍රලාභියා (Licensee)</th>
                <th>NIC / දුරකථන</th>
                <th>ගිනිඅවිය (Firearm)</th>
                <th>GN කොට්ඨාසය</th>
                <th>65 සම්පූර්ණ වන දිනය</th>
                <th style={{ textAlign: 'center' }}>ක්‍රියා</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} style={{ cursor: 'pointer' }} onClick={() => onView(record)}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="licensee-cell" onClick={() => onView(record)}>
                      <div className="avatar-circle" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {record.photo ? (
                          <img src={record.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '16px' }}>👤</span>
                        )}
                      </div>
                      <div>
                        <div className="licensee-name">{record.full_name}</div>
                        <div className="licensee-address">{record.address}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{record.nic}</div>
                    <div className="sub-text">{record.telephone}</div>
                  </td>
                  <td>
                    <div>{record.firearm_type_detail?.name_si || '-'}</div>
                    <div className="sub-text">{record.firearm_number}</div>
                  </td>
                  <td>{record.gn_division_detail?.name.split(' ')[0] || '-'}</td>
                  <td style={{ fontWeight: '600', color: '#b45309' }}>{record.sixty_fifth_birthday || '-'}</td>
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        className="action-btn edit"
                        title="සංස්කරණය"
                        onClick={() => onEdit(record)}
                      >
                        ✎
                      </button>
                      <button
                        className="action-btn delete"
                        title="ඉවත් කරන්න"
                        onClick={() => onDelete(record.id)}
                      >
                        ⌫
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            පිටුව {currentPage} / {totalPages}
          </div>
          <div className="pagination-buttons">
            <button
              className="btn btn-secondary"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{ padding: '5px 10px', fontSize: '12px' }}
            >
              පෙර
            </button>
            {pageNumbers.map((num) => (
              <button
                key={num}
                className="btn"
                onClick={() => onPageChange(num)}
                style={{
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: currentPage === num ? 'var(--primary-color)' : '#f1f5f9',
                  color: currentPage === num ? 'white' : 'var(--text-primary)',
                  border: 'none',
                }}
              >
                {num}
              </button>
            ))}
            <button
              className="btn btn-secondary"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{ padding: '5px 10px', fontSize: '12px' }}
            >
              ඊළඟ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordTable;
