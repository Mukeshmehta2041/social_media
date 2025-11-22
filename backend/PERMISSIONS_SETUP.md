# Strapi Permissions Setup Guide

## Why 403 Errors Occur

Strapi uses a role-based permission system. By default, the **Public** role has no permissions to access any content types, which causes 403 (Forbidden) errors when the frontend tries to fetch data.

## Automatic Setup (Recommended)

The permissions are now automatically configured when Strapi starts via the bootstrap function in `src/index.ts`. 

**Just restart your Strapi server** and the permissions will be set up automatically.

## Manual Setup (Alternative)

If you prefer to set up permissions manually through the Strapi admin panel:

### Steps:

1. **Access Strapi Admin Panel**
   - Go to `http://localhost:1337/admin`
   - Log in with your admin account

2. **Navigate to Settings → Users & Permissions Plugin → Roles**

3. **Configure Public Role**
   - Click on **Public** role
   - Under **Permissions**, find each content type and enable:
   
   **Advertisement:**
   - ✅ `find` (GET /api/advertisements)
   - ✅ `findOne` (GET /api/advertisements/:id)
   - ✅ `incrementView` (POST /api/advertisements/:id/increment-view)
   - ✅ `getByCity` (GET /api/advertisements/city/:citySlug)
   - ✅ `getByCategory` (GET /api/advertisements/category/:categorySlug)
   - ✅ `getRelated` (GET /api/advertisements/:id/related)
   
   **Category:**
   - ✅ `find` (GET /api/categories)
   - ✅ `findOne` (GET /api/categories/:id)
   
   **City:**
   - ✅ `find` (GET /api/cities)
   - ✅ `findOne` (GET /api/cities/:id)
   
   **Contact Form:**
   - ✅ `create` (POST /api/contact-forms)

4. **Configure Authenticated Role**
   - Click on **Authenticated** role
   - Enable all the above permissions PLUS:
   
   **Advertisement:**
   - ✅ `create` (POST /api/advertisements)
   - ✅ `update` (PUT /api/advertisements/:id)
   - ✅ `delete` (DELETE /api/advertisements/:id)
   - ✅ `requestPromotion` (GET /api/advertisements/:id/promote)
   
   **Report:**
   - ✅ `create` (POST /api/reports)
   - ✅ `find` (GET /api/reports)
   - ✅ `findOne` (GET /api/reports/:id)
   
   **Saved Search:**
   - ✅ `find` (GET /api/saved-searches)
   - ✅ `findOne` (GET /api/saved-searches/:id)
   - ✅ `create` (POST /api/saved-searches)
   - ✅ `update` (PUT /api/saved-searches/:id)
   - ✅ `delete` (DELETE /api/saved-searches/:id)

5. **Save Changes**
   - Click the **Save** button at the top right

## Verify Permissions

After setting up permissions, test the API endpoints:

```bash
# Test public access to categories
curl http://localhost:1337/api/categories

# Test public access to cities
curl http://localhost:1337/api/cities

# Test public access to advertisements
curl http://localhost:1337/api/advertisements
```

You should now get `200 OK` responses instead of `403 Forbidden`.

## Troubleshooting

### Still Getting 403 Errors?

1. **Check if bootstrap ran successfully**
   - Look for "✅ Public role permissions configured successfully" in Strapi logs
   - If you see errors, check the console output

2. **Verify content types are published**
   - In Strapi admin, make sure your content types have `draftAndPublish: true`
   - Published content is required for public access

3. **Clear cache and restart**
   ```bash
   # Stop Strapi
   # Delete .cache folder in backend
   rm -rf backend/.cache
   # Restart Strapi
   ```

4. **Check CORS settings**
   - Ensure `config/middlewares.ts` allows your frontend origin

### Permission Structure

The permissions are structured as:
```
{
  'api::content-type-name.content-type-name': {
    controllers: {
      'controller-name': {
        'action-name': { enabled: true }
      }
    }
  }
}
```

## Security Notes

- **Public role** should only have read access to public content
- **Authenticated role** can create, update, and delete their own content
- Always review permissions before deploying to production
- Consider adding custom policies for ownership checks (e.g., users can only edit their own ads)

