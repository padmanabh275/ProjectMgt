import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tasksAPI, companiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { isToday, isPast, parseISO, addDays, startOfDay } from 'date-fns';
import { AlertCircle, Clock, Calendar, CheckCircle2, User, Building2, ArrowLeft, TrendingUp } from 'lucide-react';
import TaskCard from './TaskCard';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myTasks, setMyTasks] = useState([]);
  const [company, setCompany] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [dueTodayTasks, setDueTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedView, setSelectedView] = useState('overdue');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserTasks();
  }, []);

  const loadUserTasks = async () => {
    try {
      setLoading(true);
      
      // Load user's tasks and company info
      const tasksResponse = await tasksAPI.getAll({ 
        companyId: user?.companyId 
      });
      
      const allTasks = tasksResponse.data || [];
      
      // Filter tasks assigned to this user
      const myAssignedTasks = allTasks.filter(task => 
        task.assignedTo && 
        task.assignedTo.toLowerCase().trim() === user?.name.toLowerCase().trim()
      );
      
      setMyTasks(myAssignedTasks);
      
      // Load company info
      if (user?.companyId) {
        try {
          const companyResponse = await companiesAPI.getById(user.companyId);
          setCompany(companyResponse.data);
        } catch (err) {
          console.error('Failed to load company:', err);
        }
      }

      // Filter tasks by date
      const today = startOfDay(new Date());
      const sevenDaysLater = addDays(today, 7);

      const overdue = myAssignedTasks.filter(task => {
        if (task.status === 'Completed') return false;
        const deadline = startOfDay(parseISO(task.deadline));
        return isPast(deadline) && !isToday(deadline);
      });

      const dueToday = myAssignedTasks.filter(task => {
        if (task.status === 'Completed') return false;
        return isToday(parseISO(task.deadline));
      });

      const upcoming = myAssignedTasks.filter(task => {
        if (task.status === 'Completed') return false;
        const deadline = parseISO(task.deadline);
        return deadline > today && deadline <= sevenDaysLater;
      });

      const completed = myAssignedTasks
        .filter(task => task.status === 'Completed')
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

      setOverdueTasks(overdue);
      setDueTodayTasks(dueToday);
      setUpcomingTasks(upcoming);
      setCompletedTasks(completed);
    } catch (err) {
      console.error('Load user tasks error:', err);
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
        return 'My Overdue Tasks';
      case 'due-today':
        return 'My Tasks Due Today';
      case 'upcoming':
        return 'My Upcoming Tasks (Next 7 Days)';
      case 'completed':
        return 'My Completed Tasks';
      default:
        return 'My Tasks';
    }
  };

  const totalTasks = myTasks.length;
  const totalCompleted = myTasks.filter(t => t.status === 'Completed').length;
  const totalProgress = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading-state">Loading your tasks...</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="user-dashboard-header">
        <div>
          <h2>My Tasks Dashboard</h2>
          <p>Welcome back, {user?.name}! Here are your assigned tasks.</p>
          {company && (
            <div className="company-badge">
              <Building2 size={16} />
              <span>{company.name}</span>
            </div>
          )}
        </div>
        {user?.companyId && (
          <Link
            to={`/company/${user.companyId}`}
            className="btn btn-secondary"
          >
            <ArrowLeft size={18} />
            View All Tasks
          </Link>
        )}
      </div>

      <div className="user-dashboard-stats">
        <div className="stat-card total-stat">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalTasks}</div>
            <div className="stat-label">My Tasks</div>
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
            <User size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{Math.round(totalProgress)}%</div>
            <div className="stat-label">Progress</div>
          </div>
        </div>
      </div>

      <div className="user-dashboard-content">
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
                <User size={48} color="var(--gray-400)" />
                <p>No tasks in this category.</p>
                <p className="empty-state-subtitle">Tasks assigned to you will appear here.</p>
              </div>
            ) : (
              getTasksForView().map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  companyId={task.companyId?._id || task.companyId}
                  departmentId={task.departmentId?._id || task.departmentId}
                  companyName={task.companyId?.name || company?.name}
                  departmentName={task.departmentId?.name}
                  onUpdate={loadUserTasks}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

