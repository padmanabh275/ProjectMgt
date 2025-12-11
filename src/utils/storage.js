// Local storage utilities for managing companies, departments, and tasks

const STORAGE_KEY = 'task_management_data';

export const getData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { companies: [] };
  } catch (error) {
    console.error('Error reading from storage:', error);
    return { companies: [] };
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
};

export const addCompany = (companyName) => {
  const data = getData();
  const newCompany = {
    id: Date.now().toString(),
    name: companyName,
    departments: [],
    createdAt: new Date().toISOString()
  };
  data.companies.push(newCompany);
  saveData(data);
  return newCompany;
};

export const getCompanyById = (companyId) => {
  const data = getData();
  return data.companies.find(c => c.id === companyId);
};

export const addDepartment = (companyId, departmentName) => {
  const data = getData();
  const company = data.companies.find(c => c.id === companyId);
  if (company) {
    const newDept = {
      id: Date.now().toString(),
      name: departmentName,
      tasks: []
    };
    company.departments.push(newDept);
    saveData(data);
    return newDept;
  }
  return null;
};

export const addTask = (companyId, departmentId, task) => {
  const data = getData();
  const company = data.companies.find(c => c.id === companyId);
  if (company) {
    const department = company.departments.find(d => d.id === departmentId);
    if (department) {
      const newTask = {
        id: Date.now().toString(),
        ...task,
        createdAt: new Date().toISOString()
      };
      department.tasks.push(newTask);
      saveData(data);
      return newTask;
    }
  }
  return null;
};

export const updateTask = (companyId, departmentId, taskId, updates) => {
  const data = getData();
  const company = data.companies.find(c => c.id === companyId);
  if (company) {
    const department = company.departments.find(d => d.id === departmentId);
    if (department) {
      const task = department.tasks.find(t => t.id === taskId);
      if (task) {
        Object.assign(task, updates);
        saveData(data);
        return task;
      }
    }
  }
  return null;
};

export const deleteTask = (companyId, departmentId, taskId) => {
  const data = getData();
  const company = data.companies.find(c => c.id === companyId);
  if (company) {
    const department = company.departments.find(d => d.id === departmentId);
    if (department) {
      department.tasks = department.tasks.filter(t => t.id !== taskId);
      saveData(data);
      return true;
    }
  }
  return false;
};

export const deleteCompany = (companyId) => {
  const data = getData();
  data.companies = data.companies.filter(c => c.id !== companyId);
  saveData(data);
  return true;
};

export const getAllTasks = () => {
  const data = getData();
  const allTasks = [];
  data.companies.forEach(company => {
    company.departments.forEach(department => {
      department.tasks.forEach(task => {
        allTasks.push({
          ...task,
          companyId: company.id,
          companyName: company.name,
          departmentId: department.id,
          departmentName: department.name
        });
      });
    });
  });
  return allTasks;
};

