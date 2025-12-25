# MongoDB Atlas Connection - Next Steps

## Current Step: Choose Connection Method

You're at step 2 of 3. Here's what to do:

### 1. Click on "Drivers" (First Option)

- Look for the option with the calendar/data table icon
- Description: "Access your Atlas data using MongoDB's native drivers (e.g. Node.js, Go, etc.)"
- **Click this option** - it's the one you need for your Node.js/Express app

### 2. After Clicking "Drivers"

You'll see:
- **Driver**: Node.js (should be selected)
- **Version**: 5.5 or later (or latest)
- **Connection string**: A string that looks like:
  ```
  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

### 3. Copy the Connection String

1. Click the **copy icon** next to the connection string
2. The string will have placeholders:
   - `<username>` - Replace with your database username
   - `<password>` - Replace with your database password

### 4. Format the Connection String

Replace the placeholders and add your database name:

**Before:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After (example):**
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/URLSHORT?retryWrites=true&w=majority
```

**Important:**
- Replace `<username>` with your actual username
- Replace `<password>` with your actual password
- Add `/URLSHORT` before the `?` (this is your database name)
- If your password has special characters, URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - etc.

### 5. Add to Vercel

1. Go to your Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Add:
   - **Key**: `MONGODB_URI`
   - **Value**: Your formatted connection string
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application

### 6. Test

After redeploying, visit your Vercel URL and test creating a short URL!

---

## Quick Checklist

- [ ] Clicked "Drivers" option
- [ ] Copied connection string
- [ ] Replaced `<username>` and `<password>`
- [ ] Added `/URLSHORT` database name
- [ ] Added `MONGODB_URI` to Vercel environment variables
- [ ] Redeployed application
- [ ] Tested the URL shortener

