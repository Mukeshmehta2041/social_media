# Frontend Architecture Document - React

## Technology Stack

### Core Technologies
- **React** 18.x
- **React Router** v6 (Navigation)
- **Redux Toolkit** (State Management)
- **Axios** (API Communication)
- **React Query** (Server State Management)

### UI & Styling
- **Tailwind CSS** (Styling Framework)
- **Headless UI** (Accessible Components)
- **React Icons** (Icon Library)
- **React Toastify** (Notifications)

### Form Management
- **React Hook Form** (Form Handling)
- **Yup** (Validation Schema)

### Additional Libraries
- **React Dropzone** (Image Upload)
- **Date-fns** (Date Formatting)
- **React Helmet** (SEO Management)
- **React Image Gallery** (Image Carousel)

---

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── api/
│   │   ├── axios.js
│   │   ├── auth.api.js
│   │   ├── ads.api.js
│   │   ├── categories.api.js
│   │   └── users.api.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Pagination.jsx
│   │   ├── ads/
│   │   │   ├── AdCard.jsx
│   │   │   ├── AdGrid.jsx
│   │   │   ├── AdDetails.jsx
│   │   │   ├── AdForm.jsx
│   │   │   └── AdFilters.jsx
│   │   ├── search/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── AdvancedSearch.jsx
│   │   │   └── SearchResults.jsx
│   │   └── user/
│   │       ├── ProfileCard.jsx
│   │       ├── Dashboard.jsx
│   │       └── UserAds.jsx
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── CityPage.jsx
│   │   │   ├── AdDetailPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── TermsPage.jsx
│   │   │   ├── PrivacyPage.jsx
│   │   │   └── HelpPage.jsx
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── user/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── MyAdsPage.jsx
│   │   │   ├── PostAdPage.jsx
│   │   │   ├── EditAdPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── UserManagement.jsx
│   │       ├── AdManagement.jsx
│   │       ├── ContentModeration.jsx
│   │       └── Analytics.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAds.js
│   │   ├── useSearch.js
│   │   ├── useLocation.js
│   │   └── useDebounce.js
│   ├── store/
│   │   ├── index.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── adsSlice.js
│   │   │   ├── uiSlice.js
│   │   │   └── searchSlice.js
│   │   └── middleware/
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── styles/
│   │   ├── index.css
│   │   └── tailwind.css
│   ├── App.jsx
│   └── index.js
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js (or webpack.config.js)
```

---

## Key Components Architecture

### 1. Authentication Flow
```javascript
// Flow: Login → JWT Token → Store in Redux → Axios Interceptor
- LoginPage → authApi.login() → Store token → Redirect
- Protected routes use PrivateRoute wrapper
- Token refresh logic in axios interceptor
```

### 2. Ad Management Flow
```javascript
// Flow: Create → Upload Images → Submit → Moderation → Publish
- PostAdPage → Form validation → Image upload to Strapi
- Edit/Delete operations with optimistic updates
- Real-time status updates
```

### 3. Search Architecture
```javascript
// Multi-layered search system
- Quick search (header)
- Advanced filters (category, location, price range)
- Debounced search queries
- Query string parameters for shareable URLs
```

---

## State Management Strategy

### Redux Store Structure
```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  },
  ads: {
    list: [],
    currentAd: null,
    filters: {},
    pagination: {}
  },
  ui: {
    theme: 'light',
    notifications: [],
    modals: {}
  },
  search: {
    query: '',
    results: [],
    filters: {}
  }
}
```

---

## API Integration

### Axios Configuration
```javascript
// Base configuration with Strapi
baseURL: process.env.REACT_APP_API_URL + '/api'
Headers: Authorization: Bearer {token}
Interceptors for token refresh and error handling
```

### API Endpoints Structure
- `/auth/*` - Authentication
- `/advertisements/*` - Ad CRUD operations
- `/categories/*` - Category data
- `/users/*` - User management
- `/upload` - File uploads

---

## Responsive Design Breakpoints

```javascript
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

---

## Performance Optimization

1. **Code Splitting**
   - Route-based lazy loading
   - Component lazy loading for heavy modules

2. **Image Optimization**
   - Lazy loading images
   - Progressive image loading
   - WebP format with fallbacks

3. **Caching Strategy**
   - React Query for server state
   - LocalStorage for preferences
   - Service Worker for offline support

4. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression (gzip/brotli)

---

## Security Measures

1. **XSS Protection**
   - Input sanitization
   - Content Security Policy

2. **CSRF Protection**
   - Token validation
   - SameSite cookies

3. **Authentication Security**
   - JWT token expiration
   - Refresh token rotation
   - Secure password validation

---

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:1337
REACT_APP_SITE_NAME=YourSiteName
REACT_APP_WHATSAPP_NUMBER=+1234567890
REACT_APP_RECAPTCHA_KEY=your_key_here
REACT_APP_MAX_IMAGE_SIZE=5242880
REACT_APP_MAX_IMAGES_PER_AD=10
```

---

## Build & Deployment

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Targets
- Vercel (Recommended)
- Netlify
- AWS S3 + CloudFront
- Traditional hosting (Apache/Nginx)

---

## Testing Strategy

1. **Unit Tests** - Jest + React Testing Library
2. **Integration Tests** - API integration tests
3. **E2E Tests** - Cypress/Playwright
4. **Accessibility Tests** - axe-core

---

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)
