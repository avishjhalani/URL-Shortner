# Deploying to Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a free MongoDB Atlas cluster (recommended for production)
3. **GitHub Account**: Your code should be in a GitHub repository

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Set Up MongoDB Atlas (if not already done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (add `0.0.0.0/0` for Vercel)
5. Get your connection string (looks like: `mongodb+srv://user:password@cluster.mongodb.net/dbname`)

### 3. Deploy to Vercel

**Option A: Using Vercel CLI**

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name? **url-shortener** (or your choice)
   - Directory? **./**
   - Override settings? **No**

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: **Other**
   - Root Directory: **./**
   - Build Command: Leave empty (or `npm install`)
   - Output Directory: Leave empty
   - Install Command: `npm install`

### 4. Set Environment Variables

In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables:

   - **MONGODB_URI**: Your MongoDB Atlas connection string
     ```
     mongodb+srv://username:password@cluster.mongodb.net/URLSHORT?retryWrites=true&w=majority
     ```

   - **NODE_ENV**: `production`

3. Click **Save**

### 5. Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**

## Testing Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Try shortening a URL
3. Test the redirect functionality
4. Check analytics

## Important Notes

- **MongoDB Connection**: Make sure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` to allow Vercel's servers
- **Cold Starts**: First request might be slow due to serverless cold starts
- **Static Files**: Your frontend files in `public/` are served automatically
- **Environment Variables**: Never commit your MongoDB URI to GitHub

## Troubleshooting

**"MongoDB connection error"**
- Check your MongoDB Atlas connection string
- Verify IP whitelist includes `0.0.0.0/0`
- Check environment variables are set correctly

**"Function timeout"**
- Vercel free tier has 10s timeout for Hobby plan
- Consider upgrading or optimizing your code

**"Module not found"**
- Make sure all dependencies are in `package.json`
- Check that `node_modules` is not in `.gitignore` incorrectly

## Updating Your Deployment

After making changes:
```bash
git add .
git commit -m "Update"
git push
```

Vercel will automatically redeploy!

