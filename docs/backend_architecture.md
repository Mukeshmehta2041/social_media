# Backend Architecture Document - Strapi CMS

## Technology Stack

### Core
- **Strapi** v4.x (Headless CMS)
- **Node.js** 18.x LTS
- **PostgreSQL** (Production Database)
- **SQLite** (Development Database - Optional)

### Additional Packages
- **@strapi/plugin-users-permissions** (Authentication)
- **@strapi/plugin-email** (Email Service)
- **@strapi/plugin-upload** (File Management)
- **strapi-plugin-seo** (SEO Management)
- **pg** (PostgreSQL Driver)

---

## Project Structure

```
backend/
├── config/
│   ├── database.js
│   ├── server.js
│   ├── admin.js
│   ├── api.js
│   ├── middlewares.js
│   └── plugins.js
├── src/
│   ├── api/
│   │   ├── advertisement/
│   │   │   ├── content-types/
│   │   │   │   └── advertisement/
│   │   │   │       └── schema.json
│   │   │   ├── controllers/
│   │   │   │   └── advertisement.js
│   │   │   ├── routes/
│   │   │   │   └── advertisement.js
│   │   │   ├── services/
│   │   │   │   └── advertisement.js
│   │   │   └── policies/
│   │   ├── category/
│   │   │   ├── content-types/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── city/
│   │   │   ├── content-types/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── user-profile/
│   │   │   ├── content-types/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── contact-form/
│   │   │   ├── content-types/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── report/
│   │   │   ├── content-types/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   └── saved-search/
│   │       ├── content-types/
│   │       ├── controllers/
│   │       ├── routes/
│   │       └── services/
│   ├── extensions/
│   │   └── users-permissions/
│   │       ├── content-types/
│   │       │   └── user/
│   │       │       └── schema.json
│   │       └── controllers/
│   ├── middlewares/
│   │   ├── rateLimit.js
│   │   ├── sanitize.js
│   │   └── ageVerification.js
│   ├── policies/
│   │   ├── isOwner.js
│   │   ├── isVerified.js
│   │   └── canModerate.js
│   └── index.js
├── public/
│   └── uploads/
├── database/
│   └── migrations/
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## Content Types (Collections)

### 1. Advertisement
```json
{
  "kind": "collectionType",
  "collectionName": "advertisements",
  "info": {
    "singularName": "advertisement",
    "pluralName": "advertisements",
    "displayName": "Advertisement"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "description": {
      "type": "text",
      "required": true
    },
    "price": {
      "type": "decimal"
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category"
    },
    "city": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::city.city"
    },
    "images": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images"]
    },
    "status": {
      "type": "enumeration",
      "enum": ["draft", "pending", "approved", "rejected", "expired"],
      "default": "pending"
    },
    "isPremium": {
      "type": "boolean",
      "default": false
    },
    "owner": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "contactPhone": {
      "type": "string"
    },
    "contactEmail": {
      "type": "email"
    },
    "viewCount": {
      "type": "integer",
      "default": 0
    },
    "expiresAt": {
      "type": "datetime"
    }
  }
}
```

### 2. Category
```json
{
  "kind": "collectionType",
  "collectionName": "categories",
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name"
    },
    "description": {
      "type": "text"
    },
    "icon": {
      "type": "string"
    },
    "parent": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category"
    },
    "advertisements": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::advertisement.advertisement"
    },
    "isActive": {
      "type": "boolean",
      "default": true
    },
    "sortOrder": {
      "type": "integer",
      "default": 0
    }
  }
}
```

### 3. City
```json
{
  "kind": "collectionType",
  "collectionName": "cities",
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name"
    },
    "state": {
      "type": "string"
    },
    "country": {
      "type": "string",
      "default": "India"
    },
    "latitude": {
      "type": "decimal"
    },
    "longitude": {
      "type": "decimal"
    },
    "isActive": {
      "type": "boolean",
      "default": true
    },
    "advertisements": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::advertisement.advertisement"
    }
  }
}
```

### 4. User Profile (Extension)
```json
{
  "kind": "collectionType",
  "attributes": {
    "phone": {
      "type": "string"
    },
    "avatar": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "bio": {
      "type": "text"
    },
    "city": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::city.city"
    },
    "isVerified": {
      "type": "boolean",
      "default": false
    },
    "verificationDocument": {
      "type": "media",
      "multiple": false
    },
    "whatsappNumber": {
      "type": "string"
    },
    "dateOfBirth": {
      "type": "date"
    },
    "ageVerified": {
      "type": "boolean",
      "default": false
    }
  }
}
```

### 5. Report
```json
{
  "kind": "collectionType",
  "collectionName": "reports",
  "attributes": {
    "advertisement": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::advertisement.advertisement"
    },
    "reporter": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "reason": {
      "type": "enumeration",
      "enum": ["spam", "inappropriate", "fraud", "duplicate", "other"],
      "required": true
    },
    "description": {
      "type": "text"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "reviewed", "resolved", "dismissed"],
      "default": "pending"
    },
    "reviewedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "reviewNotes": {
      "type": "text"
    }
  }
}
```

### 6. Saved Search
```json
{
  "kind": "collectionType",
  "collectionName": "saved_searches",
  "attributes": {
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "name": {
      "type": "string",
      "required": true
    },
    "searchQuery": {
      "type": "json"
    },
    "notificationsEnabled": {
      "type": "boolean",
      "default": true
    }
  }
}
```

### 7. Contact Form
```json
{
  "kind": "collectionType",
  "collectionName": "contact_forms",
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "email": {
      "type": "email",
      "required": true
    },
    "subject": {
      "type": "string",
      "required": true
    },
    "message": {
      "type": "text",
      "required": true
    },
    "status": {
      "type": "enumeration",
      "enum": ["new", "read", "replied", "closed"],
      "default": "new"
    },
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
}
```

---

## Custom Controllers & Services

### Advertisement Controller Extensions
```javascript
// src/api/advertisement/controllers/advertisement.js
module.exports = {
  // Custom find with advanced filters
  async find(ctx) {
    const { category, city, minPrice, maxPrice, search } = ctx.query;
    // Custom filter logic
  },
  
  // Increment view count
  async incrementView(ctx) {
    const { id } = ctx.params;
    // Increment logic
  },
  
  // Promote ad (WhatsApp redirect)
  async requestPromotion(ctx) {
    const { id } = ctx.params;
    // Generate WhatsApp redirect with ad details
  }
};
```

---

## Authentication & Permissions

### User Roles
1. **Public** - View ads, search
2. **Authenticated** - Post ads, save searches
3. **Verified** - Access premium features
4. **Moderator** - Approve/reject ads
5. **Admin** - Full access

### JWT Configuration
```javascript
// config/plugins.js
module.exports = {
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d'
      }
    }
  }
};
```

---

## API Endpoints

### Public Endpoints
- `GET /api/advertisements` - List ads (with filters)
- `GET /api/advertisements/:id` - Get single ad
- `GET /api/categories` - List categories
- `GET /api/cities` - List cities
- `POST /api/contact-forms` - Submit contact form

### Authenticated Endpoints
- `POST /api/advertisements` - Create ad
- `PUT /api/advertisements/:id` - Update ad
- `DELETE /api/advertisements/:id` - Delete ad
- `POST /api/saved-searches` - Save search
- `POST /api/reports` - Report ad

### Admin Endpoints
- `PUT /api/advertisements/:id/approve` - Approve ad
- `PUT /api/advertisements/:id/reject` - Reject ad
- `GET /api/reports` - View reports
- `PUT /api/users/:id/verify` - Verify user

---

## Middleware & Policies

### Rate Limiting
```javascript
// src/middlewares/rateLimit.js
module.exports = {
  limits: {
    'POST /api/advertisements': { max: 10, window: 3600000 },
    'POST /api/auth/local': { max: 5, window: 900000 }
  }
};
```

### Custom Policies
```javascript
// src/policies/isOwner.js
module.exports = async (policyContext, config, { strapi }) => {
  const { id } = policyContext.params;
  const userId = policyContext.state.user.id;
  
  const ad = await strapi.entityService.findOne(
    'api::advertisement.advertisement',
    id
  );
  
  return ad.owner.id === userId;
};
```

---

## Email Configuration

```javascript
// config/plugins.js
module.exports = {
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        }
      },
      settings: {
        defaultFrom: 'noreply@yoursite.com',
        defaultReplyTo: 'support@yoursite.com'
      }
    }
  }
};
```

---

## Environment Variables

```env
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=randomsalt
ADMIN_JWT_SECRET=adminsecret
JWT_SECRET=jwtsecret

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_ads
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_SSL=false

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your@email.com
SMTP_PASSWORD=yourpassword

# WhatsApp
WHATSAPP_NUMBER=+1234567890
WHATSAPP_BUSINESS_API_URL=https://api.whatsapp.com

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PROVIDER=local
```

---

## Database Optimization

### Indexes
```sql
CREATE INDEX idx_ads_category ON advertisements(category_id);
CREATE INDEX idx_ads_city ON advertisements(city_id);
CREATE INDEX idx_ads_status ON advertisements(status);
CREATE INDEX idx_ads_owner ON advertisements(owner_id);
CREATE INDEX idx_ads_created ON advertisements(created_at DESC);
```

### Performance Tips
1. Enable database query logging in development
2. Use population wisely (avoid deep nesting)
3. Implement pagination for all list endpoints
4. Cache frequently accessed data (categories, cities)

---

## Security Best Practices

1. **Input Validation** - Sanitize all user inputs
2. **File Upload** - Validate file types and sizes
3. **Rate Limiting** - Prevent abuse
4. **CORS Configuration** - Restrict origins
5. **SQL Injection Prevention** - Use Strapi query builder
6. **XSS Protection** - Sanitize HTML content

---

## Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure PostgreSQL
- [ ] Set up SSL certificates
- [ ] Configure CDN for uploads
- [ ] Enable security headers
- [ ] Set up monitoring (PM2/Docker)
- [ ] Configure backup strategy
- [ ] Set up log rotation

### Recommended Hosting
- **Strapi Cloud** (Managed)
- **AWS EC2/RDS**
- **DigitalOcean Droplet**
- **Heroku** (with PostgreSQL addon)
- **Railway/Render**
