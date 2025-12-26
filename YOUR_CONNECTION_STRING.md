# Your MongoDB Atlas Connection String

## Your Current Connection String
```
mongodb+srv://avishjhalani20:Avish@1504@cluster0.foertw1.mongodb.net/?appName=Cluster0
```

## Issues to Fix

1. **Password encoding**: Your password `Avish@1504` contains `@` which needs to be URL-encoded as `%40`
2. **Database name**: Need to add `/URLSHORT` before the `?`
3. **Query parameters**: Should use `retryWrites=true&w=majority` instead of `appName=Cluster0`

## Corrected Connection String

**Use this in Vercel:**
```
mongodb+srv://avishjhalani20:Avish%401504@cluster0.foertw1.mongodb.net/URLSHORT?retryWrites=true&w=majority
```

## Changes Made

- `Avish@1504` → `Avish%401504` (encoded the `@` symbol)
- Added `/URLSHORT` (your database name)
- Changed query parameters to `retryWrites=true&w=majority`

## How to Add to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Click "Add New"
3. Enter:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://avishjhalani20:Avish%401504@cluster0.foertw1.mongodb.net/URLSHORT?retryWrites=true&w=majority`
   - **Environments**: Select all (Production, Preview, Development)
4. Click "Save"
5. **Redeploy** your application

## Security Note

⚠️ **Never share this connection string publicly!** It contains your database credentials.

