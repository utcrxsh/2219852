# URL Shortener Microservice

## Overview
This microservice provides robust URL shortening and analytics, with mandatory integration of a reusable Logging Middleware. 

## Key Design Choices
- **Single Microservice:** All endpoints are handled within a single Express app for simplicity and ease of deployment.
- **Logging Middleware:** All business logic, route entry, DB actions, and errors are logged via a reusable logger, ensuring observability and compliance with requirements.
- **No Authentication:** Assumes all users are pre-authorized, so no user management is implemented.

## Technology Selections
- **Node.js + Express:** Chosen for rapid development, wide ecosystem, and ease of middleware integration.
- **SQLite + Sequelize ORM:** SQLite is lightweight and file-based, ideal for quick setup and local development. Sequelize provides a robust ORM for data modeling and validation.
- **dotenv:** Used for environment variable management, supporting secure and flexible configuration.

## Data Modeling
- **URL Table:**
  - `id` (auto-increment)
  - `original_url` (string, required)
  - `shortcode` (string, unique, required)
  - `expiry` (datetime, required)
  - `created_at` (datetime, required)
- **Click Table:**
  - `id` (auto-increment)
  - `urlId` (foreign key to URL)
  - `timestamp` (datetime, required)
  - `referrer` (string, optional)
  - `location` (string, dummy value 'India')

## API Design
- **POST /shorturls**
  - Validates input (URL format, shortcode uniqueness/alphanumeric, validity default 30 min).
  - Generates unique shortcode if not provided.
  - Returns 201 with shortLink and expiry on success.
  - Logs all actions and errors.
- **GET /shorturls/:shortcode**
  - Returns stats: original_url, created_at, expires_at, click count, click history (timestamp, referrer, location).
  - 404 if shortcode not found.
  - Logs all actions and errors.
- **GET /:shortcode**
  - Redirects to original URL if valid and not expired.
  - Increments click count, logs click event.
  - 404 if not found, 410 if expired.
  - Logs all actions and errors.
