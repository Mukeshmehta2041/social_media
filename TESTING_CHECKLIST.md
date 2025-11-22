# Testing Checklist

## Pre-Deployment Testing

### Backend Testing

#### Strapi Setup
- [ ] Access admin panel at `http://localhost:1337/admin`
- [ ] Create admin user account
- [ ] Configure permissions:
  - [ ] Public role: Enable `find` and `findOne` for Categories
  - [ ] Public role: Enable `find` and `findOne` for Cities
  - [ ] Public role: Enable `find` and `findOne` for Advertisements
  - [ ] Authenticated role: Enable `create`, `update`, `delete` for own Advertisements
  - [ ] Authenticated role: Enable `create` for Contact Forms, Reports, Saved Searches

#### Content Types
- [ ] Create test categories (at least 3-5)
- [ ] Create test cities (at least 5-10)
- [ ] Verify all content types are accessible via API

#### API Endpoints
- [ ] Test GET `/api/categories` - returns list of categories
- [ ] Test GET `/api/cities` - returns list of cities
- [ ] Test GET `/api/advertisements` - returns list of ads
- [ ] Test GET `/api/advertisements/:id` - returns single ad
- [ ] Test POST `/api/auth/local/register` - user registration
- [ ] Test POST `/api/auth/local` - user login
- [ ] Test POST `/api/advertisements` - create ad (authenticated)
- [ ] Test PUT `/api/advertisements/:id` - update ad (authenticated)
- [ ] Test DELETE `/api/advertisements/:id` - delete ad (authenticated)

### Frontend Testing

#### Authentication
- [ ] User registration flow
- [ ] User login flow
- [ ] User logout
- [ ] Protected routes redirect to login when not authenticated
- [ ] Token persistence after page refresh
- [ ] Password validation on registration

#### Homepage
- [ ] Categories display correctly
- [ ] Cities display correctly
- [ ] Featured ads display (if any)
- [ ] Recent ads display
- [ ] All links work correctly
- [ ] Search bar functionality
- [ ] Mobile responsive design

#### Search & Filtering
- [ ] Search by keyword works
- [ ] Filter by category works
- [ ] Filter by city works
- [ ] Price range filter works
- [ ] Sort options work (newest, oldest, price)
- [ ] Pagination works
- [ ] Empty state displays when no results

#### Advertisement Pages
- [ ] Ad detail page displays all information
- [ ] Image gallery works (lightbox, navigation)
- [ ] Contact section displays correctly
- [ ] WhatsApp button works
- [ ] Copy to clipboard works
- [ ] View count increments
- [ ] Breadcrumb navigation works

#### Post Advertisement
- [ ] Multi-step form navigation works
- [ ] Form validation on each step
- [ ] Image upload works (drag & drop, file picker)
- [ ] Image preview works
- [ ] Remove image works
- [ ] Form submission creates ad
- [ ] Success redirect to dashboard

#### Edit Advertisement
- [ ] Form pre-populates with existing data
- [ ] Existing images display
- [ ] Can remove existing images
- [ ] Can add new images
- [ ] Form submission updates ad
- [ ] Success redirect to dashboard

#### Dashboard
- [ ] Statistics display correctly
- [ ] User's ads list displays
- [ ] Status badges show correct colors
- [ ] View ad link works
- [ ] Edit ad link works
- [ ] Delete ad works (with confirmation)
- [ ] Promote ad opens WhatsApp
- [ ] Empty state displays when no ads

#### Static Pages
- [ ] About page displays correctly
- [ ] Terms page displays correctly
- [ ] Privacy page displays correctly
- [ ] Help page FAQ accordion works
- [ ] Contact form submission works
- [ ] All internal links work

#### Mobile Responsiveness
- [ ] Header mobile menu works
- [ ] All pages are mobile-friendly
- [ ] Forms are usable on mobile
- [ ] Images display correctly on mobile
- [ ] Touch interactions work

### Performance Testing

#### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] Images lazy load correctly
- [ ] Code splitting works (check Network tab)

#### Lighthouse Scores
- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90

#### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Security Testing

- [ ] XSS protection (test with script tags in forms)
- [ ] CSRF protection (Strapi handles this)
- [ ] Authentication tokens stored securely
- [ ] API endpoints require authentication where needed
- [ ] User can only edit/delete own ads
- [ ] Input validation on all forms

### Error Handling

- [ ] 404 page for invalid routes
- [ ] Error messages display for API failures
- [ ] Network errors handled gracefully
- [ ] Form validation errors display correctly
- [ ] Image load errors handled (placeholder shown)

## Post-Deployment Testing

- [ ] Production build works correctly
- [ ] Environment variables configured
- [ ] Database connection works
- [ ] File uploads work in production
- [ ] Email notifications work (if configured)
- [ ] SSL certificate valid
- [ ] CDN configured (if using)
- [ ] Analytics tracking works (if configured)

## Manual Test Scenarios

### Scenario 1: New User Journey
1. Visit homepage
2. Browse categories
3. Search for items
4. View ad detail
5. Register account
6. Post first ad
7. Edit ad
8. View dashboard

### Scenario 2: Returning User Journey
1. Login
2. View dashboard
3. Edit existing ad
4. Post new ad
5. Delete old ad
6. Update profile

### Scenario 3: Buyer Journey
1. Search for specific item
2. Filter by location and price
3. View multiple ads
4. Contact seller via WhatsApp
5. Save search (if implemented)

## Known Issues / Notes

- Document any known issues or limitations here
- Note any browser-specific quirks
- Document workarounds if any

