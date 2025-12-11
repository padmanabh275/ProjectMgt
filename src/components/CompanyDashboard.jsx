import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tasksAPI, companiesAPI, departmentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { isToday, isPast, parseISO, addDays, startOfDay } from 'date-fns';
import { AlertCircle, Clock, Calendar, CheckCircle2, Building2, ArrowLeft, Users, TrendingUp } from 'lucide-react';
import TaskCard from './TaskCard';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { isMaster, user, isAdmin } = useAuth();
  const [company, setCompany] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [dueTodayTasks, setDueTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});
  const [selectedView, setSelectedView] = useState('overdue');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify access rights
    if (user && companyId) {
      // Admin can only access their own company dashboard
      if (isAdmin && !isMaster && user.companyId?.toString() !== companyId) {
        // Redirect admin to their company dashboard
        if (user.companyId) {
          navigate(`/company/${user.companyId}/dashboard`, { replace: true });
          return;
        }
      }
      
      // Regular users should see their personal dashboard
      if (!isMaster && !isAdmin) {
        navigate('/my-tasks', { replace: true });
        return;
      }
    }
    
    if (companyId) {
      loadCompanyData();
    }
  }, [companyId, user, isMaster, isAdmin]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      
      // Load company, departments, and tasks in parallel
      const [companyResponse, departmentsResponse, tasksResponse] = await Promise.all([
        companiesAPI.getById(companyId),
        departmentsAPI.getAll(companyId),
        tasksAPI.getAll({ companyId })
      ]);

      const companyData = companyResponse.data;
      const departmentsData = departmentsResponse.data;
      const tasks = tasksResponse.data;

      setCompany(companyData);
      setDepartments(departmentsData);
      setAllTasks(tasks);

      // Filter tasks by date
      const today = startOfDay(new Date());
      const sevenDaysLater = addDays(today, 7);

      const overdue = tasks.filter(task => {
        if (task.status === 'Completed') return false;
        const deadline = startOfDay(parseISO(task.deadline));
        return isPast(deadline) && !isToday(deadline);
      });

      const dueToday = tasks.filter(task => {
        if (task.status === 'Completed') return false;
        return isToday(parseISO(task.deadline));
      });

      const upcoming = tasks.filter(task => {
        if (task.status === 'Completed') return false;
        const deadline = parseISO(task.deadline);
        return deadline > today && deadline <= sevenDaysLater;
      });

      const completed = tasks
        .filter(task => task.status === 'Completed')
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 20);

      setOverdueTasks(overdue);
      setDueTodayTasks(dueToday);
      setUpcomingTasks(upcoming);
      setCompletedTasks(completed);

      // Calculate department statistics
      const stats = {};
      departmentsData.forEach(dept => {
        const deptTasks = tasks.filter(t => 
          t.departmentId?._id === dept._id || t.departmentId === dept._id
        );
        const total = deptTasks.length;
        const completed = deptTasks.filter(t => t.status === 'Completed').length;
        const overdue = deptTasks.filter(task => {
          if (task.status === 'Completed') return false;
          const deadline = startOfDay(parseISO(task.deadline));
          return isPast(deadline) && !isToday(deadline);
        }).length;
        const dueToday = deptTasks.filter(task => {
          if (task.status === 'Completed') return false;
          return isToday(parseISO(task.deadline));
        }).length;

        stats[dept._id] = {
          name: dept.name,
          total,
          completed,
          overdue,
          dueToday,
          progress: total > 0 ? (completed / total) * 100 : 0
        };
      });

      setDepartmentStats(stats);
    } catch (err) {
      console.error('Load company dashboard error:', err);
      if (err.response?.status === 404 || err.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTasksForView = () => {
    switch (selectedView) {
      case 'overdue':
        return overdueTasks;
      case 'due-today':
        return dueTodayTasks;
      case 'upcoming':
        return upcomingTasks;
      case 'completed':
        return completedTasks;
      default:
        return [];
    }
  };

  const getViewTitle = () => {
    switch (selectedView) {
      case 'overdue':
        return 'Overdue Tasks';
      case 'due-today':
        return 'Tasks Due Today';
      case 'upcoming':
        return 'Upcoming Tasks (Next 7 Days)';
      case 'completed':
        return 'Recently Completed';
      default:
        return 'Tasks';
    }
  };

  const totalTasks = allTasks.length;
  const totalCompleted = allTasks.filter(t => t.status === 'Completed').length;
  const totalProgress = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;

  if (loading) {
    return (
      <div className="company-dashboard">
        <div className="loading-state">Loading company dashboard...</div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="company-dashboard">
      <div className="company-dashboard-header">
        <Link to={isMaster ? "/dashboard" : "/"} className="back-link">
          <ArrowLeft size={20} />
          {isMaster ? 'Back to Dashboard' : 'Back to Companies'}
        </Link>
        <div>
          <h2>{company.name} Dashboard</h2>
          <p>Complete overview of tasks and departments</p>
        </div>
      </div>

      <div className="company-dashboard-stats">
        <div className="stat-card total-stat">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card overdue-stat">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{overdueTasks.length}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>

        <div className="stat-card due-today-stat">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dueTodayTasks.length}</div>
            <div className="stat-label">Due Today</div>
          </div>
        </div>

        <div className="stat-card completed-stat">
          <div className="stat-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalCompleted}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-card progress-stat">
          <div className="stat-icon">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{Math.round(totalProgress)}%</div>
            <div className="stat-label">Progress</div>
          </div>
        </div>
      </div>

      <div className="company-dashboard-content">
        <div className="tasks-section">
          <div className="view-tabs">
            <button
              className={`view-tab ${selectedView === 'overdue' ? 'active' : ''}`}
              onClick={() => setSelectedView('overdue')}
            >
              🔴 Overdue ({overdueTasks.length})
            </button>
            <button
              className={`view-tab ${selectedView === 'due-today' ? 'active' : ''}`}
              onClick={() => setSelectedView('due-today')}
            >
              🟡 Due Today ({dueTodayTasks.length})
            </button>
            <button
              className={`view-tab ${selectedView === 'upcoming' ? 'active' : ''}`}
              onClick={() => setSelectedView('upcoming')}
            >
              📅 Upcoming ({upcomingTasks.length})
            </button>
            <button
              className={`view-tab ${selectedView === 'completed' ? 'active' : ''}`}
              onClick={() => setSelectedView('completed')}
            >
              🟢 Completed ({completedTasks.length})
            </button>
          </div>

          <h3>{getViewTitle()}</h3>
          <div className="tasks-grid">
            {getTasksForView().length === 0 ? (
              <div className="empty-state">
                <p>No tasks in this category.</p>
              </div>
            ) : (
              getTasksForView().map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  companyId={companyId}
                  departmentId={task.departmentId?._id || task.departmentId}
                  companyName={company.name}
                  departmentName={task.departmentId?.name}
                  onUpdate={loadCompanyData}
                />
              ))
            )}
          </div>
        </div>

        <div className="departments-section">
          <h3>Departments Overview</h3>
          {departments.length === 0 ? (
            <div className="empty-state">
              <Users size={48} color="var(--gray-400)" />
              <p>No departments yet.</p>
            </div>
          ) : (
            <div className="department-stats-list">
              {departments.map(dept => {
                const stats = departmentStats[dept._id] || { total: 0, completed: 0, progress: 0 };
                return (
                  <Link
                    key={dept._id}
                    to={`/company/${companyId}`}
                    className="department-stat-card"
                  >
                    <div className="department-stat-header">
                      <Users size={20} />
                      <h4>{dept.name}</h4>
                    </div>
                    <div className="department-stat-details">
                      <div className="department-stat-item">
                        <span className="label">Total Tasks:</span>
                        <span className="value">{stats.total}</span>
                      </div>
                      <div className="department-stat-item">
                        <span className="label">Completed:</span>
                        <span className="value completed">{stats.completed}</span>
                      </div>
                      {stats.overdue > 0 && (
                        <div className="department-stat-item">
                          <span className="label">🔴 Overdue:</span>
                          <span className="value overdue">{stats.overdue}</span>
                        </div>
                      )}
                      {stats.dueToday > 0 && (
                        <div className="department-stat-item">
                          <span className="label">🟡 Due Today:</span>
                          <span className="value due-today">{stats.dueToday}</span>
                        </div>
                      )}
                    </div>
                    {stats.total > 0 && (
                      <div className="department-stat-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${stats.progress}%` }}
                          />
                        </div>
                        <span className="progress-text">{Math.round(stats.progress)}% Complete</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

