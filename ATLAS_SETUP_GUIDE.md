# MongoDB Atlas Setup Guide

## Quick Setup Steps

### 1. Create MongoDB Atlas Account & Cluster

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a **FREE (M0) cluster**
4. Choose a region close to you
5. Wait 3-5 minutes for cluster creation

### 2. Create Database User

1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username: `urlshortener` (or your choice)
5. Create a strong password (SAVE THIS!)
6. Set privileges: **"Atlas admin"**
7. Click **"Add User"**

### 3. Whitelist IP Addresses

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - This allows Vercel servers to connect
4. Click **"Confirm"**

### 4. Get Your Connection String

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string
   - Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### 5. Format Your Connection String

Replace these parts in the connection string:
- `<username>` → Your database username
- `<password>` → Your database password (URL encode special characters if needed)
- Add database name: `/URLSHORT` before the `?`

**Final format:**
```
mongodb+srv://urlshortener:YourPassword123@cluster0.abc123.mongodb.net/URLSHORT?retryWrites=true&w=majority
```

### 6. Add to Vercel

1. Go to your Vercel project dashboard
2. Navigate to: **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Add:
   - **Key**: `MONGODB_URI`
   - **Value**: Your complete connection string
   - **Environment**: Select all (Production, Preview, Development)
5. Click **"Save"**
6. **Redeploy** your application

### 7. Test Locally (Optional)

Create a `.env` file in your project root:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/URLSHORT?retryWrites=true&w=majority
```

Install dotenv for local testing:
```bash
npm install dotenv
```

Then add to the top of `index.js`:
```javascript
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
```

## Connection String Examples

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/URLSHORT?retryWrites=true&w=majority
```

**Local MongoDB (for development):**
```
mongodb://127.0.0.1:27017/URLSHORT
```

## Troubleshooting

### "Authentication failed"
- Double-check username and password
- Make sure password doesn't have special characters that need URL encoding
- Try resetting the database user password

### "IP not whitelisted"
- Make sure `0.0.0.0/0` is in Network Access
- Wait a few minutes after adding IP

### "Connection timeout"
- Check connection string format
- Verify cluster is running (not paused)
- Check if your password has special characters (use URL encoding: `@` → `%40`, `#` → `%23`, etc.)

## Security Notes

- ✅ Never commit `.env` file to GitHub (already in `.gitignore`)
- ✅ Use strong passwords for database user
- ✅ For production, consider restricting IPs (but `0.0.0.0/0` is needed for Vercel)
- ✅ Rotate passwords periodically

## Free Tier Limits

- **512MB storage** (plenty for URL shortener)
- **Shared resources**
- Perfect for small to medium applications

