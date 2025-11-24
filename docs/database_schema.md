# Database Schema & Entity Relationship Model

## Database Overview

- **Database Type**: PostgreSQL (Production) / SQLite (Development)
- **ORM**: Strapi's built-in ORM
- **Naming Convention**: snake_case for tables, camelCase for fields

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────┐
│        USERS            │
│─────────────────────────│
│ id (PK)                 │
│ username                │
│ email                   │
│ password                │
│ confirmed               │
│ blocked                 │
│ role_id (FK)            │
│ created_at              │
│ updated_at              │
└────────────┬────────────┘
             │
             │ 1:1
             │
┌────────────▼────────────┐
│    USER_PROFILES        │
│─────────────────────────│
│ id (PK)                 │
│ user_id (FK)            │
│ phone                   │
│ avatar_id (FK)          │
│ bio                     │
│ city_id (FK)            │
│ is_verified             │
│ whatsapp_number         │
│ date_of_birth           │
│ age_verified            │
│ created_at              │
│ updated_at              │
└────────────┬────────────┘
             │
             │ 1:N
             │
┌────────────▼────────────────────────┐
│        ADVERTISEMENTS               │
│─────────────────────────────────────│
│ id (PK)                             │
│ title                               │
│ description                         │
│ price                               │
│ category_id (FK)                    │
│ city_id (FK)                        │
│ owner_id (FK) → users               │
│ status (enum)                       │
│ is_premium                          │
│ contact_phone                       │
│ contact_email                       │
│ view_count                          │
│ expires_at                          │
│ created_at                          │
│ updated_at                          │
│ published_at                        │
└──────┬──────────────┬───────────────┘
       │              │
       │ N:N          │ N:1
       │              │
┌──────▼──────┐  ┌───▼────────────┐
│   IMAGES    │  │   CATEGORIES   │
│─────────────│  │────────────────│
│ id (PK)     │  │ id (PK)        │
│ name        │  │ name           │
│ url         │  │ slug           │
│ mime        │  │ description    │
│ size        │  │ icon           │
│ created_at  │  │ parent_id (FK) │
│ updated_at  │  │ is_active      │
└─────────────┘  │ sort_order     │
                 │ created_at     │
                 │ updated_at     │
                 └────────────────┘

┌──────────────────────────┐
│         CITIES           │
│──────────────────────────│
│ id (PK)                  │
│ name                     │
│ slug                     │
│ state                    │
│ country                  │
│ latitude                 │
│ longitude                │
│ is_active                │
│ created_at               │
│ updated_at               │
└────────────┬─────────────┘
             │
             │ 1:N
             │
┌────────────▼─────────────────────┐
│        SAVED_SEARCHES            │
│──────────────────────────────────│
│ id (PK)                          │
│ user_id (FK)                     │
│ name                             │
│ search_query (JSON)              │
│ notifications_enabled            │
│ created_at                       │
│ updated_at                       │
└──────────────────────────────────┘

┌────────────────────────────────┐
│          REPORTS               │
│────────────────────────────────│
│ id (PK)                        │
│ advertisement_id (FK)          │
│ reporter_id (FK) → users       │
│ reason (enum)                  │
│ description                    │
│ status (enum)                  │
│ reviewed_by_id (FK) → users    │
│ review_notes                   │
│ created_at                     │
│ updated_at                     │
└────────────────────────────────┘

┌────────────────────────────────┐
│       CONTACT_FORMS            │
│────────────────────────────────│
│ id (PK)                        │
│ name                           │
│ email                          │
│ subject                        │
│ message                        │
│ status (enum)                  │
│ user_id (FK) [nullable]        │
│ created_at                     │
│ updated_at                     │
└────────────────────────────────┘

┌────────────────────────────────┐
│           ROLES                │
│────────────────────────────────│
│ id (PK)                        │
│ name                           │
│ description                    │
│ type                           │
│ created_at                     │
│ updated_at                     │
└────────────────────────────────┘
```

---

## Detailed Table Schemas

### 1. **users** (Strapi Core)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    provider VARCHAR(255) DEFAULT 'local',
    confirmed BOOLEAN DEFAULT false,
    blocked BOOLEAN DEFAULT false,
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### 2. **user_profiles** (Custom Extension)
```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    avatar_id INTEGER REFERENCES files(id),
    bio TEXT,
    city_id INTEGER REFERENCES cities(id),
    is_verified BOOLEAN DEFAULT false,
    verification_document_id INTEGER REFERENCES files(id),
    whatsapp_number VARCHAR(20),
    date_of_birth DATE,
    age_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_city ON user_profiles(city_id);
```

### 3. **advertisements**
```sql
CREATE TABLE advertisements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2),
    category_id INTEGER REFERENCES categories(id),
    city_id INTEGER REFERENCES cities(id),
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
        -- ENUM: 'draft', 'pending', 'approved', 'rejected', 'expired'
    is_premium BOOLEAN DEFAULT false,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    view_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    
    CONSTRAINT chk_status CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'expired'))
);

CREATE INDEX idx_ads_category ON advertisements(category_id);
CREATE INDEX idx_ads_city ON advertisements(city_id);
CREATE INDEX idx_ads_status ON advertisements(status);
CREATE INDEX idx_ads_owner ON advertisements(owner_id);
CREATE INDEX idx_ads_created ON advertisements(created_at DESC);
CREATE INDEX idx_ads_published ON advertisements(published_at DESC);
CREATE INDEX idx_ads_price ON advertisements(price);
CREATE INDEX idx_ads_premium ON advertisements(is_premium);
```

### 4. **categories**
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort ON categories(sort_order);
```

### 5. **cities**
```sql
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_cities_state ON cities(state);
CREATE INDEX idx_cities_active ON cities(is_active);
CREATE INDEX idx_cities_location ON cities(latitude, longitude);
```

### 6. **files** (Strapi Upload Plugin)
```sql
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    alternative_text VARCHAR(255),
    caption VARCHAR(255),
    width INTEGER,
    height INTEGER,
    formats JSONB,
    hash VARCHAR(255) NOT NULL,
    ext VARCHAR(10),
    mime VARCHAR(255) NOT NULL,
    size DECIMAL(10, 2) NOT NULL,
    url VARCHAR(500) NOT NULL,
    preview_url VARCHAR(500),
    provider VARCHAR(255) DEFAULT 'local',
    provider_metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_hash ON files(hash);
```

### 7. **advertisements_images** (Join Table)
```sql
CREATE TABLE advertisements_images_links (
    id SERIAL PRIMARY KEY,
    advertisement_id INTEGER REFERENCES advertisements(id) ON DELETE CASCADE,
    file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
    file_order INTEGER DEFAULT 0,
    
    UNIQUE(advertisement_id, file_id)
);

CREATE INDEX idx_ad_images_ad ON advertisements_images_links(advertisement_id);
CREATE INDEX idx_ad_images_file ON advertisements_images_links(file_id);
```

### 8. **reports**
```sql
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    advertisement_id INTEGER REFERENCES advertisements(id) ON DELETE CASCADE,
    reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(50) NOT NULL,
        -- ENUM: 'spam', 'inappropriate', 'fraud', 'duplicate', 'other'
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
        -- ENUM: 'pending', 'reviewed', 'resolved', 'dismissed'
    reviewed_by_id INTEGER REFERENCES users(id),
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_report_reason CHECK (reason IN ('spam', 'inappropriate', 'fraud', 'duplicate', 'other')),
    CONSTRAINT chk_report_status CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed'))
);

CREATE INDEX idx_reports_ad ON reports(advertisement_id);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created ON reports(created_at DESC);
```

### 9. **saved_searches**
```sql
CREATE TABLE saved_searches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    search_query JSONB NOT NULL,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX idx_saved_searches_notifications ON saved_searches(notifications_enabled);
```

### 10. **contact_forms**
```sql
CREATE TABLE contact_forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
        -- ENUM: 'new', 'read', 'replied', 'closed'
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_contact_status CHECK (status IN ('new', 'read', 'replied', 'closed'))
);

CREATE INDEX idx_contact_status ON contact_forms(status);
CREATE INDEX idx_contact_user ON contact_forms(user_id);
CREATE INDEX idx_contact_created ON contact_forms(created_at DESC);
```

### 11. **roles** (Strapi Core)
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    type VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description, type) VALUES
    ('Public', 'Default role for unauthenticated users', 'public'),
    ('Authenticated', 'Default role for authenticated users', 'authenticated'),
    ('Verified', 'Verified users with additional privileges', 'verified'),
    ('Moderator', 'Content moderation privileges', 'moderator'),
    ('Admin', 'Super Administrator', 'admin');
```

---

## Relationships Summary

### One-to-One (1:1)
- **users** ↔ **user_profiles**

### One-to-Many (1:N)
- **users** → **advertisements** (owner)
- **categories** → **advertisements**
- **cities** → **advertisements**
- **cities** → **user_profiles**
- **users** → **saved_searches**
- **users** → **reports** (reporter)
- **advertisements** → **reports**
- **categories** → **categories** (parent-child, self-referencing)

### Many-to-Many (N:N)
- **advertisements** ↔ **files** (images)

---

## Data Constraints & Business Rules

### Advertisements
1. Title: 5-200 characters
2. Description: 20-5000 characters
3. Max images per ad: 10
4. Image size limit: 5MB each
5. Price: 0 or greater
6. Auto-expire after 30/60/90 days (configurable)
7. Status workflow: draft → pending → approved/rejected
8. Only owner or admin can edit/delete

### Users
1. Username: 3-30 characters, alphanumeric + underscore
2. Email: Valid email format, unique
3. Password: Min 8 characters, 1 uppercase, 1 lowercase, 1 number
4. Phone: Optional, valid format
5. Age verification required for certain categories

### Categories
1. Name: Unique, 2-100 characters
2. Slug: Auto-generated from name
3. Max depth: 3 levels (parent → child → grandchild)
4. Cannot delete category with active ads

### Cities
1. Name + State combination must be unique
2. Coordinates optional but recommended
3. Cannot delete city with active ads

---

## Indexes Strategy

### Performance Indexes
- Composite indexes for common queries
- Foreign key indexes for joins
- Full-text search indexes on title/description
- Timestamp indexes for sorting

### Example Composite Index
```sql
CREATE INDEX idx_ads_search 
ON advertisements(status, city_id, category_id, created_at DESC);
```

---

## Data Seeding (Initial Data)

### Required Seeds
1. **Roles**: Public, Authenticated, Verified, Moderator, Admin
2. **Categories**: 10-15 main categories
3. **Cities**: Major cities (50-100 cities)
4. **Admin User**: Default admin account

### Sample Seed Script
```sql
-- Categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
    ('General Services', 'general-services', 'briefcase', 1),
    ('Professional Services', 'professional-services', 'user-tie', 2),
    ('Personal Services', 'personal-services', 'user', 3),
    ('Entertainment', 'entertainment', 'music', 4),
    ('Health & Wellness', 'health-wellness', 'heart', 5);

-- Cities
INSERT INTO cities (name, slug, state, country) VALUES
    ('Mumbai', 'mumbai', 'Maharashtra', 'India'),
    ('Delhi', 'delhi', 'Delhi', 'India'),
    ('Bangalore', 'bangalore', 'Karnataka', 'India'),
    ('Hyderabad', 'hyderabad', 'Telangana', 'India'),
    ('Chennai', 'chennai', 'Tamil Nadu', 'India');
```

---

## Backup & Maintenance

### Backup Strategy
- **Daily**: Automated full backup
- **Weekly**: Archive old backups
- **Monthly**: Long-term storage

### Maintenance Tasks
- Purge expired ads (older than 90 days)
- Archive old reports (older than 1 year)
- Optimize indexes monthly
- Vacuum database weekly

### Cleanup Query Example
```sql
-- Delete expired ads
DELETE FROM advertisements 
WHERE expires_at < NOW() - INTERVAL '90 days'
AND status = 'expired';
```

---

## Scaling Considerations

### Read Replicas
- Separate read/write operations
- Use replicas for search queries

### Partitioning
- Partition advertisements by date
- Archive old data to cold storage

### Caching
- Redis for frequently accessed data
- Cache categories and cities
- Cache popular search results
