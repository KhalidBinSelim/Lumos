# API to Frontend Pages Mapping

Complete mapping of all backend API endpoints to their corresponding frontend pages/components.

---

## 🔐 Authentication APIs

### User Registration & Login

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `POST /api/users/register` | POST | `Signup.tsx` | `/` (LandingPage) | ✅ Connected |
| `POST /api/users/login` | POST | `Login.tsx` | `/login` | ✅ Connected |

**Usage:**
- **Signup.tsx**: Creates new user account with email, password, fullName
- **Login.tsx**: Authenticates user and stores JWT token

---

## 👤 User Profile APIs

### Profile Management

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `GET /api/users/profile` | GET | `Home.tsx`, `PrimaryHome.tsx` | `/phome`, `/home` | ⚠️ Not Connected |
| `PUT /api/users/profile` | PUT | Onboarding Steps | `/onboarding` | ⚠️ Not Connected |
| `PUT /api/users/profile/basic` | PUT | `OnboardingStep1.tsx` | `/onboarding/step1` | ⚠️ Not Connected |
| `PUT /api/users/profile/academic` | PUT | `OnboardingStep2.tsx` | `/onboarding/step2` | ⚠️ Not Connected |
| `PUT /api/users/profile/activities` | PUT | `OnboardingStep3.tsx` | `/onboarding/step3` | ⚠️ Not Connected |
| `PUT /api/users/profile/background` | PUT | `OnboardingStep4.tsx` | `/onboarding/step4` | ⚠️ Not Connected |
| `POST /api/users/onboarding/complete` | POST | `OnboardingStep5.tsx` | `/onboarding/step5` | ⚠️ Not Connected |

**Usage:**
- **OnboardingStep1.tsx**: Saves basic info (firstName, lastName, DOB, location)
- **OnboardingStep2.tsx**: Saves academic info (education, school, GPA, major)
- **OnboardingStep3.tsx**: Saves activities, interests, awards, jobs
- **OnboardingStep4.tsx**: Saves background info (gender, ethnicity, citizenship)
- **OnboardingStep5.tsx**: Uploads documents and completes onboarding

### Document Upload

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `POST /api/users/upload/resume` | POST | `OnboardingStep5.tsx` | `/onboarding/step5` | ⚠️ Not Connected |
| `POST /api/users/upload/transcript` | POST | `OnboardingStep5.tsx` | `/onboarding/step5` | ⚠️ Not Connected |
| `POST /api/users/upload/document` | POST | `OnboardingStep5.tsx` | `/onboarding/step5` | ⚠️ Not Connected |
| `DELETE /api/users/documents/:documentId` | DELETE | Profile Settings | - | ⚠️ Not Connected |

---

## 🎓 Scholarship APIs

### Public Scholarship Access

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `GET /api/scholarships` | GET | `Discovery.tsx` | `/discovery` | ⚠️ Not Connected |
| `GET /api/scholarships/search?q=` | GET | `Discovery.tsx` | `/discovery` | ⚠️ Not Connected |
| `GET /api/scholarships/featured` | GET | `Home.tsx`, `PrimaryHome.tsx` | `/home`, `/phome` | ⚠️ Not Connected |
| `GET /api/scholarships/deadlines` | GET | `Calendar.tsx` | `/calendar` | ⚠️ Not Connected |
| `GET /api/scholarships/filters` | GET | `Discovery.tsx` | `/discovery` | ⚠️ Not Connected |
| `GET /api/scholarships/:id` | GET | `ScholarshipDetails.tsx` | `/details` | ⚠️ Not Connected |

**Usage:**
- **Discovery.tsx**: Lists all scholarships with filters, search functionality
- **ScholarshipDetails.tsx**: Shows detailed scholarship information
- **Calendar.tsx**: Displays upcoming scholarship deadlines
- **Home.tsx**: Shows featured scholarships on dashboard

### Protected Scholarship Actions

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `GET /api/scholarships/recommended` | GET | `Home.tsx`, `PrimaryHome.tsx` | `/home`, `/phome` | ⚠️ Not Connected |
| `GET /api/scholarships/saved` | GET | `Discovery.tsx` (Saved tab) | `/discovery` | ⚠️ Not Connected |
| `POST /api/scholarships/:id/save` | POST | `ScholarshipDetails.tsx` | `/details` | ⚠️ Not Connected |
| `DELETE /api/scholarships/:id/save` | DELETE | `ScholarshipDetails.tsx` | `/details` | ⚠️ Not Connected |

**Usage:**
- **ScholarshipDetails.tsx**: Save/unsave scholarship button
- **Discovery.tsx**: Filter to show only saved scholarships
- **Home.tsx**: Display recommended scholarships based on user profile

### Admin Scholarship Management

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `POST /api/scholarships` | POST | Admin Panel | - | ⚠️ Not Connected |
| `PUT /api/scholarships/:id` | PUT | Admin Panel | - | ⚠️ Not Connected |
| `DELETE /api/scholarships/:id` | DELETE | Admin Panel | - | ⚠️ Not Connected |

---

## 📝 Application APIs

### Application Management

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `POST /api/applications` | POST | `ScholarshipDetails.tsx` | `/details` | ⚠️ Not Connected |
| `GET /api/applications` | GET | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |
| `GET /api/applications/stats` | GET | `Home.tsx`, `MyApplications.tsx` | `/home`, `/applications` | ⚠️ Not Connected |
| `GET /api/applications/urgent` | GET | `Home.tsx`, `MyApplications.tsx` | `/home`, `/applications` | ⚠️ Not Connected |
| `GET /api/applications/calendar` | GET | `Calendar.tsx` | `/calendar` | ⚠️ Not Connected |
| `GET /api/applications/:id` | GET | `MyApplications.tsx`, `EssayCopilot.tsx` | `/applications`, `/essay-copilot` | ⚠️ Not Connected |
| `PUT /api/applications/:id` | PUT | `MyApplications.tsx`, `EssayCopilot.tsx` | `/applications`, `/essay-copilot` | ⚠️ Not Connected |
| `DELETE /api/applications/:id` | DELETE | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |

**Usage:**
- **MyApplications.tsx**: Lists all user applications, shows stats, filters by status
- **ScholarshipDetails.tsx**: "Apply Now" button creates new application
- **Home.tsx**: Shows application stats and urgent deadlines
- **Calendar.tsx**: Displays application deadlines on calendar

### Application Requirements

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `POST /api/applications/:id/requirements` | POST | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |
| `PUT /api/applications/:id/requirements/:reqId` | PUT | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |
| `DELETE /api/applications/:id/requirements/:reqId` | DELETE | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |

### Essay Management

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `PUT /api/applications/:id/essay` | PUT | `EssayCopilot.tsx` | `/essay-copilot` | ⚠️ Not Connected |

**Usage:**
- **EssayCopilot.tsx**: Saves essay drafts for applications

### Application Documents

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `POST /api/applications/:id/documents` | POST | `MyApplications.tsx`, `EssayCopilot.tsx` | `/applications`, `/essay-copilot` | ⚠️ Not Connected |
| `DELETE /api/applications/:id/documents/:docId` | DELETE | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |

### Application Status Changes

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `POST /api/applications/:id/submit` | POST | `MyApplications.tsx`, `EssayCopilot.tsx` | `/applications`, `/essay-copilot` | ⚠️ Not Connected |
| `POST /api/applications/:id/won` | POST | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |
| `POST /api/applications/:id/rejected` | POST | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |
| `POST /api/applications/:id/withdraw` | POST | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |

**Usage:**
- **MyApplications.tsx**: Status dropdown to change application status
- **EssayCopilot.tsx**: Submit button to finalize application

### Application Reminders & Next Steps

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `PUT /api/applications/:id/reminders` | PUT | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |
| `POST /api/applications/:id/next-steps` | POST | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |
| `PUT /api/applications/:id/next-steps/:index/complete` | PUT | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |

### Application Utilities

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `POST /api/applications/:id/duplicate` | POST | `MyApplications.tsx` | `/applications` | ⚠️ Not Connected |

---

## 🔧 Utility APIs

| API Endpoint | Method | Frontend Component | Route | Status |
|-------------|--------|-------------------|-------|--------|
| `GET /api/health` | GET | `ApiTest.tsx` | `/api-test` | ✅ Connected |
| `GET /api` | GET | - | - | - |

---

## 📊 Summary

### Status Legend
- ✅ **Connected**: API is integrated and working
- ⚠️ **Not Connected**: API exists but frontend not yet connected

### Statistics
- **Total APIs**: 50+
- **Connected**: 3 (Login, Register, Health Check)
- **Not Connected**: 47+
- **Frontend Components**: 15

---

## 🚀 Next Steps for Integration

### Priority 1: Core Features
1. **Discovery.tsx** → Connect scholarship listing and search
2. **ScholarshipDetails.tsx** → Connect scholarship details and save/unsave
3. **MyApplications.tsx** → Connect application listing and management
4. **Home.tsx** → Connect dashboard stats and featured scholarships

### Priority 2: User Experience
5. **Onboarding Steps** → Connect profile updates
6. **Calendar.tsx** → Connect deadlines and calendar data
7. **EssayCopilot.tsx** → Connect essay saving

### Priority 3: Advanced Features
8. Application requirements management
9. Document uploads
10. Status changes and reminders

---

## 📝 Notes

- All protected routes require JWT token in `Authorization: Bearer <token>` header
- Token is automatically added by axios interceptor if stored in localStorage
- File uploads use `multipart/form-data` content type
- All dates should be in ISO 8601 format
- Pagination is available on list endpoints (page, limit query params)

