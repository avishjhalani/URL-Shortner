# Troubleshooting FUNCTION_INVOCATION_FAILED

## Common Causes & Solutions

### 1. **Missing MONGODB_URI Environment Variable**

**Symptom**: Function crashes immediately

**Solution**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `MONGODB_URI` with your MongoDB Atlas connection string
3. Format: `mongodb+srv://username:password@cluster.mongodb.net/URLSHORT?retryWrites=true&w=majority`
4. Make sure password has `@` encoded as `%40`
5. Redeploy

### 2. **Module Import Errors**

**Check**:
- All dependencies are in `package.json`
- `nanoid@4.0.2` is specified (not v5)
- `package-lock.json` is committed

**Solution**:
```bash
npm install
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push
```

### 3. **Database Connection Timeout**

**Solution**: The connection caching should handle this, but verify:
- MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Connection string is correct
- Database user has proper permissions

### 4. **Check Vercel Function Logs**

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to "Functions" tab
4. Click on the function that's failing
5. Check "Logs" for detailed error messages

### 5. **Clear Build Cache**

1. Vercel Dashboard → Settings → General
2. Scroll to "Build Cache"
3. Click "Clear Build Cache"
4. Redeploy

## Quick Fix Checklist

- [ ] `MONGODB_URI` is set in Vercel environment variables
- [ ] Connection string format is correct (with `/URLSHORT` database name)
- [ ] Password special characters are URL-encoded (`@` → `%40`)
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] `package.json` has `nanoid@4.0.2`
- [ ] `package-lock.json` is committed
- [ ] All files are committed and pushed
- [ ] Build cache is cleared

## Test Locally First

Before deploying, test locally:
```bash
# Set environment variable
export MONGODB_URI="your-connection-string"

# Run locally
npm start

# Test the endpoint
curl -X POST http://localhost:8001/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

If it works locally but fails on Vercel, it's likely an environment variable issue.




