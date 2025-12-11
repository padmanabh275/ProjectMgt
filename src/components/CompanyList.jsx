import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companiesAPI, tasksAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Plus, Trash2, BarChart3, ListTodo } from 'lucide-react';
import './CompanyList.css';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [companyStats, setCompanyStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, isMaster, user } = useAuth();

  useEffect(() => {
    // Redirect regular users to their personal dashboard
    if (user && !isMaster && !isAdmin) {
      navigate('/my-tasks', { replace: true });
      return;
    }
    
    // Redirect admin to their company dashboard if they have a company
    if (user && isAdmin && !isMaster && user.companyId) {
      navigate(`/company/${user.companyId}/dashboard`, { replace: true });
      return;
    }
    
    loadCompanies();
  }, [user, isMaster, isAdmin]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await companiesAPI.getAll();
      const companiesData = response.data;
      setCompanies(companiesData);
      
      // Load task statistics for each company
      await loadCompanyStats(companiesData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load companies');
      console.error('Load companies error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyStats = async (companiesData) => {
    try {
      const stats = {};
      for (const company of companiesData) {
        const tasksResponse = await tasksAPI.getAll({ companyId: company._id });
        const tasks = tasksResponse.data;
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        stats[company._id] = {
          total: totalTasks,
          completed: completedTasks,
          progress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        };
      }
      setCompanyStats(stats);
    } catch (err) {
      console.error('Load stats error:', err);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    try {
      setAdding(true);
      setError('');
      await companiesAPI.create({ name: newCompanyName.trim() });
      setNewCompanyName('');
      setShowAddForm(false);
      await loadCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create company');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCompany = async (e, companyId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this company and all its tasks?')) {
      return;
    }

    try {
      await companiesAPI.delete(companyId);
      await loadCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete company');
    }
  };

  if (loading) {
    return (
      <div className="company-list">
        <div className="loading-state">
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-list">
      <div className="company-list-header">
        <div>
          <h2>Companies</h2>
          <p className="header-subtitle">
            {companies.length === 0 
              ? 'Create and manage your companies' 
              : `${companies.length} ${companies.length === 1 ? 'company' : 'companies'} managed`}
          </p>
        </div>
        {isAdmin && (
          <button 
            className="btn-add-company"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={adding}
            type="button"
          >
            <Plus size={22} />
            <span>Add Company</span>
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showAddForm && isAdmin && (
        <form className="add-company-form" onSubmit={handleAddCompany}>
          <div className="form-header">
            <h3>Add New Company</h3>
            <p className="form-description">Enter the name of the company you want to create</p>
          </div>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              type="text"
              placeholder="e.g., Acme Corporation"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              autoFocus
              className="input"
              disabled={adding}
              required
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setShowAddForm(false);
                setNewCompanyName('');
              }}
              disabled={adding}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={adding || !newCompanyName.trim()}>
              {adding ? (
                <>
                  <span className="loading-spinner"></span>
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Company
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="company-grid">
        {companies.length === 0 ? (
          <div className="empty-state">
            <Building2 size={64} color="var(--gray-400)" />
            <p>No companies yet. {isAdmin ? 'Add your first company to get started!' : 'No companies assigned to you.'}</p>
          </div>
        ) : (
          companies.map(company => {
            const stats = companyStats[company._id] || { total: 0, completed: 0, progress: 0 };

            return (
              <div
                key={company._id}
                className="company-card"
              >
                <div className="company-card-header">
                  <Building2 size={24} />
                  <h3>{company.name}</h3>
                  {isAdmin && (
                    <button
                      className="btn-icon"
                      onClick={(e) => handleDeleteCompany(e, company._id)}
                      title="Delete Company"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="company-card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/company/${company._id}/dashboard`);
                    }}
                    type="button"
                  >
                    <BarChart3 size={18} />
                    Dashboard
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/company/${company._id}`);
                    }}
                    type="button"
                  >
                    <ListTodo size={18} />
                    Manage Tasks
                  </button>
                </div>
                <div className="company-card-stats">
                  <div className="stat">
                    <span className="stat-label">Total Tasks</span>
                    <span className="stat-value">{stats.total}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Completed</span>
                    <span className="stat-value">{stats.completed}</span>
                  </div>
                </div>
                {stats.total > 0 && (
                  <div className="company-card-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{Math.round(stats.progress)}% Complete</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CompanyList;
