# Development Guide

## Running Both Applications Together

### Option 1: Using npm script (Recommended)

From the root directory:

```bash
# Install root dependencies first (one time)
npm install

# Install all dependencies (backend + frontend)
npm run install:all

# Run both applications with colored logs
npm run dev
```

This will start:
- **Backend (Strapi)**: http://localhost:1337
- **Frontend (React)**: http://localhost:5173

Logs will be prefixed with:
- `[BACKEND]` in blue - Strapi backend logs
- `[FRONTEND]` in green - Vite frontend logs

### Option 2: Using separate terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run develop
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 3: Using a process manager (PM2)

Install PM2 globally:
```bash
npm install -g pm2
```

Create `ecosystem.config.js` in root:
```javascript
module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'npm',
      args: 'run develop',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};
```

Run:
```bash
pm2 start ecosystem.config.js
pm2 logs  # View all logs
pm2 stop all  # Stop both
```

## Log Output Format

When using `npm run dev`, you'll see output like:

```
[BACKEND] [2024-01-15 10:30:45] info: Server started on port 1337
[FRONTEND] VITE v5.0.0  ready in 500 ms
[FRONTEND] ➜  Local:   http://localhost:5173/
[BACKEND] [2024-01-15 10:30:46] info: Database connected
```

## Troubleshooting

### Port Already in Use

If you get port conflicts:

**Backend (1337):**
- Change `PORT` in `backend/.env`
- Or kill the process: `lsof -ti:1337 | xargs kill -9`

**Frontend (5173):**
- Vite will automatically use the next available port
- Or specify in `frontend/vite.config.ts`:
  ```typescript
  export default {
    server: {
      port: 5174
    }
  }
  ```

### Dependencies Not Installed

Make sure to run:
```bash
npm run install:all
```

This installs dependencies for:
- Root package (concurrently)
- Backend (Strapi)
- Frontend (React/Vite)

## Environment Variables

Make sure both applications have their `.env` files configured:

**Backend** (`backend/.env`):
```env
HOST=0.0.0.0
PORT=1337
# ... other backend env vars
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:1337/api
```

## Hot Reload

Both applications support hot reload:
- **Backend**: Strapi will restart on file changes
- **Frontend**: Vite HMR (Hot Module Replacement) for instant updates

## Stopping Applications

- Press `Ctrl+C` in the terminal running `npm run dev`
- Or use `Ctrl+C` in each terminal if running separately

