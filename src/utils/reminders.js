import { isToday, isPast, parseISO, format } from 'date-fns';
import { getAllTasks } from './storage';

export const TASK_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DELAYED: 'Delayed'
};

export const getTaskStatusColor = (task) => {
  if (task.status === TASK_STATUS.COMPLETED) {
    return 'green';
  }
  
  const deadline = parseISO(task.deadline);
  
  if (isPast(deadline) && task.status !== TASK_STATUS.COMPLETED) {
    return 'red';
  }
  
  if (isToday(deadline)) {
    return 'yellow';
  }
  
  return 'gray';
};

export const getTasksDueToday = () => {
  const allTasks = getAllTasks();
  return allTasks.filter(task => {
    if (task.status === TASK_STATUS.COMPLETED) return false;
    const deadline = parseISO(task.deadline);
    return isToday(deadline);
  });
};

export const getOverdueTasks = () => {
  const allTasks = getAllTasks();
  return allTasks.filter(task => {
    if (task.status === TASK_STATUS.COMPLETED) return false;
    const deadline = parseISO(task.deadline);
    return isPast(deadline) && !isToday(deadline);
  });
};

export const getUpcomingTasks = (daysAhead = 7) => {
  const allTasks = getAllTasks();
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);
  
  return allTasks.filter(task => {
    if (task.status === TASK_STATUS.COMPLETED) return false;
    const deadline = parseISO(task.deadline);
    return deadline > today && deadline <= futureDate;
  });
};

export const getCompletedTasks = () => {
  const allTasks = getAllTasks();
  return allTasks.filter(task => task.status === TASK_STATUS.COMPLETED);
};

export const checkReminders = () => {
  const dueToday = getTasksDueToday();
  const overdue = getOverdueTasks();
  
  if (dueToday.length > 0 || overdue.length > 0) {
    const message = [];
    if (overdue.length > 0) {
      message.push(`🔴 ${overdue.length} overdue task(s)`);
    }
    if (dueToday.length > 0) {
      message.push(`🟡 ${dueToday.length} task(s) due today`);
    }
    
    if (Notification.permission === 'granted') {
      new Notification('Task Reminders', {
        body: message.join('\n'),
        icon: '/vite.svg'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          checkReminders();
        }
      });
    }
  }
};

export const initializeReminders = () => {
  // Check reminders immediately
  checkReminders();
  
  // Check reminders daily at 9 AM
  const now = new Date();
  const nextCheck = new Date();
  nextCheck.setHours(9, 0, 0, 0);
  if (nextCheck <= now) {
    nextCheck.setDate(nextCheck.getDate() + 1);
  }
  
  const msUntilCheck = nextCheck - now;
  setTimeout(() => {
    checkReminders();
    // Then check every 24 hours
    setInterval(checkReminders, 24 * 60 * 60 * 1000);
  }, msUntilCheck);
};

