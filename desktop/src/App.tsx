import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import SearchFilterBar from './components/SearchFilterBar';
import RecordForm from './components/RecordForm';
import RecordTable from './components/RecordTable';
import RecordViewModal from './components/RecordViewModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import LoadingSpinner from './components/LoadingSpinner';

import api from './services/api';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'form' | 'table'>('form');

  // Data State
  const [records, setRecords] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Lookup State
  const [gnDivisions, setGnDivisions] = useState<any[]>([]);
  const [firearmTypes, setFirearmTypes] = useState<any[]>([]);

  // Summary State
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    not_renewed: 0,
    transferred: 0,
    deceased: 0,
  });

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    gn_division: '',
    firearm_type: '',
    renewal_status: '',
    current_status: '',
    outside_area_holder: '',
  });

  // Modals & Action State
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [deleteRecordId, setDeleteRecordId] = useState<number | null>(null);

  // Status State
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  // Fetch GN divisions and Firearm types once on mount
  const fetchLookups = async () => {
    try {
      const [gnRes, ftRes] = await Promise.all([
        api.get('/gn-divisions/'),
        api.get('/firearm-types/'),
      ]);
      setGnDivisions(gnRes.data.results || gnRes.data);
      setFirearmTypes(ftRes.data.results || ftRes.data);
    } catch (err) {
      console.error('Lookup load error:', err);
      setApiError(true);
    }
  };

  // Fetch records and summary counts
  const fetchRecordsAndSummary = async (page = currentPage, query = search, currentFilters = filters) => {
    setLoading(true);
    setApiError(false);
    try {
      const params: Record<string, any> = {
        page,
        page_size: pageSize,
      };

      if (query.trim()) params.search = query.trim();
      if (currentFilters.gn_division) params.gn_division = currentFilters.gn_division;
      if (currentFilters.firearm_type) params.firearm_type = currentFilters.firearm_type;
      if (currentFilters.renewal_status) params.renewal_status = currentFilters.renewal_status;
      if (currentFilters.current_status) params.current_status = currentFilters.current_status;
      if (currentFilters.outside_area_holder) params.outside_area_holder = currentFilters.outside_area_holder;

      const [recordsRes, summaryRes] = await Promise.all([
        api.get('/records/', { params }),
        api.get('/summary/'),
      ]);

      if (recordsRes.data && recordsRes.data.results !== undefined) {
        setRecords(recordsRes.data.results);
        setTotalCount(recordsRes.data.count);
      } else {
        setRecords(recordsRes.data);
        setTotalCount(recordsRes.data.length || 0);
      }

      setSummary(summaryRes.data);
    } catch (err) {
      console.error('Data load error:', err);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initLoad = async () => {
      await fetchLookups();
      await fetchRecordsAndSummary(1, '', {
        gn_division: '',
        firearm_type: '',
        renewal_status: '',
        current_status: '',
        outside_area_holder: '',
      });
    };
    initLoad();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRecordsAndSummary(page, search, filters);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

  const handleFilterChange = (key: string, val: string) => {
    const updatedFilters = { ...filters, [key]: val };
    setFilters(updatedFilters);
    setCurrentPage(1);
    fetchRecordsAndSummary(1, search, updatedFilters);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchRecordsAndSummary(1, search, filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      gn_division: '',
      firearm_type: '',
      renewal_status: '',
      current_status: '',
      outside_area_holder: '',
    };
    setSearch('');
    setFilters(resetFilters);
    setCurrentPage(1);
    fetchRecordsAndSummary(1, '', resetFilters);
  };

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
  };

  const handleEditRecord = (record: any) => {
    setEditingRecord(record);
    setActiveTab('form'); // Switch to form tab for editing
  };

  const handleDeleteClick = (recordId: number) => {
    setDeleteRecordId(recordId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRecordId) return;
    try {
      await api.delete(`/records/${deleteRecordId}/`);
      toast.success('වාර්තාව සාර්ථකව මකා දමන ලදී.');
      setDeleteRecordId(null);
      fetchRecordsAndSummary(currentPage, search, filters);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('වාර්තාව මකා දැමීමට නොහැකි විය.');
    }
  };

  const handleSaveSuccess = () => {
    setEditingRecord(null);
    fetchRecordsAndSummary(1, '', {
      gn_division: '',
      firearm_type: '',
      renewal_status: '',
      current_status: '',
      outside_area_holder: '',
    });
    setActiveTab('table'); // Switch to table view after saving
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setActiveTab('table');
  };

  const handleRetry = () => {
    setApiError(false);
    setLoading(true);
    fetchLookups().then(() => {
      fetchRecordsAndSummary(currentPage, search, filters);
    });
  };

  // Excel CSV Export Logic with Sinhala character support (BOM prefix)
  const handleExportToExcel = async () => {
    try {
      toast.info('වාර්තා අපනයනය කරමින් පවතී...');
      
      // Fetch all records for full export
      const res = await api.get('/records/', {
        params: {
          page_size: 10000,
        }
      });
      
      const allRecords = res.data.results || res.data;
      if (allRecords.length === 0) {
        toast.warning('අපනයනය කිරීමට වාර්තා කිසිවක් නොමැත.');
        return;
      }

      const headers = [
        'සම්පූර්ණ නම (Full Name)', 'ජාතික හැඳුනුම්පත් අංකය (NIC)', 'දුරකථන අංකය (Phone)',
        'ලිපිනය (Address)', 'ග්‍රාම නිලධාරී කොට්ඨාසය (GN Division)', 'උපන්දිනය (DOB)',
        '65 සම්පූර්ණ වන දිනය (65th Birthday)', 'ගිනිඅවි වර්ගය (Firearm Type)',
        'ගිනිඅවි අංකය (Firearm Number)', 'මුලින්ම බලපත්‍ර ලද වර්ෂය (First Licensed Year)',
        'බලපත්‍ර අලුත් කිරීමේ තත්ත්වය (Renewal Status)', 'වර්තමාන තත්ත්වය (Current Status)'
      ];

      const csvRows = [];
      csvRows.push(headers.join(','));

      for (const row of allRecords) {
        const values = [
          `"${(row.full_name || '').replace(/"/g, '""')}"`,
          `"${(row.nic || '').replace(/"/g, '""')}"`,
          `"${(row.telephone || '').replace(/"/g, '""')}"`,
          `"${(row.address || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          `"${(row.gn_division_detail?.name || '').replace(/"/g, '""')}"`,
          `"${row.date_of_birth || ''}"`,
          `"${row.sixty_fifth_birthday || ''}"`,
          `"${(row.firearm_type_detail?.name_si || '').replace(/"/g, '""')}"`,
          `"${(row.firearm_number || '').replace(/"/g, '""')}"`,
          `"${row.first_licensed_year || ''}"`,
          `"${row.renewal_status || ''}"`,
          `"${row.current_status || ''}"`
        ];
        csvRows.push(values.join(','));
      }

      // Add UTF-8 Byte Order Mark (BOM) to support Sinhala in Excel
      const csvContent = "\uFEFF" + csvRows.join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `ගිනිඅවි_බලපත්‍ර_වාර්තා_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Excel වාර්තාව සාර්ථකව බාගත කරන ලදී.');
    } catch (err) {
      console.error(err);
      toast.error('වාර්තා අපනයනය කිරීමට නොහැකි විය.');
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Header */}
      <Header />

      {/* API Error State */}
      {apiError ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', borderColor: '#fca5a5' }}>
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--danger-color)', marginBottom: '16px' }}>
            දත්ත සේවාව සමඟ සම්බන්ධ වීමට නොහැකි විය.
          </p>
          <button className="btn btn-primary" onClick={handleRetry}>
            නැවත උත්සාහ කරන්න
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <SummaryCards totalRecords={summary.total} totalGNDivisions={gnDivisions.length} />

          {/* Navigation Tab Bar */}
          <div className="tab-bar">
            <div className="tab-group">
              <button
                className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                {editingRecord ? 'වාර්තාව සංස්කරණය' : 'නව වාර්තාවක්'}
              </button>
              <button
                className={`tab-btn ${activeTab === 'table' ? 'active' : ''}`}
                onClick={() => setActiveTab('table')}
              >
                සුරැකි වාර්තා
                <span className="tab-badge">{totalCount}</span>
              </button>
            </div>
            <button className="btn-export" onClick={handleExportToExcel}>
              Excel Export
            </button>
          </div>

          {/* Tab Views */}
          {activeTab === 'form' ? (
            <RecordForm
              gnDivisions={gnDivisions}
              firearmTypes={firearmTypes}
              editingRecord={editingRecord}
              onSaveSuccess={handleSaveSuccess}
              onCancelEdit={handleCancelEdit}
            />
          ) : (
            <>
              {/* Search & Filters */}
              <SearchFilterBar
                gnDivisions={gnDivisions}
                firearmTypes={firearmTypes}
                search={search}
                filters={filters}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
                onSearchSubmit={handleSearchSubmit}
                onReset={handleResetFilters}
              />

              {/* Saved Records Table */}
              {loading ? (
                <LoadingSpinner />
              ) : (
                <RecordTable
                  records={records}
                  totalCount={totalCount}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onView={handleViewRecord}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteClick}
                  onNewRecordTabClick={() => setActiveTab('form')}
                />
              )}
            </>
          )}

          {/* View Details Modal */}
          <RecordViewModal
            isOpen={selectedRecord !== null}
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={deleteRecordId !== null}
            onClose={() => setDeleteRecordId(null)}
            onConfirm={handleDeleteConfirm}
          />

          {/* Footer Section */}
          <footer className="footer-section">
            <p>පඬුවස්නුවර ප්‍රාදේශීය ලේකම් කාර්යාලය</p>
            <span>නිල දත්ත ගොනුව පද්ධතිය තුළ සුරක්ෂිතව තබා ඇත.</span>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
