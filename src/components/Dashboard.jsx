import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tasksAPI, companiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { isToday, isPast, parseISO, addDays, startOfDay } from 'date-fns';
import { AlertCircle, Clock, Calendar, CheckCircle2, Building2 } from 'lucide-react';
import TaskCard from './TaskCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isMaster, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [allTasks, setAllTasks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [dueTodayTasks, setDueTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [companyStats, setCompanyStats] = useState([]);
  const [selectedView, setSelectedView] = useState('overdue');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect based on user role
    if (!loading && user) {
      if (isAdmin && !isMaster && user.companyId) {
        // Admin should see their company dashboard
        navigate(`/company/${user.companyId}/dashboard`, { replace: true });
        return;
      } else if (!isMaster && !isAdmin) {
        // Regular user should see their personal dashboard
        navigate('/my-tasks', { replace: true });
        return;
      }
    }
    
    // Only load master dashboard data if user is master
    if (isMaster) {
      loadDashboardData();
    }
  }, [user, loading, isMaster, isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all tasks and companies in parallel
      const [tasksResponse, companiesResponse] = await Promise.all([
        tasksAPI.getAll(),
        companiesAPI.getAll()
      ]);

      const tasks = tasksResponse.data;
      const companiesData = companiesResponse.data;

      setAllTasks(tasks);
      setCompanies(companiesData);

      // Filter tasks
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

      // Calculate company statistics
      const stats = companiesData.map(company => {
        const companyTasks = tasks.filter(t => 
          t.companyId?._id === company._id || t.companyId === company._id
        );
        const total = companyTasks.length;
        const completed = companyTasks.filter(t => t.status === 'Completed').length;
        const overdue = companyTasks.filter(task => {
          if (task.status === 'Completed') return false;
          const deadline = startOfDay(parseISO(task.deadline));
          return isPast(deadline) && !isToday(deadline);
        }).length;
        const dueToday = companyTasks.filter(task => {
          if (task.status === 'Completed') return false;
          return isToday(parseISO(task.deadline));
        }).length;

        return {
          companyId: company._id,
          companyName: company.name,
          totalTasks: total,
          completedTasks: completed,
          overdueTasks: overdue,
          dueTodayTasks: dueToday,
          progress: total > 0 ? (completed / total) * 100 : 0
        };
      });

      setCompanyStats(stats);
    } catch (err) {
      console.error('Load dashboard error:', err);
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

  // Show loading or redirect message if not master
  if (loading || !isMaster) {
    return (
      <div className="dashboard">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  const totalTasks = allTasks.length;
  const totalCompleted = allTasks.filter(t => t.status === 'Completed').length;
  const totalProgress = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Master Dashboard</h2>
          <p>Overview of all companies and tasks</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card total-stat">
          <div className="stat-icon">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{companies.length}</div>
            <div className="stat-label">Companies</div>
          </div>
        </div>

        <div className="stat-card total-stat">
          <div className="stat-icon">
            <AlertCircle size={24} />
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
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{Math.round(totalProgress)}%</div>
            <div className="stat-label">Progress</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
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
              getTasksForView().slice(0, 12).map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  companyId={task.companyId?._id || task.companyId}
                  departmentId={task.departmentId?._id || task.departmentId}
                  companyName={task.companyId?.name}
                  departmentName={task.departmentId?.name}
                  onUpdate={loadDashboardData}
                />
              ))
            )}
          </div>
        </div>

        <div className="companies-section">
          <h3>Companies Overview</h3>
          {companyStats.length === 0 ? (
            <div className="empty-state">
              <Building2 size={48} color="var(--gray-400)" />
              <p>No companies yet.</p>
            </div>
          ) : (
            <div className="company-stats-list">
              {companyStats.map(stat => (
                <Link
                  key={stat.companyId}
                  to={`/company/${stat.companyId}/dashboard`}
                  className="company-stat-card"
                >
                  <div className="company-stat-header">
                    <Building2 size={20} />
                    <h4>{stat.companyName}</h4>
                  </div>
                  <div className="company-stat-details">
                    <div className="company-stat-item">
                      <span className="label">Total Tasks:</span>
                      <span className="value">{stat.totalTasks}</span>
                    </div>
                    <div className="company-stat-item">
                      <span className="label">Completed:</span>
                      <span className="value completed">{stat.completedTasks}</span>
                    </div>
                    {stat.overdueTasks > 0 && (
                      <div className="company-stat-item">
                        <span className="label">🔴 Overdue:</span>
                        <span className="value overdue">{stat.overdueTasks}</span>
                      </div>
                    )}
                    {stat.dueTodayTasks > 0 && (
                      <div className="company-stat-item">
                        <span className="label">🟡 Due Today:</span>
                        <span className="value due-today">{stat.dueTodayTasks}</span>
                      </div>
                    )}
                  </div>
                  {stat.totalTasks > 0 && (
                    <div className="company-stat-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${stat.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{Math.round(stat.progress)}% Complete</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
