import React, { useState, useEffect } from 'react';
import { usersAPI, companiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, Plus, Edit2, Trash2, Mail, User as UserIcon, Building2, Shield } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
  const { user: currentUser, isMaster } = useAuth();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    companyId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [usersResponse, companiesResponse] = await Promise.all([
        usersAPI.getAll(),
        companiesAPI.getAll()
      ]);

      setUsers(usersResponse.data);
      setCompanies(companiesResponse.data);
      
      // Pre-select company for non-masters
      if (!isMaster && currentUser?.companyId) {
        setFormData(prev => ({
          ...prev,
          companyId: currentUser.companyId
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingUser) {
        // Update user
        const updateData = {
          name: formData.name,
          role: formData.role
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        if (isMaster && formData.companyId) {
          updateData.companyId = formData.companyId;
        }

        await usersAPI.update(editingUser._id, updateData);
      } else {
        // Create user
        if (!formData.password) {
          setError('Password is required for new users');
          return;
        }

        await usersAPI.create({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          companyId: formData.companyId || currentUser.companyId
        });
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      companyId: user.companyId?._id || user.companyId || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      companyId: isMaster ? '' : (currentUser?.companyId || '')
    });
    setEditingUser(null);
    setShowAddForm(false);
  };

  const getRoleBadge = (role) => {
    const colors = {
      master: '#8b5cf6',
      admin: '#3b82f6',
      user: '#6b7280'
    };
    return (
      <span className="role-badge" style={{ background: colors[role] || colors.user }}>
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading-state">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div>
          <h2>User Management</h2>
          <p className="header-subtitle">
            {users.length === 0 
              ? 'Create and manage user accounts' 
              : `${users.length} ${users.length === 1 ? 'user' : 'users'} managed`}
          </p>
        </div>
        <button
          className="btn-add-user"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          type="button"
        >
          <Plus size={22} />
          <span>Add User</span>
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showAddForm && (
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
            <button type="button" className="btn-icon" onClick={resetForm}>
              ×
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                required
                disabled={!!editingUser}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input"
                required
              >
                {isMaster && <option value="master">Master</option>}
                {isMaster && <option value="admin">Admin</option>}
                <option value="user">User</option>
              </select>
            </div>

            {isMaster && (
              <div className="form-group">
                <label htmlFor="companyId">Company</label>
                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password {editingUser ? '(leave blank to keep current password)' : '*'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              required={!editingUser}
              minLength={6}
              placeholder={editingUser ? "Enter new password to change (leave blank to keep current)" : "Enter password (min 6 characters)"}
            />
            {editingUser && (
              <small className="form-hint">
                To change password, enter a new password (min 6 characters). Leave blank to keep the current password.
              </small>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingUser ? 'Update User' : 'Create User'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="users-table">
        <div className="table-header">
          <div>User</div>
          <div>Email</div>
          <div>Role</div>
          <div>Company</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <Users size={64} color="var(--gray-400)" />
            <p>No users found. Add your first user!</p>
          </div>
        ) : (
          users.map(user => (
            <div key={user._id} className="table-row">
              <div className="user-info">
                <UserIcon size={20} />
                <span>{user.name}</span>
              </div>
              <div>
                <Mail size={16} />
                {user.email}
              </div>
              <div>{getRoleBadge(user.role)}</div>
              <div>
                {user.companyId?.name || (
                  <span className="text-muted">No company</span>
                )}
              </div>
              <div>
                <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(user)}
                  title="Edit User"
                >
                  <Edit2 size={16} />
                </button>
                {user._id !== currentUser._id && (
                  <button
                    className="btn-icon"
                    onClick={() => handleDelete(user._id)}
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManagement;

