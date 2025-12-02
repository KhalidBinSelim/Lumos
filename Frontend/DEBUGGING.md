# Frontend-Backend Connection Debugging Guide

## Quick Diagnostic Steps

### 1. Check Backend is Running
```bash
# In Backend folder
npm run dev
```
**Expected:** You should see:
```
🚀 Lumos API Server
Port: 5000
URL: http://localhost:5000
```

### 2. Test Backend Directly
Open browser or use curl:
```
http://localhost:5000/api/health
```
**Expected:** JSON response with `{"success":true,"message":"Lumos API is running"}`

### 3. Check Frontend Environment
1. Open browser console (F12)
2. Go to `http://localhost:5173/api-test`
3. Click "Check API URL"
4. **Expected:** Should show `http://localhost:5000/api`

### 4. Test Health Check from Frontend
1. On `/api-test` page, click "Test Health Check"
2. **Check Browser Console (F12)** - You should see:
   - `📤 API Request [GET] http://localhost:5000/api/health`
   - `✅ API Success [GET] /health`

### 5. Check Network Tab
1. Open DevTools (F12) → Network tab
2. Try any API call
3. Look for requests to `http://localhost:5000/api/...`
4. Check:
   - **Status Code:** Should be 200, 201, etc. (not 0 or failed)
   - **Request Headers:** Should include `Content-Type: application/json`
   - **Response:** Should show JSON data

## Common Issues & Solutions

### Issue 1: "Network Error" or "Failed to fetch"
**Symptoms:**
- Console shows: `❌ API Error: Network Error`
- Network tab shows: Request status is "failed" or "pending"

**Solutions:**
1. ✅ **Backend not running?** Start it: `cd Backend && npm run dev`
2. ✅ **Wrong port?** Check backend is on port 5000
3. ✅ **CORS issue?** Check backend console for CORS errors
4. ✅ **Firewall blocking?** Temporarily disable firewall to test

### Issue 2: "CORS policy" Error
**Symptoms:**
- Browser console: `Access to XMLHttpRequest... has been blocked by CORS policy`
- Network tab: Request shows CORS error

**Solutions:**
1. ✅ Check backend `app.js` has CORS configured
2. ✅ Verify frontend URL matches allowed origins in backend
3. ✅ Check backend console for CORS rejection messages

### Issue 3: "401 Unauthorized"
**Symptoms:**
- Error message: "Access denied. No token provided"
- Status code: 401

**Solutions:**
1. ✅ This is **normal** for protected routes
2. ✅ Login first to get a token
3. ✅ Check token is saved: `localStorage.getItem('token')` in console

### Issue 4: "404 Not Found"
**Symptoms:**
- Error: "Route not found"
- Status code: 404

**Solutions:**
1. ✅ Check API endpoint path matches backend route
2. ✅ Verify route exists in backend `routes.js` file
3. ✅ Check baseURL is correct: `http://localhost:5000/api`

### Issue 5: Data Not Sending
**Symptoms:**
- Request sent but no data in backend
- Backend receives empty body

**Solutions:**
1. ✅ Check Network tab → Request payload
2. ✅ Verify `Content-Type: application/json` header
3. ✅ Check request body in Network tab
4. ✅ Verify backend has `app.use(express.json())` middleware

## Step-by-Step Debugging

### Step 1: Verify Environment
```javascript
// In browser console (F12)
console.log('API URL:', import.meta.env.VITE_API_URL);
// Should show: http://localhost:5000/api
```

### Step 2: Test Axios Instance
```javascript
// In browser console
import api from './src/api/axios';
api.get('/health').then(r => console.log('Success:', r)).catch(e => console.error('Error:', e));
```

### Step 3: Check localStorage
```javascript
// In browser console
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### Step 4: Monitor Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Try making an API call
5. Click on the request to see:
   - **Headers:** Request and Response headers
   - **Payload:** Request body (if POST/PUT)
   - **Response:** Server response
   - **Preview:** Formatted response

### Step 5: Check Backend Logs
Look at backend terminal for:
- Request logs: `GET /api/health`
- Error messages
- MongoDB connection status

## Testing Checklist

- [ ] Backend server running on port 5000
- [ ] MongoDB connected (check backend console)
- [ ] Frontend dev server running
- [ ] `.env` file exists with `VITE_API_URL=http://localhost:5000/api`
- [ ] Browser console shows API requests (📤 emoji)
- [ ] Network tab shows successful requests (200 status)
- [ ] Health check works from `/api-test` page
- [ ] Can fetch scholarships (no auth needed)
- [ ] Can register a new user
- [ ] Can login and get token
- [ ] Token saved in localStorage

## What to Share When Asking for Help

If still not working, share:

1. **Browser Console Output** (F12 → Console tab)
2. **Network Tab Screenshot** (F12 → Network tab → Filter XHR)
3. **Backend Console Output** (terminal where backend is running)
4. **Error Message** (exact text)
5. **What you tried** (which buttons/actions)

## Quick Test Commands

### Test Backend Health (from terminal)
```bash
# PowerShell
curl http://localhost:5000/api/health

# Should return JSON
```

### Test from Frontend Console
```javascript
// Open browser console (F12) and run:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend working:', d))
  .catch(e => console.error('❌ Backend error:', e));
```

