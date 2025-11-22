# Database Seeding Guide

## Automatic Seeding

The database is automatically seeded when Strapi starts via the bootstrap function in `src/index.ts`. 

**The seed script will:**
- ✅ Check if data already exists (won't duplicate)
- ✅ Create 10 categories (General Services, Professional Services, etc.)
- ✅ Create 25 major Indian cities (Mumbai, Delhi, Bangalore, etc.)
- ✅ Create a test user (testuser@example.com / Test@123456)
- ✅ Create 10 sample advertisements across different categories and cities

## What Gets Seeded

### Categories (10)
1. General Services
2. Professional Services
3. Personal Services
4. Entertainment
5. Health & Wellness
6. Education
7. Home Services
8. Automotive
9. Beauty & Spa
10. Photography

### Cities (25 Major Indian Cities)
- Mumbai, Delhi, Bangalore, Hyderabad, Chennai
- Kolkata, Pune, Ahmedabad, Jaipur, Surat
- Lucknow, Kanpur, Nagpur, Indore, Thane
- Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad
- Ludhiana, Agra, Nashik, Faridabad, Meerut

Each city includes:
- Name, State, Country
- Latitude and Longitude coordinates
- Active status

### Test User
- **Email**: testuser@example.com
- **Password**: Test@123456
- **Username**: testuser
- **Role**: Authenticated
- **Status**: Confirmed and Active

### Sample Advertisements (10)
1. Professional Photography Services (Mumbai, Photography, Premium)
2. Home Cleaning Services (Delhi, Home Services)
3. Yoga and Meditation Classes (Bangalore, Health & Wellness)
4. Car Repair and Maintenance (Hyderabad, Automotive, Premium)
5. Beauty Salon Services (Chennai, Beauty & Spa)
6. Math and Science Tutoring (Pune, Education)
7. Event Planning Services (Kolkata, Entertainment, Premium)
8. Legal Consultation Services (Ahmedabad, Professional Services)
9. Personal Fitness Trainer (Jaipur, Health & Wellness)
10. Plumbing and Electrical Services (Surat, Home Services)

Each advertisement includes:
- Title, Description, Price
- Category and City assignment
- Contact information (phone, email, WhatsApp)
- Status: Approved (ready to display)
- Expiration date: 90 days from creation
- Random view counts for demo purposes

## How to Seed

### Option 1: Automatic (Recommended)
Just start Strapi normally:
```bash
npm run develop
```

The seed script runs automatically on startup and will:
- Skip if data already exists
- Create categories and cities if they don't exist

### Option 2: Manual Seed (If needed)
If you want to force re-seed or seed manually:

1. **Clear existing data** (optional):
   - Go to Strapi Admin Panel
   - Delete existing categories and cities manually
   - Or use Strapi console

2. **Restart Strapi**:
   ```bash
   npm run develop
   ```

## Verifying Seeded Data

### Via API
```bash
# Check categories
curl http://localhost:1337/api/categories

# Check cities
curl http://localhost:1337/api/cities

# Check advertisements
curl http://localhost:1337/api/advertisements

# Check test user (requires auth)
curl http://localhost:1337/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Via Strapi Admin
1. Go to `http://localhost:1337/admin`
2. Navigate to Content Manager
3. Check:
   - **Category** collection (should have 10 entries)
   - **City** collection (should have 25 entries)
   - **Advertisement** collection (should have 10 entries)
4. Navigate to Users & Permissions → Users
   - Check for test user (testuser@example.com)

## Customizing Seed Data

To modify the seed data, edit:
- `backend/src/scripts/seed.ts`

The seed function checks if data exists before creating, so you can:
- Add more categories
- Add more cities
- Modify existing entries

## Resetting Seed Data

To reset and re-seed:

1. **Delete via Admin Panel:**
   - Go to Content Manager
   - Select all categories → Delete
   - Select all cities → Delete

2. **Or clear database:**
   ```bash
   # For SQLite (development)
   rm backend/.tmp/data.db
   
   # For PostgreSQL (production)
   # Drop and recreate database
   ```

3. **Restart Strapi:**
   ```bash
   npm run develop
   ```

## Troubleshooting

### Seed not running?
- Check Strapi logs for seed messages
- Look for: `🌱 Starting database seeding...`
- Check for errors in the console

### Duplicate entries?
- The seed script checks for existing data
- If you see duplicates, they were created manually
- Delete duplicates via Admin Panel

### Want to add more data?
- Edit `backend/src/scripts/seed.ts`
- Add entries to `categories` or `cities` arrays
- Restart Strapi

## Notes

- Seed data is published automatically (publishedAt is set)
- All categories and cities are set to `isActive: true`
- Cities include coordinates for future map features
- Advertisements are set to `approved` status and will be visible on the frontend
- Test user password is `Test@123456` - **change this in production!**
- Advertisements expire 90 days after creation
- The seed script is idempotent (safe to run multiple times)
- Advertisements are linked to categories and cities automatically

