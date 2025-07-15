# URL Shortener Microservice

## Features
- Create short URLs with optional custom shortcode and validity
- Redirect to original URLs
- Track click stats and history
- Integrated with reusable Logging Middleware

## Tech Stack
- Node.js, Express
- SQLite (with Sequelize ORM)
- dotenv for environment variables

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in this folder with:
   ```env
   DATABASE_URL=sqlite:./database.sqlite
   LOG_AUTH_TOKEN=your_token_here
   PORT=3000
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## Endpoints
- `POST /shorturls` — Create Short URL
- `GET /shorturls/:shortcode` — Get Stats
- `GET /:shortcode` — Redirect 