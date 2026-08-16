import { useEffect, useState } from 'react';
import api from '../services/api';
import './LicenseHoldersList.css';
import { useNavigate } from 'react-router-dom';

interface LicenseHolder {
  id: number;
  full_name: string;
  nic: string;
  telephone_number: string;
  gn_division_name: string;
  current_status: string;
  created_at: string;
}

const LicenseHoldersList = () => {
  const [holders, setHolders] = useState<LicenseHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHolders();
  }, []);

  const fetchHolders = async () => {
    try {
      const response = await api.get('/license-holders/');
      setHolders(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch holders', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'badge-success';
      case 'not renewed': return 'badge-danger';
      case 'renewal due': return 'badge-warning';
      case 'transferred': return 'badge-neutral';
      case 'deceased': return 'badge-dark';
      default: return 'badge-info';
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>License Holders</h1>
        <button className="btn-primary" onClick={() => navigate('/license-holders/new')}>+ Add New</button>
      </div>

      <div className="filters-bar">
        <input type="text" placeholder="Search by name or NIC..." className="search-input" />
        <select className="filter-select">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Not Renewed">Not Renewed</option>
        </select>
        <button className="btn-secondary">Search</button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading records...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>NIC</th>
                <th>GN Division</th>
                <th>Telephone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">No license holders found.</td>
                </tr>
              ) : (
                holders.map(holder => (
                  <tr key={holder.id}>
                    <td>{holder.full_name}</td>
                    <td>{holder.nic}</td>
                    <td>{holder.gn_division_name}</td>
                    <td>{holder.telephone_number}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(holder.current_status)}`}>
                        {holder.current_status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button className="btn-link">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LicenseHoldersList;
