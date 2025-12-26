# ⚡ Quick Start - Deploy to Vercel in 5 Minutes

## 🎯 Fast Track Deployment

### Step 1: MongoDB Atlas (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) → Sign up (free)
2. Create a **FREE** cluster (M0) → Wait 3-5 minutes
3. **Database Access**: Create user (username + password) → **SAVE PASSWORD**
4. **Network Access**: Add IP `0.0.0.0/0` (Allow from anywhere)
5. **Database** → **Connect** → **Connect your application** → Copy connection string
6. Replace in connection string:
   - `<username>` → your username
   - `<password>` → your password (URL encode special chars: `@` = `%40`)
   - Add `/URLSHORT` before the `?`
   
   **Example:**
   ```
   mongodb+srv://myuser:mypass%40123@cluster0.xxxxx.mongodb.net/URLSHORT?retryWrites=true&w=majority
   ```

### Step 2: Push to GitHub (1 minute)

```bash
git add .
git commit -m "Ready for Vercel"
git push
```

### Step 3: Deploy to Vercel (2 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import** your GitHub repo
3. Click **Deploy** (will fail first time - that's OK!)

### Step 4: Add Environment Variable (30 seconds)

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** Your connection string from Step 1
   - **Environment:** All (Production, Preview, Development)
3. Click **Save**

### Step 5: Redeploy (30 seconds)

1. **Deployments** tab → Latest deployment → **⋯** → **Redeploy**
2. Wait 1-2 minutes
3. ✅ **Done!** Visit your Vercel URL

---

## 🔍 Verify It Works

1. Visit: `https://your-project.vercel.app`
2. Enter a URL → Click "Shorten"
3. Copy the short URL → Test it in a new tab
4. Click "View Analytics" → Should show visit count

---

## ❌ Troubleshooting

**"MONGODB_URI environment variable is required"**
- ✅ Check environment variable is set in Vercel
- ✅ Redeploy after adding it

**"MongoDB connection error"**
- ✅ Verify connection string format (includes `/URLSHORT`)
- ✅ Check password is URL-encoded
- ✅ Verify network access allows `0.0.0.0/0`

**Short URLs don't work**
- ✅ Check Vercel function logs
- ✅ Verify MongoDB cluster is running (not paused)

---

## 📚 Full Guide

For detailed instructions, see [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md)

