# Frontend-Backend Connection Testing Guide

## Quick Test Steps

### 1. Start the Backend Server

```bash
cd Backend
npm run dev
```

The backend should start on `http://localhost:5000`

### 2. Start the Frontend

```bash
cd Frontend
npm run dev
```

The frontend should start on `http://localhost:5173` (or another port)

### 3. Test the Connection

#### Option A: Use the API Test Page
1. Navigate to `http://localhost:5173/api-test` in your browser
2. Click "Check API URL" to verify the API URL is correct
3. Click "Test Health Check" to verify backend is running
4. Click "Test Get Scholarships" to test fetching data
5. Click "Test Login API" to test authentication

#### Option B: Test Login Directly
1. Navigate to `http://localhost:5173/login`
2. Try logging in with test credentials (you need to register first)
3. Check browser console (F12) for any errors
4. Check Network tab to see if requests are being sent

### 4. Check for Common Issues

#### Backend Not Running
- **Symptom**: All API calls fail with "Network Error" or "ECONNREFUSED"
- **Solution**: Make sure backend is running on port 5000

#### CORS Error
- **Symptom**: Browser console shows "CORS policy" error
- **Solution**: Backend CORS is already configured, but verify your frontend URL matches

#### 401 Unauthorized
- **Symptom**: "Access denied. No token provided"
- **Solution**: This is expected for protected routes. Login first to get a token.

#### 404 Not Found
- **Symptom**: "Route not found" error
- **Solution**: Check that the API endpoint path matches backend routes

#### Environment Variable Not Set
- **Symptom**: API calls go to wrong URL
- **Solution**: Create `.env` file in Frontend folder with:
  ```
  VITE_API_URL=http://localhost:5000/api
  ```
  Then restart the frontend dev server.

## Testing Checklist

- [ ] Backend server is running (check terminal)
- [ ] MongoDB is connected (check backend console)
- [ ] Frontend dev server is running
- [ ] `.env` file exists in Frontend folder (or using default URL)
- [ ] Health check endpoint works (`/api-test` page)
- [ ] Can fetch scholarships (no auth required)
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Token is stored in localStorage after login
- [ ] Protected routes work with token

## Debugging Tips

1. **Open Browser DevTools (F12)**
   - Check Console tab for errors
   - Check Network tab to see all API requests
   - Look for failed requests (red status codes)

2. **Check Backend Console**
   - Should see request logs: `GET /api/health`, etc.
   - Check for MongoDB connection messages
   - Look for any error messages

3. **Verify API URL**
   - Default: `http://localhost:5000/api`
   - Can be overridden with `VITE_API_URL` in `.env`
   - Check in browser console: `import.meta.env.VITE_API_URL`

4. **Test with Postman**
   - Use the Postman collection to verify backend works independently
   - Then test from frontend to isolate issues

## Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `Network Error` | Backend not running or wrong URL | Start backend, check URL |
| `CORS policy` | Origin not allowed | Check backend CORS config |
| `401 Unauthorized` | No token or invalid token | Login first to get token |
| `404 Not Found` | Route doesn't exist | Check route path matches backend |
| `500 Internal Server Error` | Backend error | Check backend console logs |

