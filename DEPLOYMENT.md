# Deployment Guide

## Prerequisites

- Node.js 18+ LTS installed
- PostgreSQL database (for production)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)
- Server with at least 2GB RAM (4GB+ recommended)

## Backend Deployment (Strapi)

### 1. Prepare Production Environment

```bash
cd backend
```

### 2. Update Environment Variables

Create `.env.production` file:

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Generate new secrets for production
APP_KEYS=your-production-app-keys
API_TOKEN_SALT=your-production-api-token-salt
ADMIN_JWT_SECRET=your-production-admin-jwt-secret
JWT_SECRET=your-production-jwt-secret

# PostgreSQL Database
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=strapi_ads
DATABASE_USERNAME=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_SSL=true

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# WhatsApp
WHATSAPP_NUMBER=+1234567890

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PROVIDER=local
# Or use cloud storage:
# UPLOAD_PROVIDER=aws-s3
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# AWS_BUCKET=your-bucket
# AWS_REGION=us-east-1
```

### 3. Build Strapi

```bash
npm run build
```

### 4. Deploy Options

#### Option A: PM2 (Recommended for VPS)

```bash
# Install PM2 globally
npm install -g pm2

# Start Strapi with PM2
pm2 start npm --name "strapi" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Option B: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t strapi-app .
docker run -d -p 1337:1337 --env-file .env.production strapi-app
```

#### Option C: Railway / Render / Heroku

These platforms provide one-click deployment. Follow their specific documentation.

### 5. Configure Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d api.yourdomain.com
```

## Frontend Deployment

### 1. Update Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

### 2. Build Frontend

```bash
cd frontend
npm run build
```

This creates a `dist` folder with production-ready files.

### 3. Deploy Options

#### Option A: Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the frontend directory
3. Follow prompts
4. Set environment variables in Vercel dashboard

#### Option B: Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run `netlify deploy --prod` in frontend directory
3. Set environment variables in Netlify dashboard

#### Option C: Static Hosting (Nginx)

```bash
# Copy dist folder to server
scp -r dist/* user@server:/var/www/html/

# Configure Nginx
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Option D: AWS S3 + CloudFront

1. Upload `dist` folder to S3 bucket
2. Configure bucket for static website hosting
3. Create CloudFront distribution
4. Point domain to CloudFront

### 4. Setup SSL

Use Let's Encrypt or your hosting provider's SSL.

## Database Setup

### PostgreSQL Production Database

```sql
-- Create database
CREATE DATABASE strapi_ads;

-- Create user
CREATE USER strapi_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE strapi_ads TO strapi_user;
```

### Run Migrations

Strapi will automatically run migrations on first start.

## Post-Deployment Checklist

- [ ] Backend accessible at production URL
- [ ] Frontend accessible at production URL
- [ ] SSL certificates valid
- [ ] Database connection working
- [ ] File uploads working
- [ ] Admin panel accessible
- [ ] API endpoints responding
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Error logging configured
- [ ] Backup strategy in place

## Monitoring & Maintenance

### Setup Monitoring

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Performance**: Lighthouse CI

### Regular Backups

```bash
# Database backup script
pg_dump -h localhost -U strapi_user strapi_ads > backup_$(date +%Y%m%d).sql

# Media files backup
tar -czf media_backup_$(date +%Y%m%d).tar.gz public/uploads/
```

### Update Process

1. Pull latest code
2. Install dependencies: `npm install`
3. Run migrations (if any)
4. Build: `npm run build`
5. Restart: `pm2 restart strapi` or restart Docker container

## Troubleshooting

### Common Issues

**Issue**: Strapi won't start
- Check environment variables
- Verify database connection
- Check logs: `pm2 logs strapi`

**Issue**: CORS errors
- Verify `FRONTEND_URL` in backend `.env`
- Check `config/middlewares.ts` CORS configuration

**Issue**: File uploads fail
- Check file size limits
- Verify upload directory permissions
- Check disk space

**Issue**: Slow performance
- Enable database indexes
- Use CDN for media files
- Enable caching
- Optimize images

## Security Best Practices

1. **Never commit `.env` files** - Use environment variables
2. **Use strong secrets** - Generate random strings for all secrets
3. **Enable HTTPS** - Always use SSL in production
4. **Regular updates** - Keep dependencies updated
5. **Database backups** - Regular automated backups
6. **Rate limiting** - Implement rate limiting for API
7. **Input validation** - Validate all user inputs
8. **SQL injection protection** - Use parameterized queries (Strapi handles this)

## Performance Optimization

1. **Enable Gzip compression** in Nginx
2. **Use CDN** for static assets and media
3. **Database indexing** on frequently queried fields
4. **Image optimization** - Compress images before upload
5. **Caching** - Implement Redis for session storage
6. **Load balancing** - For high traffic

## Support

For issues or questions:
- Check Strapi documentation: https://docs.strapi.io
- Check React documentation: https://react.dev
- Review application logs

