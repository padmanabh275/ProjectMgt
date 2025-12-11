import React, { useState } from 'react';
import { format, parseISO, isToday, isPast } from 'date-fns';
import { tasksAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { TASK_STATUS, getTaskStatusColor } from '../utils/reminders';
import { Calendar, User, Trash2, CheckCircle2, Circle, Clock, AlertCircle, MessageSquare, Edit2, Save, X } from 'lucide-react';
import './TaskCard.css';

const TaskCard = ({ task, companyId, departmentId, companyName, departmentName, onUpdate }) => {
  const { user, isMaster, isAdmin } = useAuth();
  const [editStatus, setEditStatus] = useState(task.status);
  const [updating, setUpdating] = useState(false);
  const [comments, setComments] = useState(task.comments || '');
  const [isEditingComments, setIsEditingComments] = useState(false);
  const [savingComments, setSavingComments] = useState(false);
  const deadline = parseISO(task.deadline);
  const statusColor = getTaskStatusColor(task);
  const isOverdue = isPast(deadline) && !isToday(deadline) && task.status !== TASK_STATUS.COMPLETED;
  const isDueToday = isToday(deadline) && task.status !== TASK_STATUS.COMPLETED;
  
  // Check if current user is assigned to this task
  const isAssignedToMe = task.assignedTo && user?.name && 
    task.assignedTo.toLowerCase().trim() === user.name.toLowerCase().trim();
  
  // Regular users can only see/edit comments on tasks assigned to them
  const canEditComments = isMaster || isAdmin || isAssignedToMe;
  const canDelete = isMaster || isAdmin;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setEditStatus(newStatus);
    
    try {
      setUpdating(true);
      await tasksAPI.update(task._id, { status: newStatus });
      onUpdate();
    } catch (err) {
      console.error('Update task error:', err);
      setEditStatus(task.status); // Revert on error
      alert(err.response?.data?.message || 'Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(task._id);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleSaveComments = async () => {
    try {
      setSavingComments(true);
      await tasksAPI.update(task._id, { comments });
      setIsEditingComments(false);
      onUpdate();
    } catch (err) {
      console.error('Update comments error:', err);
      alert(err.response?.data?.message || 'Failed to save comments');
    } finally {
      setSavingComments(false);
    }
  };

  const handleCancelEdit = () => {
    setComments(task.comments || '');
    setIsEditingComments(false);
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case TASK_STATUS.COMPLETED:
        return <CheckCircle2 size={18} className="status-icon completed" />;
      case TASK_STATUS.IN_PROGRESS:
        return <Clock size={18} className="status-icon in-progress" />;
      case TASK_STATUS.DELAYED:
        return <AlertCircle size={18} className="status-icon delayed" />;
      default:
        return <Circle size={18} className="status-icon not-started" />;
    }
  };

  // Get company and department names from populated data or props
  const displayCompanyName = task.companyId?.name || companyName;
  const displayDeptName = task.departmentId?.name || departmentName;

  return (
    <div className={`task-card ${statusColor === 'red' ? 'overdue' : ''} ${statusColor === 'yellow' ? 'due-today' : ''} ${statusColor === 'green' ? 'completed' : ''}`}>
      <div className="task-card-header">
        <div className="task-status-indicator">
          {getStatusIcon()}
          {isOverdue && <span className="status-badge overdue-badge">🔴 Overdue</span>}
          {isDueToday && <span className="status-badge due-today-badge">🟡 Due Today</span>}
          {task.status === TASK_STATUS.COMPLETED && <span className="status-badge completed-badge">🟢 Completed</span>}
        </div>
        <div className="task-card-actions">
          <select
            value={editStatus}
            onChange={handleStatusChange}
            className="status-select"
            onClick={(e) => e.stopPropagation()}
            disabled={updating}
          >
            {Object.values(TASK_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {canDelete && (
            <button
              className="btn-icon"
              onClick={handleDelete}
              title="Delete Task"
              disabled={updating}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <h4 className="task-name">{task.taskName}</h4>

      <div className="task-meta">
        <div className="task-meta-item">
          <User size={16} />
          <span>{task.assignedTo || 'Unassigned'}</span>
        </div>
        <div className="task-meta-item">
          <Calendar size={16} />
          <span>{format(deadline, 'MMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="task-context">
        <span className="context-badge company">{displayCompanyName}</span>
        <span className="context-badge department">{displayDeptName}</span>
      </div>

      {/* Comments Section */}
      {canEditComments && (
        <div className="task-comments-section">
          <div className="comments-header">
            <MessageSquare size={16} />
            <span className="comments-title">
              Comments {isMaster || isAdmin ? '(Visible to Admin)' : '(For Admin)'}
            </span>
          </div>
          
          {isEditingComments ? (
            <div className="comments-edit">
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your comments here for admin to see..."
                className="comments-textarea"
                rows={3}
                disabled={savingComments}
              />
              <div className="comments-actions">
                <button
                  className="btn-icon btn-save"
                  onClick={handleSaveComments}
                  disabled={savingComments}
                  title="Save Comments"
                >
                  <Save size={14} />
                  {savingComments ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="btn-icon btn-cancel"
                  onClick={handleCancelEdit}
                  disabled={savingComments}
                  title="Cancel"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="comments-display">
              {task.comments ? (
                <p className="comments-text">{task.comments}</p>
              ) : (
                <p className="comments-placeholder">No comments yet. Click edit to add.</p>
              )}
              <button
                className="btn-icon btn-edit-comments"
                onClick={() => setIsEditingComments(true)}
                title="Edit Comments"
              >
                <Edit2 size={14} />
                {task.comments ? 'Edit' : 'Add Comment'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
