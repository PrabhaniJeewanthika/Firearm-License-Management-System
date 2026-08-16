import { useEffect, useState } from 'react';
import api from '../services/api';
import './Dashboard.css';

interface DashboardStats {
  total_holders: number;
  active_licenses: number;
  renewal_due: number;
  not_renewed: number;
  transferred: number;
  deceased: number;
  outside_area: number;
  age_65_reached: number;
  age_65_upcoming: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/dashboard/');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!stats) return <div className="empty-state">No data available.</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Overview</h1>
        <div className="quick-actions">
          <button className="btn-primary">Add License Holder</button>
          <button className="btn-secondary">Generate Report</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <h3>Total Holders</h3>
          <div className="stat-value">{stats.total_holders}</div>
        </div>
        <div className="stat-card success">
          <h3>Active Licenses</h3>
          <div className="stat-value">{stats.active_licenses}</div>
        </div>
        <div className="stat-card warning">
          <h3>Renewal Due</h3>
          <div className="stat-value">{stats.renewal_due}</div>
        </div>
        <div className="stat-card danger">
          <h3>Not Renewed</h3>
          <div className="stat-value">{stats.not_renewed}</div>
        </div>
        <div className="stat-card neutral">
          <h3>Transferred</h3>
          <div className="stat-value">{stats.transferred}</div>
        </div>
        <div className="stat-card neutral">
          <h3>Deceased</h3>
          <div className="stat-value">{stats.deceased}</div>
        </div>
        <div className="stat-card info">
          <h3>Outside Area</h3>
          <div className="stat-value">{stats.outside_area}</div>
        </div>
      </div>

      <div className="monitoring-section">
        <div className="monitoring-card">
          <h2>Age 65 Monitoring</h2>
          <div className="monitoring-stats">
            <div className="monitoring-item">
              <span className="label">Already reached age 65:</span>
              <span className="value danger-text">{stats.age_65_reached}</span>
            </div>
            <div className="monitoring-item">
              <span className="label">Reaching age 65 soon (90 days):</span>
              <span className="value warning-text">{stats.age_65_upcoming}</span>
            </div>
          </div>
        </div>

        <div className="monitoring-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p>License holder updated</p>
                <small>Today 10:35 AM</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
