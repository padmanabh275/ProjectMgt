# Migration Notes: LocalStorage to Database API

## ✅ Completed Components

### Backend (100% Complete)
- ✅ Express.js server with MongoDB
- ✅ Database models (User, Company, Department, Task)
- ✅ Authentication system with JWT
- ✅ Role-based access control middleware
- ✅ Complete API endpoints:
  - `/api/auth/*` - Authentication
  - `/api/users/*` - User management
  - `/api/companies/*` - Company management
  - `/api/departments/*` - Department management
  - `/api/tasks/*` - Task management
- ✅ Automatic master user creation on server start

### Frontend Authentication (100% Complete)
- ✅ Login page (`src/components/Login.jsx`)
- ✅ Register page (`src/components/Register.jsx`)
- ✅ AuthContext for state management (`src/contexts/AuthContext.jsx`)
- ✅ ProtectedRoute component
- ✅ API service layer (`src/services/api.js`)
- ✅ App.jsx updated with authentication flow

## 🔄 Components Needing Updates

The following components were originally built to use LocalStorage and need to be updated to use the API:

### 1. CompanyList.jsx
**Current:** Uses `getData()`, `addCompany()`, `deleteCompany()` from `utils/storage.js`

**Needs:**
- Use `companiesAPI.getAll()` instead of `getData()`
- Use `companiesAPI.create()` instead of `addCompany()`
- Use `companiesAPI.delete()` instead of `deleteCompany()`
- Handle loading states
- Handle API errors

### 2. CompanyDetail.jsx
**Current:** Uses `getCompanyById()`, `addDepartment()` from `utils/storage.js`

**Needs:**
- Use `companiesAPI.getById()`
- Use `departmentsAPI.getAll(companyId)`
- Use `departmentsAPI.create()`
- Fetch tasks using `tasksAPI.getAll({ companyId, departmentId })`
- Handle loading states

### 3. TaskForm.jsx
**Current:** Uses `addTask()` from `utils/storage.js`

**Needs:**
- Use `tasksAPI.create()` instead
- Pass proper companyId and departmentId from props/context
- Handle API errors and success states

### 4. TaskCard.jsx
**Current:** Uses `updateTask()`, `deleteTask()` from `utils/storage.js`

**Needs:**
- Use `tasksAPI.update()` instead
- Use `tasksAPI.delete()` instead
- Handle API errors

### 5. Dashboard.jsx
**Current:** Uses `getAllTasks()` from `utils/storage.js`

**Needs:**
- Use `tasksAPI.getAll()` with filters
- Fetch companies using `companiesAPI.getAll()`
- Calculate statistics from API data
- Handle loading states

### 6. Reminder System (`utils/reminders.js`)
**Current:** Uses `getAllTasks()` from LocalStorage

**Needs:**
- Fetch tasks from API
- May need to be refactored to work with async API calls

## 📝 Migration Checklist

When updating each component:

- [ ] Replace LocalStorage calls with API calls
- [ ] Add loading states (useState for isLoading)
- [ ] Add error handling (try/catch, error messages)
- [ ] Update useEffect dependencies
- [ ] Handle authentication errors (401 redirects)
- [ ] Test role-based access (master/admin/user)
- [ ] Verify data refresh after mutations (add/update/delete)
- [ ] Check company access restrictions for regular users

## 🔧 Quick Migration Pattern

### Example: Before (LocalStorage)
```javascript
const loadCompanies = () => {
  const data = getData();
  setCompanies(data.companies || []);
};

const handleAddCompany = (name) => {
  addCompany(name);
  loadCompanies();
};
```

### Example: After (API)
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const loadCompanies = async () => {
  try {
    setLoading(true);
    const response = await companiesAPI.getAll();
    setCompanies(response.data);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load companies');
  } finally {
    setLoading(false);
  }
};

const handleAddCompany = async (name) => {
  try {
    setLoading(true);
    await companiesAPI.create({ name });
    await loadCompanies();
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create company');
  } finally {
    setLoading(false);
  }
};
```

## 🚀 Testing After Migration

1. **Test Authentication:**
   - Login with master account
   - Create a new user
   - Login with new user (should only see their company)

2. **Test Company Access:**
   - Master should see all companies
   - Admin/User should only see their company

3. **Test CRUD Operations:**
   - Create companies, departments, tasks
   - Update tasks
   - Delete tasks/companies

4. **Test Role Permissions:**
   - User cannot create companies
   - User cannot see other companies' data

## 📌 Important Notes

1. **Data Migration:** Existing LocalStorage data won't automatically migrate. Users will need to:
   - Start fresh (recommended)
   - Or create an import script (future enhancement)

2. **API Base URL:** Configured in `src/services/api.js`:
   - Development: `http://localhost:5000/api` (via Vite proxy)
   - Can be changed via `VITE_API_URL` environment variable

3. **Authentication Token:** Automatically included in API requests via axios interceptors

4. **Error Handling:** 401 errors automatically redirect to login

## 🎯 Next Steps

1. Start with CompanyList.jsx (simplest)
2. Then CompanyDetail.jsx
3. Update TaskForm and TaskCard
4. Finally Dashboard.jsx (most complex)

Or test the authentication first:
1. Start MongoDB
2. Run `npm run dev`
3. Login at `http://localhost:3000/login`
4. Test authentication flow

