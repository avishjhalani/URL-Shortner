# 🚀 Deploy URL Shortener to Vercel - Complete Guide

This guide will help you deploy your URL shortener from local MongoDB to Vercel with MongoDB Atlas.

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)
3. **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

---

## Step 1: Set Up MongoDB Atlas (Cloud Database)

Since Vercel can't access your local MongoDB, you need a cloud database.

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email

### 1.2 Create a Free Cluster
1. After logging in, click **"Build a Database"**
2. Choose **"FREE"** (M0) tier
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click **"Create"** (takes 3-5 minutes)

### 1.3 Create Database User
1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username and strong password (⚠️ **SAVE THIS PASSWORD**)
5. Set privileges to **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

### 1.4 Configure Network Access
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - This allows Vercel's servers to connect
4. Click **"Confirm"**

### 1.5 Get Your Connection String
1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace the placeholders:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password (URL encode special characters)
   - Add your database name: `/URLSHORT` before the `?`
   
   **Final format:**
   ```
   mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/URLSHORT?retryWrites=true&w=majority
   ```
   
   ⚠️ **Important:** If your password contains special characters, URL encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
   - etc.

---

## Step 2: Push Code to GitHub

If your code isn't already on GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended for First Time)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub

2. **Import Your Repository**
   - Click **"Import Project"**
   - Select your GitHub repository
   - Click **"Import"**

3. **Configure Project Settings**
   - **Framework Preset:** `Other` (or leave as default)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** Leave empty (or `npm install`)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`
   - Click **"Deploy"**

4. **Wait for Deployment**
   - First deployment will fail (no MongoDB URI yet)
   - That's okay! We'll add environment variables next

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from your project directory)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? url-shortener (or your choice)
# - Directory? ./
# - Override settings? No
```

---

## Step 4: Add Environment Variables

This is the **most important step**!

1. **Go to Vercel Dashboard**
   - Open your project
   - Go to **"Settings"** → **"Environment Variables"**

2. **Add MongoDB Connection String**
   - Click **"Add New"**
   - **Key:** `MONGODB_URI`
   - **Value:** Your MongoDB Atlas connection string from Step 1.5
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/URLSHORT?retryWrites=true&w=majority
     ```
   - **Environment:** Select all (Production, Preview, Development)
   - Click **"Save"**

3. **Add Node Environment (Optional but Recommended)**
   - Click **"Add New"** again
   - **Key:** `NODE_ENV`
   - **Value:** `production`
   - **Environment:** Select all
   - Click **"Save"**

---

## Step 5: Redeploy

After adding environment variables:

1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **"⋯"** (three dots) menu
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"**

Wait for the deployment to complete (usually 1-2 minutes).

---

## Step 6: Test Your Deployment

1. **Visit Your Vercel URL**
   - Your app will be at: `https://your-project-name.vercel.app`
   - You can find it in the Vercel dashboard

2. **Test URL Shortening**
   - Enter a long URL
   - Click "Shorten"
   - Copy the short URL
   - Test it in a new tab

3. **Test Analytics**
   - Click "View Analytics" on a shortened URL
   - Verify it shows visit history

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster is created and running
- [ ] Database user is created with proper permissions
- [ ] Network access allows `0.0.0.0/0` (all IPs)
- [ ] Connection string is correctly formatted with database name
- [ ] Code is pushed to GitHub
- [ ] Project is deployed on Vercel
- [ ] `MONGODB_URI` environment variable is set in Vercel
- [ ] Project has been redeployed after adding environment variables
- [ ] Short URL creation works
- [ ] URL redirection works
- [ ] Analytics work

---

## 🔧 Troubleshooting

### "MongoDB connection error" or "MONGODB_URI environment variable is required"

**Solutions:**
1. ✅ Verify `MONGODB_URI` is set in Vercel environment variables
2. ✅ Check the connection string format (must include `/URLSHORT` before `?`)
3. ✅ Ensure password is URL-encoded if it has special characters
4. ✅ Verify MongoDB Atlas network access includes `0.0.0.0/0`
5. ✅ Check MongoDB Atlas cluster is running (not paused)
6. ✅ Redeploy after adding environment variables

### "Function timeout"

**Solutions:**
- Vercel free tier has 10-second timeout
- First request (cold start) might be slow
- Consider upgrading to Pro plan for longer timeouts

### "Module not found"

**Solutions:**
- Ensure all dependencies are in `package.json`
- Check `node_modules` is not committed to git
- Verify `npm install` runs during deployment

### Short URLs don't redirect

**Solutions:**
- Check `vercel.json` routing configuration
- Verify the `[shortID].js` API route exists
- Check Vercel function logs for errors

---

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/URLSHORT?retryWrites=true&w=majority` |
| `NODE_ENV` | Node environment | `production` |

---

## 🔄 Updating Your Deployment

After making code changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically detect the push and redeploy! 🎉

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🎉 You're Done!

Your URL shortener is now live on Vercel with MongoDB Atlas! 

**Next Steps:**
- Set up a custom domain (optional)
- Monitor usage in Vercel dashboard
- Check MongoDB Atlas for database metrics


