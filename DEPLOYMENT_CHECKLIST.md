# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. **Fix nanoid Version Issue** ✅
- [x] `package.json` has `nanoid@4.0.2` ✅
- [x] `package-lock.json` has `nanoid@4.0.2` ✅
- [x] Local installation verified ✅

### 2. **MongoDB Atlas Setup** ✅
- [x] Code updated to use `MONGODB_URI` environment variable ✅
- [ ] MongoDB Atlas connection string obtained
- [ ] Connection string formatted correctly

### 3. **Files Ready to Commit**
- [x] `package.json` - nanoid v4 ✅
- [x] `package-lock.json` - nanoid v4 ✅
- [x] `index.js` - MongoDB Atlas ready ✅
- [x] `connect.js` - Optimized for serverless ✅
- [x] `controllers/url.js` - Optimized ✅
- [x] `vercel.json` - Configured ✅

## 📋 Deployment Steps

### Step 1: Commit and Push Changes

```bash
# Check what files have changed
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Fix: Use nanoid v4 for Vercel compatibility and optimize for MongoDB Atlas"

# Push to trigger Vercel deployment
git push
```

### Step 2: Set MongoDB Atlas Connection String in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add/Update:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://avishjhalani20:Avish%401504@cluster0.foertw1.mongodb.net/URLSHORT?retryWrites=true&w=majority`
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

### Step 3: Redeploy

After setting environment variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**

OR

Vercel will auto-redeploy after you push the code changes.

## 🔍 Verify Deployment

After deployment completes:

1. **Check Build Logs**:
   - Should see `nanoid@4.0.2` installing
   - No ESM errors

2. **Test the App**:
   - Visit your Vercel URL
   - Try creating a short URL
   - Test redirect functionality

3. **Check Function Logs**:
   - Should see "MongoDB connected"
   - No nanoid ESM errors

## ⚠️ Common Issues

### If nanoid error persists:
1. **Clear Vercel build cache**:
   - Settings → General → Clear Build Cache
   - Redeploy

2. **Verify package-lock.json is committed**:
   ```bash
   git add package-lock.json
   git commit -m "Update package-lock.json"
   git push
   ```

3. **Force reinstall in Vercel**:
   - Add to `package.json` scripts (temporary):
   ```json
   "postinstall": "npm install nanoid@4.0.2 --force"
   ```

### If MongoDB connection fails:
1. Verify `MONGODB_URI` is set in Vercel
2. Check connection string format
3. Verify IP whitelist in MongoDB Atlas (`0.0.0.0/0`)

## 📝 MongoDB Atlas Connection String Format

**Your connection string should be:**
```
mongodb+srv://avishjhalani20:Avish%401504@cluster0.foertw1.mongodb.net/URLSHORT?retryWrites=true&w=majority
```

**Important:**
- `Avish%401504` - Password with `@` encoded as `%40`
- `/URLSHORT` - Database name
- `?retryWrites=true&w=majority` - Connection options

