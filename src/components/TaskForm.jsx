import React, { useState, useEffect } from 'react';
import { tasksAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { TASK_STATUS } from '../utils/reminders';
import { User } from 'lucide-react';
import './TaskForm.css';

const TaskForm = ({ companyId, companyName, departmentId, departmentName, onTaskAdded, onCancel }) => {
  const { isMaster, user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    taskName: '',
    assignedTo: '',
    deadline: '',
    status: TASK_STATUS.NOT_STARTED
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    loadTeamMembers();
  }, [companyId]);

  const loadTeamMembers = async () => {
    try {
      setLoadingMembers(true);
      // Fetch users for this company, including master user
      const params = companyId ? { companyId, teamMembers: 'true' } : { teamMembers: 'true' };
      
      const response = await usersAPI.getAll(params);
      const users = response.data || [];
      
      // Filter and format for dropdown
      const members = users
        .filter(user => {
          if (!user.isActive) return false;
          
          // For admins: Only show users from this specific company (no master)
          if (!isMaster && companyId) {
            // Exclude master user for admins
            if (user.role === 'master') return false;
            // Only include users from this company
            if (user.companyId) {
              return user.companyId.toString() === companyId || user.companyId._id?.toString() === companyId;
            }
            return false;
          }
          
          // For master users: Include master user and all company users
          if (isMaster) {
            // Include master user
            if (user.role === 'master') return true;
            // Include users from this company
            if (companyId && user.companyId) {
              return user.companyId.toString() === companyId || user.companyId._id?.toString() === companyId;
            }
            // If no companyId, include all active users for master
            return true;
          }
          
          return false;
        })
        .map(user => ({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId?._id || user.companyId
        }));
      
      // Sort: master first, then admin, then users
      members.sort((a, b) => {
        const roleOrder = { master: 0, admin: 1, user: 2 };
        return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
      });
      
      setTeamMembers(members);
    } catch (err) {
      console.error('Failed to load team members:', err);
      // Allow manual entry if fetch fails
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.taskName.trim() || !formData.deadline) {
      setError('Task name and deadline are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await tasksAPI.create({
        taskName: formData.taskName.trim(),
        assignedTo: formData.assignedTo.trim() || 'Unassigned',
        deadline: new Date(formData.deadline).toISOString(),
        status: formData.status,
        companyId,
        departmentId
      });

      setFormData({
        taskName: '',
        assignedTo: '',
        deadline: '',
        status: TASK_STATUS.NOT_STARTED
      });
      setShowCustomInput(false);
      onTaskAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'assignedTo' && value === '__custom__') {
      setShowCustomInput(true);
      setFormData(prev => ({
        ...prev,
        assignedTo: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setShowCustomInput(false);
    }
    setError('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-header">
        <h4>Add New Task</h4>
        <div className="task-form-meta">
          <span>{companyName}</span>
          <span>•</span>
          <span>{departmentName}</span>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="taskName">Task Name *</label>
        <input
          type="text"
          id="taskName"
          name="taskName"
          value={formData.taskName}
          onChange={handleChange}
          className="input"
          placeholder="Enter task name"
          required
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="assignedTo">
            <User size={16} />
            Assigned To
          </label>
          {!showCustomInput && teamMembers.length > 0 ? (
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="input"
              disabled={loading || loadingMembers}
            >
              <option value="">Select team member</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.name}>
                  {member.name} {member.role === 'master' ? '(Master)' : member.role === 'admin' ? '(Admin)' : ''}
                </option>
              ))}
              <option value="__custom__">--- Enter custom name ---</option>
            </select>
          ) : (
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="input"
              placeholder={loadingMembers ? 'Loading team members...' : 'Team member name'}
              disabled={loading || loadingMembers}
            />
          )}
          {loadingMembers && (
            <small style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>
              Loading team members...
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline *</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="input"
            min={new Date().toISOString().split('T')[0]}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input"
          disabled={loading}
        >
          {Object.values(TASK_STATUS).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
