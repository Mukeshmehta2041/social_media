# Social Media Platform

A classified ads platform built with React + Vite + TypeScript (frontend) and Strapi CMS (backend).

## Tech Stack

### Frontend
- React 18+ with Vite
- TypeScript
- Tailwind CSS
- React Router v6
- TanStack Query (React Query)
- Zustand (State Management)
- React Hook Form
- Axios

### Backend
- Strapi v4.x
- PostgreSQL (Production)
- Node.js 18+ LTS

## Project Structure

```
social_media/
├── frontend/          # React frontend application
├── backend/           # Strapi CMS backend
└── docs/              # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ LTS
- PostgreSQL (for production) or SQLite (for development)
- npm or yarn

### Quick Start (Run Both Apps Together)

1. Install root dependencies:
```bash
npm install
```

2. Install all dependencies (backend + frontend):
```bash
npm run install:all
```

3. Set up environment variables:
   - Backend: Create `backend/.env` file (see Environment Variables section)
   - Frontend: Create `frontend/.env` file with `VITE_API_URL=http://localhost:1337/api`

4. Run both applications simultaneously:
```bash
npm run dev
```

This will start:
- **Backend** (Strapi) at `http://localhost:1337`
- **Frontend** (React) at `http://localhost:5173`

Logs from both applications will be displayed with colored prefixes:
- `[BACKEND]` - Strapi backend logs (blue)
- `[FRONTEND]` - Vite frontend logs (green)

### Individual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials and other settings.

5. Start Strapi in development mode:
```bash
npm run develop
```

6. Access the admin panel at `http://localhost:1337/admin` and create your first admin user.

7. Create the content types in Strapi admin panel:
   - Category
   - City
   - Advertisement
   - Report
   - Saved Search
   - Contact Form

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
echo "VITE_API_URL=http://localhost:1337/api" > .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open `http://localhost:5173` in your browser.

## Environment Variables

### Backend (.env)

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret

DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_ads
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password
DATABASE_SSL=false

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your@email.com
SMTP_PASSWORD=your-password

WHATSAPP_NUMBER=+1234567890
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:1337/api
```

## Features

- User authentication (register, login, password reset)
- Advertisement management (create, edit, delete)
- Category and city-based browsing
- Search and filter functionality
- Image gallery for advertisements
- WhatsApp integration for contact
- User dashboard
- Admin panel (Strapi built-in)
- Responsive design

## Development

### Run Both Applications

- **Development (both apps)**: `npm run dev` (from root directory)
- **Backend only**: `cd backend && npm run develop`
- **Frontend only**: `cd frontend && npm run dev`

### Build

- **Build both**: `npm run build` (from root directory)
- **Backend only**: `cd backend && npm run build`
- **Frontend only**: `cd frontend && npm run build`

### Production

- **Start both**: `npm run start` (from root directory)
- **Backend only**: `cd backend && npm run start`
- **Frontend only**: `cd frontend && npm run preview`

## Deployment

### Backend

1. Set up PostgreSQL database
2. Configure production environment variables
3. Build: `npm run build`
4. Start: `npm start`

### Frontend

1. Build: `npm run build`
2. Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

## License

MIT

