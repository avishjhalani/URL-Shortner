# Setting Up MongoDB Atlas for Vercel

## Why MongoDB Atlas?

- ✅ Vercel serverless functions can't access localhost MongoDB
- ✅ Atlas provides a cloud database accessible from anywhere
- ✅ Free tier available (512MB storage)
- ✅ Automatic backups and scaling

## Step-by-Step Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email

### 2. Create a Cluster

1. Click **"Build a Database"**
2. Choose **FREE (M0)** tier
3. Select a cloud provider and region (choose closest to you)
4. Click **"Create"**
5. Wait 3-5 minutes for cluster to be created

### 3. Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username and password (save these!)
5. Set privileges to **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

### 4. Whitelist IP Addresses

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - This allows Vercel's servers to connect
   - For production, you can restrict to specific IPs later
4. Click **"Confirm"**

### 5. Get Connection String

1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<password>` with your actual password
6. Add your database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/URLSHORT?retryWrites=true&w=majority`

### 6. Test Connection (Optional)

You can test the connection string locally by updating your `index.js` temporarily:

```javascript
const MONGODB_URI = "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/URLSHORT?retryWrites=true&w=majority";
```

### 7. Add to Vercel

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your full connection string
   - **Environment**: Production, Preview, Development (select all)
4. Click **"Save"**
5. **Redeploy** your application

## Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/URLSHORT?retryWrites=true&w=majority
```

## Security Tips

1. **Never commit** your connection string to GitHub
2. Use **strong passwords** for database user
3. Consider **restricting IPs** in production (but `0.0.0.0/0` is fine for Vercel)
4. Use **environment variables** (already set up in your code)

## Troubleshooting

**"Authentication failed"**
- Check username and password are correct
- Make sure password doesn't have special characters that need URL encoding

**"IP not whitelisted"**
- Make sure `0.0.0.0/0` is added to Network Access

**"Connection timeout"**
- Check your connection string format
- Verify cluster is running (not paused)

## Free Tier Limits

- **512MB storage** (enough for thousands of URLs)
- **Shared RAM and CPU**
- Perfect for small to medium applications

