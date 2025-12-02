# API Quick Reference - Frontend to Backend Mapping

Quick lookup table for frontend developers.

---

## 🎯 Frontend Pages → APIs

### Landing Page (`/`)
- `POST /api/users/register` - Sign up form

### Login Page (`/login`)
- `POST /api/users/login` - Login form

### Home/Dashboard (`/home`, `/phome`)
- `GET /api/users/profile` - Get user profile
- `GET /api/scholarships/featured` - Featured scholarships
- `GET /api/scholarships/recommended` - Recommended scholarships
- `GET /api/applications/stats` - Application statistics
- `GET /api/applications/urgent` - Urgent applications

### Discovery (`/discovery`)
- `GET /api/scholarships` - List all scholarships (with filters)
- `GET /api/scholarships/search?q=` - Search scholarships
- `GET /api/scholarships/filters` - Get filter options
- `GET /api/scholarships/saved` - Get saved scholarships
- `POST /api/scholarships/:id/save` - Save scholarship
- `DELETE /api/scholarships/:id/save` - Unsave scholarship

### Scholarship Details (`/details`)
- `GET /api/scholarships/:id` - Get scholarship details
- `POST /api/scholarships/:id/save` - Save scholarship
- `DELETE /api/scholarships/:id/save` - Unsave scholarship
- `POST /api/applications` - Create application (Apply Now)

### My Applications (`/applications`)
- `GET /api/applications` - Get all applications
- `GET /api/applications/stats` - Get statistics
- `GET /api/applications/urgent` - Get urgent applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `POST /api/applications/:id/submit` - Submit application
- `POST /api/applications/:id/won` - Mark as won
- `POST /api/applications/:id/rejected` - Mark as rejected
- `POST /api/applications/:id/withdraw` - Withdraw application

### Essay Copilot (`/essay-copilot`)
- `GET /api/applications/:id` - Get application with essay
- `PUT /api/applications/:id/essay` - Save essay draft
- `POST /api/applications/:id/documents` - Upload essay document

### Calendar (`/calendar`)
- `GET /api/scholarships/deadlines` - Scholarship deadlines
- `GET /api/applications/calendar` - Application deadlines

### Onboarding Steps (`/onboarding/step1-5`)
- `PUT /api/users/profile/basic` - Step 1: Basic info
- `PUT /api/users/profile/academic` - Step 2: Academic info
- `PUT /api/users/profile/activities` - Step 3: Activities
- `PUT /api/users/profile/background` - Step 4: Background
- `POST /api/users/upload/resume` - Step 5: Upload resume
- `POST /api/users/upload/transcript` - Step 5: Upload transcript
- `POST /api/users/onboarding/complete` - Step 5: Complete onboarding

### API Test Page (`/api-test`)
- `GET /api/health` - Health check
- All other APIs for testing

---

## 🔄 API Service Functions

### Auth API (`src/api/auth.ts`)
```typescript
authApi.login(credentials)
authApi.register(data)
authApi.getProfile()
authApi.updateProfile(data)
authApi.uploadDocument(file, type)
authApi.logout()
```

### Scholarships API (`src/api/scholarships.ts`)
```typescript
scholarshipsApi.getScholarships(filters)
scholarshipsApi.searchScholarships(query, filters)
scholarshipsApi.getScholarshipById(id)
scholarshipsApi.getFeaturedScholarships(limit)
scholarshipsApi.getUpcomingDeadlines(days)
scholarshipsApi.getRecommendedScholarships(limit)
scholarshipsApi.getSavedScholarships()
scholarshipsApi.saveScholarship(id)
scholarshipsApi.unsaveScholarship(id)
scholarshipsApi.getFilterOptions()
```

### Applications API (`src/api/applications.ts`)
```typescript
applicationsApi.getApplications(status)
applicationsApi.getApplicationById(id)
applicationsApi.createApplication(data)
applicationsApi.updateApplication(id, data)
applicationsApi.submitApplication(id)
applicationsApi.withdrawApplication(id)
applicationsApi.recordDecision(id, decision, notes)
applicationsApi.deleteApplication(id)
applicationsApi.updateEssayDraft(applicationId, essayIndex, content)
applicationsApi.toggleRequirement(applicationId, requirementIndex, completed)
applicationsApi.getStats()
```

---

## 📋 Common Request Patterns

### Authentication
```typescript
// Login
const response = await authApi.login({ email, password });
localStorage.setItem('token', response.data.token);

// Register
const response = await authApi.register({ email, password, fullName });
localStorage.setItem('token', response.data.token);
```

### Fetching Data
```typescript
// Get scholarships with filters
const response = await scholarshipsApi.getScholarships({
  page: 1,
  limit: 20,
  categories: ['STEM'],
  minAmount: 1000,
});

// Get user applications
const response = await applicationsApi.getApplications();
```

### Creating Resources
```typescript
// Create application
const response = await applicationsApi.createApplication({
  scholarshipId: 'scholarship_id_here',
  notes: 'Optional notes',
});

// Save scholarship
await scholarshipsApi.saveScholarship('scholarship_id_here');
```

### Updating Resources
```typescript
// Update profile
await authApi.updateProfile({
  firstName: 'John',
  lastName: 'Doe',
  // ... other fields
});

// Update application
await applicationsApi.updateApplication('app_id', {
  status: 'In Progress',
  progress: 50,
});
```

---

## 🔐 Authentication Flow

1. User registers/logs in → Get JWT token
2. Token stored in `localStorage.getItem('token')`
3. Axios interceptor automatically adds token to all requests
4. On 401 error → Token cleared, redirect to login

---

## 📝 File Upload Pattern

```typescript
// Upload document
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'resume');

const response = await authApi.uploadDocument(file, 'resume');
// Response: { success: true, data: { url: 'cloudinary_url' } }
```

---

## ⚠️ Error Handling

All API calls return errors in this format:
```typescript
{
  message: string,
  status: number,
  data: any,
  isNetworkError: boolean
}
```

Handle errors:
```typescript
try {
  const response = await api.someMethod();
} catch (error) {
  if (error.isNetworkError) {
    // Backend not reachable
  } else if (error.status === 401) {
    // Unauthorized - redirect to login
  } else {
    // Show error message
    console.error(error.message);
  }
}
```

