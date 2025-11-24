# PM2 Setup Guide

This guide explains how to run the frontend and backend services using PM2.

## Prerequisites

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Build both frontend and backend:
```bash
npm run build
```

## PM2 Commands

### Start Services
```bash
npm run pm2:start
# or
pm2 start ecosystem.config.js
```

### Stop Services
```bash
npm run pm2:stop
# or
pm2 stop ecosystem.config.js
```

### Restart Services
```bash
npm run pm2:restart
# or
pm2 restart ecosystem.config.js
```

### Delete Services from PM2
```bash
npm run pm2:delete
# or
pm2 delete ecosystem.config.js
```

### View Logs
```bash
npm run pm2:logs
# or
pm2 logs

# View logs for specific app
pm2 logs backend
pm2 logs frontend
```

### Check Status
```bash
npm run pm2:status
# or
pm2 status
```

### Monitor Resources
```bash
npm run pm2:monit
# or
pm2 monit
```

## Additional PM2 Commands

### Save PM2 Configuration
After starting your apps, save the current process list:
```bash
pm2 save
```

### Setup PM2 to Start on System Boot
```bash
pm2 startup
# Follow the instructions shown
pm2 save
```

### View Detailed Information
```bash
pm2 show backend
pm2 show frontend
```

### Reload Apps (Zero Downtime)
```bash
pm2 reload ecosystem.config.js
```

### Stop All PM2 Processes
```bash
pm2 stop all
```

### Delete All PM2 Processes
```bash
pm2 delete all
```

## Configuration

The PM2 configuration is in `ecosystem.config.js`. It includes:

- **Backend**: Runs on port 1337
- **Frontend**: Runs on port 4173 (Vite preview)
- **Logs**: Stored in `./logs/` directory
- **Auto-restart**: Enabled
- **Memory limits**: Backend 1GB, Frontend 500MB

## Development Mode with PM2

If you want to run in development mode with PM2, modify `ecosystem.config.js`:

```javascript
// For backend development
args: 'run develop',  // instead of 'run start'

// For frontend development  
args: 'run dev',      // instead of 'run preview'
```

Or create a separate `ecosystem.dev.config.js` for development.

## Troubleshooting

### Check if ports are in use
```bash
# Backend (1337)
lsof -i :1337

# Frontend (4173)
lsof -i :4173
```

### View real-time logs
```bash
pm2 logs --lines 100
```

### Restart specific app
```bash
pm2 restart backend
pm2 restart frontend
```

### Clear logs
```bash
pm2 flush
```

## Production Deployment

1. Build the applications:
```bash
npm run build
```

2. Start with PM2:
```bash
npm run pm2:start
```

3. Save PM2 configuration:
```bash
pm2 save
```

4. Setup PM2 to start on boot:
```bash
pm2 startup
pm2 save
```

## Environment Variables

Make sure to set environment variables before starting PM2. You can:

1. Create `.env` files in backend and frontend directories
2. Or modify `ecosystem.config.js` to include env variables in the `env` section

Example:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 1337,
  DATABASE_CLIENT: 'sqlite',
  // Add other env variables here
},
```

