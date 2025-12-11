import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { companiesAPI, departmentsAPI, tasksAPI } from '../services/api';
import { ArrowLeft, Plus, Users, CheckCircle2, Trash2, BarChart3 } from 'lucide-react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import './CompanyDetail.css';

const CompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showDeptSelector, setShowDeptSelector] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [addingDept, setAddingDept] = useState(false);

  useEffect(() => {
    if (companyId) {
      loadCompany();
      loadDepartments();
    }
  }, [companyId]);

  useEffect(() => {
    if (selectedDepartment) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [selectedDepartment, companyId]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const response = await companiesAPI.getById(companyId);
      setCompany(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load company');
      if (err.response?.status === 404 || err.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await departmentsAPI.getAll(companyId);
      const depts = response.data;
      setDepartments(depts);
      
      // Auto-select first department if none selected
      if (depts.length > 0 && !selectedDepartment) {
        setSelectedDepartment(depts[0]._id);
      }
    } catch (err) {
      console.error('Load departments error:', err);
    }
  };

  const loadTasks = async () => {
    if (!selectedDepartment) return;
    
    try {
      const response = await tasksAPI.getAll({ 
        companyId, 
        departmentId: selectedDepartment 
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Load tasks error:', err);
    }
  };

  const handleAddDepartment = async (deptName) => {
    if (!deptName.trim()) return;

    try {
      setAddingDept(true);
      setError('');
      await departmentsAPI.create({
        name: deptName.trim(),
        companyId
      });
      setNewDeptName('');
      setShowDeptSelector(false);
      await loadDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create department');
    } finally {
      setAddingDept(false);
    }
  };

  const handleDeleteDepartment = async (e, deptId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this department and all its tasks?')) {
      return;
    }

    try {
      await departmentsAPI.delete(deptId);
      if (selectedDepartment === deptId) {
        setSelectedDepartment(null);
      }
      await loadDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete department');
    }
  };

  const handleSelectDepartment = (deptId) => {
    setSelectedDepartment(deptId);
    setShowTaskForm(false);
  };

  const handleTaskAdded = async () => {
    await loadTasks();
    setShowTaskForm(false);
  };

  const handleTaskUpdate = async () => {
    await loadTasks();
  };

  if (loading) {
    return (
      <div className="company-detail">
        <div className="loading-state">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  const currentDept = departments.find(d => d._id === selectedDepartment);

  return (
    <div className="company-detail">
      <div className="company-detail-header">
        <div>
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Companies
          </Link>
          <h2>{company.name}</h2>
        </div>
        <Link
          to={`/company/${companyId}/dashboard`}
          className="btn btn-primary"
        >
          <BarChart3 size={18} />
          View Dashboard
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="company-detail-content">
        <div className="department-sidebar">
          <div className="department-sidebar-header">
            <div>
              <h3>Departments</h3>
              <p className="header-subtitle">
                {departments.length === 0 
                  ? 'Create departments for your company' 
                  : `${departments.length} ${departments.length === 1 ? 'department' : 'departments'}`}
              </p>
            </div>
            <button
              className="btn-add-department"
              onClick={() => setShowDeptSelector(!showDeptSelector)}
              title="Add Department"
              type="button"
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>

          {showDeptSelector && (
            <div className="add-dept-form">
              <div className="form-header">
                <h4>Add New Department</h4>
                <p className="form-description">Enter the name of the department</p>
              </div>
              <div className="form-group">
                <label htmlFor="deptName">Department Name</label>
                <input
                  id="deptName"
                  type="text"
                  placeholder="e.g., Engineering, Sales"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !addingDept && newDeptName.trim()) {
                      handleAddDepartment(newDeptName);
                    }
                  }}
                  className="input"
                  autoFocus
                  disabled={addingDept}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowDeptSelector(false);
                    setNewDeptName('');
                  }}
                  disabled={addingDept}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleAddDepartment(newDeptName)}
                  disabled={addingDept || !newDeptName.trim()}
                  type="button"
                >
                  {addingDept ? (
                    <>
                      <span className="loading-spinner"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add Department
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {departments.length === 0 ? (
            <p className="empty-text">No departments yet. Add one to get started!</p>
          ) : (
            <div className="department-list">
              {departments.map(dept => {
                const taskCount = tasks.filter(t => t.departmentId?._id === dept._id || t.departmentId === dept._id).length;
                return (
                  <div key={dept._id} className="department-item-wrapper">
                    <button
                      className={`department-item ${selectedDepartment === dept._id ? 'active' : ''}`}
                      onClick={() => handleSelectDepartment(dept._id)}
                    >
                      <span>{dept.name}</span>
                      <span className="task-count">{taskCount}</span>
                    </button>
                    <button
                      className="btn-icon-small"
                      onClick={(e) => handleDeleteDepartment(e, dept._id)}
                      title="Delete Department"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="tasks-section">
          {currentDept ? (
            <>
              <div className="tasks-section-header">
                <div>
                  <h3>{currentDept.name} Tasks</h3>
                  <p className="header-subtitle">
                    {tasks.length === 0 
                      ? 'Create and manage tasks for this department' 
                      : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} in this department`}
                  </p>
                </div>
                <button
                  className="btn-add-task"
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  type="button"
                >
                  <Plus size={22} />
                  <span>Add Task</span>
                </button>
              </div>

              {showTaskForm && (
                <TaskForm
                  companyId={companyId}
                  companyName={company.name}
                  departmentId={selectedDepartment}
                  departmentName={currentDept.name}
                  onTaskAdded={handleTaskAdded}
                  onCancel={() => setShowTaskForm(false)}
                />
              )}

              <div className="tasks-grid">
                {tasks.length === 0 ? (
                  <div className="empty-state">
                    <CheckCircle2 size={64} color="var(--gray-400)" />
                    <p>No tasks in this department yet. Add your first task!</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      companyId={companyId}
                      departmentId={selectedDepartment}
                      companyName={company.name}
                      departmentName={currentDept.name}
                      onUpdate={handleTaskUpdate}
                    />
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Users size={64} color="var(--gray-400)" />
              <p>Select a department or add a new one to start managing tasks!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
