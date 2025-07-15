# Logging Middleware

Reusable logging middleware for backend microservices.

## Features
- Sends logs to a remote logging service with stack, level, package, and message fields.
- Easy to import and use in any Node.js backend.

## Setup
1. Install dependencies:
   ```bash
   npm install axios dotenv
   ```
2. Add your Authorization Bearer token to `.env`:
   ```env
   LOG_AUTH_TOKEN=your_token_here
   ```

## Parameters
- `stack`: e.g., 'backend'
- `level`: 'debug', 'info', 'warn', 'error', 'fatal'
- `package`: e.g., 'route', 'service', 'handler', etc.
- `message`: Descriptive string of the event 
