# URL Shortener

A full-stack URL shortener application built with Node.js, Express, MongoDB, and vanilla JavaScript.

LINK to WEBSITE : https://url-shortner-beta-sooty.vercel.app/

## Features

- 🔗 Shorten long URLs into short, shareable links
- 📊 View analytics (total clicks and visit history)
- 🎨 Modern, responsive web interface
- ⚡ Fast redirects

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Local: Make sure MongoDB is running on `localhost:27017`
   - Cloud: Get your MongoDB Atlas connection string

4. Update MongoDB connection in `index.js` or set `MONGODB_URI` environment variable

5. Start the server:
   ```bash
   npm run dev
   ```

6. Open `http://localhost:8001` in your browser

## Deployment

### Render.com

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
6. Deploy!

### Railway

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create a new project from GitHub
4. Add MongoDB service or set `MONGODB_URI`
5. Deploy!

### Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set MongoDB URI: `heroku config:set MONGODB_URI=your-connection-string`
5. Deploy: `git push heroku main`

### Vercel

Note: Vercel is better for serverless. For full Express apps, consider Render or Railway.

## Environment Variables

- `PORT`: Server port (default: 8001)
- `MONGODB_URI`: MongoDB connection string

## API Endpoints

- `POST /url` - Create a short URL
- `GET /:shortID` - Redirect to original URL
- `GET /analytics/:shortID` - Get analytics for a short URL

## License

ISC

