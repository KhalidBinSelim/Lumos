# Lumos API Testing Guide for Postman

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token. After login, copy the token from the response and add it to headers:
```
Authorization: Bearer <your_token_here>
```

---

## 1. USER ENDPOINTS

### 1.1 Register User
**POST** `/users/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "onboardingCompleted": false,
      "profileCompleteness": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 Login
**POST** `/users/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Get Profile
**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": null,
    "country": null,
    "state": null,
    "city": null,
    "educationLevel": "",
    "schoolName": null,
    "gpa": null,
    "major": null,
    "interests": [],
    "activities": [],
    "awards": [],
    "savedScholarships": [],
    "profileCompleteness": 0
  }
}
```

---

### 1.4 Update Basic Info (Step 1)
**PUT** `/users/profile/basic`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": {
    "month": "05",
    "day": "15",
    "year": "2000"
  },
  "country": "US",
  "state": "California",
  "city": "Los Angeles",
  "phone": "+1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Basic info updated successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": {
      "month": "05",
      "day": "15",
      "year": "2000"
    },
    "country": "US",
    "state": "California",
    "city": "Los Angeles",
    "phone": "+1234567890",
    "profileCompleteness": 25
  }
}
```

---

### 1.5 Update Academic Info (Step 2)
**PUT** `/users/profile/academic`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "educationLevel": "College Student",
  "schoolName": "University of California",
  "gradeYear": "Junior",
  "graduationYear": "2025",
  "gpa": "3.8",
  "gpaScale": "4.0",
  "major": "Computer Science",
  "minor": "Mathematics",
  "sat": "1450",
  "ielts": "7.5",
  "classRank": "15",
  "classSize": "200"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Academic info updated successfully",
  "data": {
    "educationLevel": "College Student",
    "schoolName": "University of California",
    "gradeYear": "Junior",
    "graduationYear": "2025",
    "gpa": "3.8",
    "gpaScale": "4.0",
    "major": "Computer Science",
    "minor": "Mathematics",
    "profileCompleteness": 50
  }
}
```

---

### 1.6 Update Activities & Interests (Step 3)
**PUT** `/users/profile/activities`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "interests": ["Computer Science", "Robotics", "Volunteering"],
  "activities": [
    {
      "name": "Debate Team",
      "role": "Captain",
      "years": "2 years",
      "hoursPerWeek": "5",
      "description": "Led team to state championships"
    },
    {
      "name": "Volunteer at Food Bank",
      "role": "Volunteer",
      "years": "1 year",
      "hoursPerWeek": "3",
      "description": "Weekly food distribution"
    }
  ],
  "awards": [
    {
      "title": "National Merit Scholar Semifinalist"
    },
    {
      "title": "AP Scholar with Distinction"
    }
  ],
  "jobs": [
    {
      "title": "Software Development Intern",
      "organization": "Tech Corp",
      "duration": "Jun 2023 - Aug 2024",
      "description": "Developed web applications using React and Node.js"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Activities updated successfully",
  "data": {
    "interests": ["Computer Science", "Robotics", "Volunteering"],
    "activities": [...],
    "awards": [...],
    "jobs": [...],
    "profileCompleteness": 70
  }
}
```

---

### 1.7 Update Background Info (Step 4)
**PUT** `/users/profile/background`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "gender": "Male",
  "ethnicities": ["Asian / Pacific Islander"],
  "ethnicityOther": "",
  "firstGen": "Yes",
  "citizenship": "U.S. Citizen",
  "citizenshipOther": "",
  "incomeRange": "$30k-$50k",
  "military": {
    "veteran": false,
    "active": false,
    "parentVeteran": false,
    "parentActive": false,
    "none": true
  },
  "disability": "No",
  "disabilityDetails": ""
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Background info updated successfully",
  "data": {
    "gender": "Male",
    "ethnicities": ["Asian / Pacific Islander"],
    "firstGen": "Yes",
    "citizenship": "U.S. Citizen",
    "profileCompleteness": 85
  }
}
```

---

### 1.8 Upload Resume
**POST** `/users/upload/resume`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- Key: `resume` (File)
- Value: Select a PDF or DOCX file

**Response (200):**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resume": {
      "url": "https://res.cloudinary.com/.../resume.pdf",
      "publicId": "lumos/resumes/abc123",
      "uploadedAt": "2024-01-15T10:30:00.000Z"
    },
    "profileCompleteness": 100
  }
}
```

---

### 1.9 Upload Transcript
**POST** `/users/upload/transcript`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- Key: `transcript` (File)
- Value: Select a PDF or image file

---

### 1.10 Get Saved Scholarships
**GET** `/users/scholarships/saved`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "Tech Leaders Scholarship",
      "org": "Tech Foundation Inc.",
      "amount": 5000,
      "deadline": "2024-02-15T00:00:00.000Z",
      "match": 89,
      "saved": true
    }
  ]
}
```

---

### 1.11 Save Scholarship
**POST** `/users/scholarships/:scholarshipId/save`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Scholarship saved",
  "data": {
    "saved": true
  }
}
```

---

### 1.12 Unsave Scholarship
**DELETE** `/users/scholarships/:scholarshipId/save`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 1.13 Complete Onboarding
**POST** `/users/onboarding/complete`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Onboarding completed successfully",
  "data": {
    "onboardingCompleted": true,
    "profileCompleteness": 100
  }
}
```

---

## 2. SCHOLARSHIP ENDPOINTS

### 2.1 Get All Scholarships (with filters)
**GET** `/scholarships`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search query
- `amount` (optional): Comma-separated ranges (e.g., "$500-1K,$1K-2.5K")
- `deadline` (optional): "Next 7d", "Next 30d", "Next 60d", "60+ days"
- `categories` (optional): Comma-separated (e.g., "STEM,Business")
- `demographics` (optional): Comma-separated (e.g., "First-Gen,Women")
- `eligibility` (optional): Comma-separated (e.g., "HS Only,College")
- `location` (optional): "National", "State", "Local", "International"
- `noEssay` (optional): "true" or "false"
- `highMatch` (optional): "true" (requires auth)
- `sortBy` (optional): "deadline", "amount", "match" (default: "deadline")
- `sortOrder` (optional): "asc" or "desc" (default: "asc")

**Example:**
```
GET /scholarships?page=1&limit=10&categories=STEM&deadline=Next 30d&highMatch=true
```

**Headers (optional for match scores):**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "scholarships": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "title": "Tech Leaders Scholarship",
        "org": "Tech Foundation Inc.",
        "amount": 5000,
        "amountDisplay": "$5,000",
        "deadline": "2024-02-15T00:00:00.000Z",
        "tags": ["CS major", "3.8 GPA", "First-gen"],
        "categories": ["STEM", "Leadership"],
        "demographics": ["First-Gen"],
        "essayRequired": true,
        "renewable": true,
        "match": 89,
        "saved": false,
        "daysUntilDeadline": 30,
        "deadlineStatus": "upcoming"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 47,
      "pages": 5
    }
  }
}
```

---

### 2.2 Search Scholarships
**GET** `/scholarships/search?q=computer science`

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number
- `limit` (optional): Items per page

**Headers (optional):**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "scholarships": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

---

### 2.3 Get Recommended Scholarships
**GET** `/scholarships/recommended?limit=10`

**Headers (required):**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "Tech Leaders Scholarship",
      "org": "Tech Foundation Inc.",
      "amount": 5000,
      "deadline": "2024-02-15T00:00:00.000Z",
      "match": 95,
      "saved": false
    }
  ]
}
```

---

### 2.4 Get Featured Scholarships
**GET** `/scholarships/featured?limit=5`

**Headers (optional):**
```
Authorization: Bearer <token>
```

---

### 2.5 Get Upcoming Deadlines
**GET** `/scholarships/deadlines?days=30&limit=10`

**Headers (optional):**
```
Authorization: Bearer <token>
```

---

### 2.6 Get Filter Options
**GET** `/scholarships/filters`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": ["STEM", "Business", "Arts", "Service"],
    "demographics": ["Women", "First-Gen", "Minority"],
    "amountRanges": ["$500-1K", "$1K-2.5K", "$2.5K-5K", "$5K+"],
    "deadlineRanges": ["Next 7d", "Next 30d", "Next 60d", "60+ days"],
    "eligibilityLevels": ["High School", "College", "Graduate"],
    "locations": ["National", "State", "Local", "International"],
    "stats": {
      "totalScholarships": 47,
      "totalAmount": 250000,
      "avgAmount": 5319,
      "maxAmount": 10000,
      "minAmount": 1000
    }
  }
}
```

---

### 2.7 Get Scholarship by ID
**GET** `/scholarships/:id`

**Headers (optional):**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "title": "Tech Leaders Scholarship",
    "org": "Tech Foundation Inc.",
    "website": "https://techfoundation.org/scholarship",
    "description": "The Tech Leaders Scholarship recognizes outstanding students...",
    "amount": 5000,
    "amountDisplay": "$5,000",
    "deadline": "2024-02-15T00:00:00.000Z",
    "renewable": true,
    "region": "U.S. Residents Only",
    "location": "National",
    "tags": ["CS major", "3.8 GPA", "First-gen"],
    "categories": ["STEM", "Leadership"],
    "demographics": ["First-Gen"],
    "eligibility": [
      "Must be enrolled full-time in an accredited university",
      "Pursuing B.S. in Computer Science or related field",
      "Minimum GPA: 3.5"
    ],
    "eligibilityLevel": ["College"],
    "minGPA": 3.5,
    "citizenshipRequired": ["U.S. Citizen", "Permanent Resident"],
    "majorsRequired": ["Computer Science", "Software Engineering"],
    "requirements": ["Essay (500w)", "Transcript", "1 LOR"],
    "essayRequired": true,
    "essayPrompt": "Describe a specific way you plan to use technology...",
    "essayWordCount": {
      "min": 500,
      "max": 750
    },
    "essayCriteria": [
      "Clarity of vision and goals (30%)",
      "Demonstrated leadership and initiative (25%)"
    ],
    "transcriptRequired": true,
    "lorRequired": 1,
    "awardDetails": [
      "Amount: $5,000 per academic year",
      "Renewable: Up to 4 years (maintain 3.5 GPA)"
    ],
    "awardsPerYear": 20,
    "applicantsPerYear": 500,
    "timeline": [
      {
        "date": "2023-12-01",
        "label": "Application Opens"
      },
      {
        "date": "2024-02-15",
        "label": "Application Deadline - 11:59 PM EST"
      }
    ],
    "competition": {
      "acceptanceRate": "~4% (20/500)",
      "similarProfile": ["15 first-gen CS students", "Average GPA: 3.75"],
      "percentile": 65
    },
    "orgInfo": {
      "type": "501(c)(3) Non-Profit",
      "founded": "2010",
      "totalAwarded": "$2.5M+",
      "contact": "scholarships@techfoundation.org",
      "phone": "(555) 123-4567"
    },
    "notes": {
      "whyFit": [
        "Computer Science major (Required)",
        "3.8 GPA exceeds minimum 3.5 (Required)"
      ],
      "improve": [
        "Add a research project (+5% match)"
      ]
    },
    "match": 89,
    "saved": false,
    "daysUntilDeadline": 30,
    "deadlineStatus": "upcoming"
  }
}
```

---

### 2.8 Create Scholarship (Admin)
**POST** `/scholarships`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Tech Leaders Scholarship",
  "org": "Tech Foundation Inc.",
  "website": "https://techfoundation.org/scholarship",
  "description": "The Tech Leaders Scholarship recognizes outstanding students pursuing degrees in computer science who demonstrate leadership, academic excellence, and commitment to using technology for social good.",
  "amount": 5000,
  "amountDisplay": "$5,000",
  "deadline": "2024-02-15T00:00:00.000Z",
  "applicationOpens": "2023-12-01T00:00:00.000Z",
  "awardNotification": "2024-03-30T00:00:00.000Z",
  "renewable": true,
  "renewalDetails": "Renewable up to 4 years with 3.5 GPA maintenance",
  "region": "U.S. Residents Only",
  "location": "National",
  "tags": ["CS major", "3.8 GPA", "First-gen"],
  "categories": ["STEM", "Leadership"],
  "demographics": ["First-Gen"],
  "eligibility": [
    "Must be enrolled full-time in an accredited university",
    "Pursuing B.S. in Computer Science or related field",
    "Minimum GPA: 3.5",
    "U.S. Citizen or Permanent Resident"
  ],
  "eligibilityLevel": ["College"],
  "minGPA": 3.5,
  "citizenshipRequired": ["U.S. Citizen", "Permanent Resident"],
  "majorsRequired": ["Computer Science", "Software Engineering", "Information Technology"],
  "requirements": ["Essay (500w)", "Transcript", "1 LOR"],
  "essayRequired": true,
  "essayPrompt": "Describe a specific way you plan to use technology to create positive social change in your community or the world. Include examples of leadership experiences that have prepared you for this goal.",
  "essayWordCount": {
    "min": 500,
    "max": 750
  },
  "essayCriteria": [
    "Clarity of vision and goals (30%)",
    "Demonstrated leadership and initiative (25%)",
    "Feasibility and impact of proposed project (25%)",
    "Writing quality and authenticity (20%)"
  ],
  "transcriptRequired": true,
  "lorRequired": 1,
  "portfolioRequired": false,
  "awardDetails": [
    "Amount: $5,000 per academic year",
    "Renewable: Up to 4 years (maintain 3.5 GPA)",
    "Number of Awards: 20 recipients annually",
    "Disbursement: Direct to institution in Fall semester"
  ],
  "awardsPerYear": 20,
  "applicantsPerYear": 500,
  "timeline": [
    {
      "date": "2023-12-01",
      "label": "Application Opens"
    },
    {
      "date": "2024-02-15",
      "label": "Application Deadline - 11:59 PM EST"
    },
    {
      "date": "2024-03-01",
      "label": "Application Review Period"
    },
    {
      "date": "2024-03-30",
      "label": "Winners Announced (via email)"
    }
  ],
  "competition": {
    "acceptanceRate": "~4% (20/500)",
    "similarProfile": ["15 first-gen CS students", "Average GPA: 3.75", "80% had leadership roles"],
    "percentile": 65
  },
  "orgInfo": {
    "type": "501(c)(3) Non-Profit",
    "founded": "2010",
    "totalAwarded": "$2.5M+",
    "contact": "scholarships@techfoundation.org",
    "phone": "(555) 123-4567"
  },
  "notes": {
    "whyFit": [
      "Computer Science major (Required)",
      "3.8 GPA exceeds minimum 3.5 (Required)",
      "First-generation student (Preferred)"
    ],
    "improve": [
      "Add a research project (+5% match)",
      "Obtain coding competition award (+3% match)"
    ]
  },
  "featured": true,
  "verified": true,
  "active": true
}
```

**Minimal Required Fields:**
```json
{
  "title": "Tech Leaders Scholarship",
  "org": "Tech Foundation Inc.",
  "amount": 5000,
  "deadline": "2024-02-15T00:00:00.000Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Scholarship created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "title": "Tech Leaders Scholarship",
    "org": "Tech Foundation Inc.",
    "amount": 5000,
    "deadline": "2024-02-15T00:00:00.000Z",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    },
    {
      "msg": "Amount must be a number",
      "param": "amount",
      "location": "body"
    }
  ]
}
```

---

### 2.9 Save Scholarship
**POST** `/scholarships/:id/save`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Scholarship saved",
  "data": {
    "saved": true
  }
}
```

---

### 2.10 Unsave Scholarship
**DELETE** `/scholarships/:id/save`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 3. APPLICATION ENDPOINTS

### 3.1 Create Application
**POST** `/applications`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "scholarshipId": "65a1b2c3d4e5f6g7h8i9j0k2"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Application started successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "user": "65a1b2c3d4e5f6g7h8i9j0k1",
    "scholarship": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "Tech Leaders Scholarship"
    },
    "status": "In Progress",
    "progress": 0,
    "requirements": [
      {
        "_id": "...",
        "label": "Application form",
        "status": "missing"
      },
      {
        "_id": "...",
        "label": "Essay (500-750 words)",
        "status": "missing",
        "details": "Describe a specific way you plan to use technology..."
      },
      {
        "_id": "...",
        "label": "Official Transcript",
        "status": "missing"
      },
      {
        "_id": "...",
        "label": "1 Letter(s) of Recommendation",
        "status": "missing",
        "details": "0/1 received"
      }
    ],
    "essay": {
      "prompt": "Describe a specific way you plan to use technology...",
      "wordLimit": {
        "min": 500,
        "max": 750
      },
      "drafts": [],
      "currentDraft": 0
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3.2 Get All Applications
**GET** `/applications`

**Query Parameters:**
- `status` (optional): "In Progress", "Submitted", "Won", "Rejected", "All"
- `search` (optional): Search by scholarship title/org
- `page` (optional): Page number
- `limit` (optional): Items per page
- `sortBy` (optional): "lastActivityAt", "deadline", "amount"
- `sortOrder` (optional): "asc" or "desc"

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "scholarship": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
          "title": "Tech Leaders Scholarship",
          "org": "Tech Foundation Inc.",
          "amount": 5000,
          "deadline": "2024-02-15T00:00:00.000Z"
        },
        "status": "In Progress",
        "progress": 60,
        "requirements": [
          {
            "_id": "...",
            "label": "Application form",
            "status": "completed"
          },
          {
            "_id": "...",
            "label": "Essay",
            "status": "draft",
            "details": "450/500 words"
          },
          {
            "_id": "...",
            "label": "Transcript",
            "status": "missing"
          }
        ],
        "lastActivityAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### 3.3 Get Application Statistics
**GET** `/applications/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 7,
    "inProgress": 3,
    "submitted": 2,
    "won": 1,
    "rejected": 1,
    "withdrawn": 0,
    "wonAmount": 5000
  }
}
```

---

### 3.4 Get Urgent Applications
**GET** `/applications/urgent`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "scholarship": {
        "title": "Tech Leaders Scholarship",
        "deadline": "2024-02-15T00:00:00.000Z"
      },
      "status": "In Progress",
      "progress": 60,
      "isUrgent": true,
      "daysUntilDeadline": 3
    }
  ]
}
```

---

### 3.5 Get Application by ID
**GET** `/applications/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "user": "65a1b2c3d4e5f6g7h8i9j0k1",
    "scholarship": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "Tech Leaders Scholarship",
      "org": "Tech Foundation Inc.",
      "amount": 5000,
      "deadline": "2024-02-15T00:00:00.000Z"
    },
    "status": "In Progress",
    "progress": 60,
    "requirements": [...],
    "essay": {
      "prompt": "...",
      "drafts": [
        {
          "_id": "...",
          "content": "Growing up as a first-generation college student...",
          "wordCount": 450,
          "version": 1,
          "lastUpdated": "2024-01-15T10:30:00.000Z"
        }
      ],
      "currentDraft": 0
    },
    "documents": [],
    "notes": "Last updated: 2 hours ago",
    "timeline": [
      {
        "action": "Started",
        "timestamp": "2024-01-10T10:00:00.000Z",
        "details": "Application created"
      },
      {
        "action": "Essay Updated",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "details": "Draft 1 saved"
      }
    ],
    "lastActivityAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3.6 Update Application
**PUT** `/applications/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "Need to request transcript from school"
}
```

---

### 3.7 Update Requirement Status
**PUT** `/applications/:id/requirements/:reqId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed",
  "details": "Uploaded on 2024-01-15"
}
```

**Valid statuses:** `"completed"`, `"pending"`, `"missing"`, `"draft"`

---

### 3.8 Save Essay Draft
**PUT** `/applications/:id/essay`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Growing up as a first-generation college student, I've witnessed firsthand how technology can bridge gaps in education and opportunity. My journey began not with a sleek laptop, but with a shared community center computer where I wrote my first line of code..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Essay draft saved successfully",
  "data": {
    "essay": {
      "drafts": [
        {
          "_id": "...",
          "content": "...",
          "wordCount": 450,
          "version": 1,
          "lastUpdated": "2024-01-15T10:30:00.000Z"
        }
      ],
      "currentDraft": 0
    },
    "progress": 75
  }
}
```

---

### 3.9 Upload Document to Application
**POST** `/applications/:id/documents`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- Key: `document` (File)
- Key: `type` (Text): "resume", "transcript", "essay", "lor", "other"
- Key: `name` (Text, optional): Custom name

---

### 3.10 Submit Application
**POST** `/applications/:id/submit`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (optional):**
```json
{
  "confirmationNumber": "APP-2024-12345"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "status": "Submitted",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "confirmationNumber": "APP-2024-12345",
    "progress": 100
  }
}
```

---

### 3.11 Mark Application as Won
**POST** `/applications/:id/won`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "awardDetails": {
    "amount": "$5,000 (one-time)",
    "disbursement": "Direct to school",
    "expected": "August 2024 (Fall semester)"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Congratulations! Application marked as won",
  "data": {
    "status": "Won",
    "wonAt": "2024-01-15T10:30:00.000Z",
    "awardDetails": {
      "amount": "$5,000 (one-time)",
      "disbursement": "Direct to school",
      "expected": "August 2024 (Fall semester)"
    }
  }
}
```

---

### 3.12 Mark Application as Rejected
**POST** `/applications/:id/rejected`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "feedback": "Due to high volume of qualified applicants, we were unable to award all deserving students. We encourage you to reapply next year."
}
```

---

### 3.13 Withdraw Application
**POST** `/applications/:id/withdraw`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 3.14 Delete Application
**DELETE** `/applications/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

---

### 3.15 Get Applications for Calendar
**GET** `/applications/calendar?startDate=2024-01-01&endDate=2024-03-31`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "scholarship": {
        "title": "Tech Leaders Scholarship",
        "deadline": "2024-02-15T00:00:00.000Z",
        "amount": 5000
      },
      "status": "In Progress",
      "daysUntilDeadline": 30
    }
  ]
}
```

---

### 3.16 Update Reminders
**PUT** `/applications/:id/reminders`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": true,
  "sms": false,
  "push": true,
  "schedules": ["twoWeeks", "oneWeek", "threeDays", "oneDay"]
}
```

---

## 4. HEALTH CHECK

### 4.1 Health Check
**GET** `/health`

**Response (200):**
```json
{
  "success": true,
  "message": "Lumos API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## 5. API DOCUMENTATION

### 5.1 Get API Info
**GET** `/`

**Response (200):**
```json
{
  "success": true,
  "message": "Welcome to Lumos API",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /api/health",
    "users": {...},
    "scholarships": {...},
    "applications": {...}
  }
}
```

---

## POSTMAN COLLECTION SETUP

### Environment Variables
Create a Postman environment with:
- `base_url`: `http://localhost:5000/api`
- `token`: (will be set after login)

### Pre-request Script (for authenticated requests)
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('token')
});
```

### Tests Script (for login/register)
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.token) {
        pm.environment.set('token', jsonData.data.token);
    }
}
```

---

## COMMON ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Scholarship not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## TESTING WORKFLOW

1. **Register/Login** → Get token
2. **Update Profile** → Complete onboarding steps
3. **Get Scholarships** → Browse and search
4. **Save Scholarships** → Add to saved list
5. **Create Application** → Start applying
6. **Update Requirements** → Track progress
7. **Save Essay** → Draft essay content
8. **Submit Application** → Complete application
9. **Track Status** → Monitor submitted applications

---

## NOTES

- All timestamps are in ISO 8601 format
- File uploads use `multipart/form-data`
- Pagination defaults: page=1, limit=10
- Match scores (0-100) are only calculated when user is authenticated
- All IDs are MongoDB ObjectIds (24 character hex strings)

