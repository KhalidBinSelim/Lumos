# Backend Environment Variables Setup Guide

## Quick Setup

1. **Copy the example file:**
   ```bash
   cd Backend
   cp env.example .env
   ```

   Or on Windows PowerShell:
   ```powershell
   cd Backend
   Copy-Item env.example .env
   ```

2. **Edit `.env` file** and fill in your actual values (see below)

3. **Never commit `.env` to git** (it's already in .gitignore)

---

## Required Environment Variables

### 1. MongoDB Database (`MONGODB_URI`)

**Option A: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/lumos?retryWrites=true&w=majority
   ```
6. Replace `username`, `password`, and `cluster` with your values

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string:
   ```
   mongodb://localhost:27017/lumos
   ```

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/lumos?retryWrites=true&w=majority
```

---

### 2. JWT Secret (`JWT_SECRET`)

**Generate a secure random key:**

**Option A: Using OpenSSL (Linux/Mac)**
```bash
openssl rand -base64 32
```

**Option B: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Online Generator**
- Visit: https://randomkeygen.com/
- Use a "CodeIgniter Encryption Keys" (256-bit)

**Example:**
```env
JWT_SECRET=8f3a9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
```

**Important:** Use a different secret for production!

---

### 3. Cloudinary Configuration

**Get your Cloudinary credentials:**

1. **Sign up for free account:**
   - Visit: https://cloudinary.com/users/register/free
   - Free tier includes 25GB storage and 25GB bandwidth

2. **Get your credentials:**
   - Go to Dashboard: https://cloudinary.com/console
   - Your credentials are displayed on the dashboard

3. **Fill in the values:**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
   ```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=my-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

---

## Optional Environment Variables

### Server Port (`PORT`)
- Default: `5000`
- Change if port 5000 is already in use
```env
PORT=5000
```

### Node Environment (`NODE_ENV`)
- Options: `development`, `production`, `test`
- Default: `development`
```env
NODE_ENV=development
```

### Frontend URL (`FRONTEND_URL`)
- Used for CORS configuration
- Default: `http://localhost:5173` (Vite default)
- Change if your frontend runs on a different port
```env
FRONTEND_URL=http://localhost:5173
```

### JWT Expiration (`JWT_EXPIRES_IN`)
- Default: `7d` (7 days)
- Format: `1h`, `7d`, `30d`, etc.
```env
JWT_EXPIRES_IN=7d
```

---

## Complete Example `.env` File

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB Database
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/lumos?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=8f3a9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=my-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

---

## Verification

After setting up your `.env` file, test the connection:

1. **Start the backend:**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Check for errors:**
   - ✅ "MongoDB Connected" - Database connection successful
   - ✅ "🚀 Lumos API Server" - Server started successfully
   - ❌ "MONGODB_URI is not defined" - Check your .env file
   - ❌ "MongoDB Connection Error" - Check your MongoDB URI

3. **Test the API:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"success":true,"message":"Lumos API is running"}`

---

## Troubleshooting

### "MONGODB_URI is not defined"
- Make sure `.env` file exists in `Backend/` folder
- Check that variable name is exactly `MONGODB_URI` (case-sensitive)
- Restart the server after creating/editing `.env`

### "MongoDB Connection Error"
- Verify MongoDB URI is correct
- Check username/password are correct
- Ensure IP is whitelisted (for Atlas)
- Check MongoDB service is running (for local)

### "JWT_SECRET is undefined"
- Make sure `JWT_SECRET` is set in `.env`
- Restart the server after adding it

### Cloudinary Upload Errors
- Verify all three Cloudinary variables are set
- Check credentials in Cloudinary dashboard
- Ensure account is active

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` to version control
- Use different secrets for development and production
- Keep your JWT_SECRET secure and random
- Don't share your `.env` file publicly
- Rotate secrets periodically in production

---

## Next Steps

After setting up `.env`:
1. ✅ Start backend: `npm run dev`
2. ✅ Test API: Visit `http://localhost:5000/api/health`
3. ✅ Seed database: `node src/seed.js` (optional)
4. ✅ Start frontend and test connection

