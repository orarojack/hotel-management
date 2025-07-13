# Quick Deployment Checklist

## Before Upload
- [ ] Run `pnpm build` locally
- [ ] Create `.env.production` file with production values
- [ ] Test build locally with `pnpm start`
- [ ] Create ZIP file excluding node_modules and .next

## cPanel Setup
- [ ] Access Node.js App Manager in cPanel
- [ ] Create new Node.js application
- [ ] Set Node.js version to 18.x or higher
- [ ] Configure application root and URL
- [ ] Set startup file to `server.js`

## Database Setup
- [ ] Create MySQL database in cPanel
- [ ] Create database user
- [ ] Grant privileges to user
- [ ] Update `.env.production` with database credentials

## File Upload
- [ ] Upload project files to application root
- [ ] Extract files if uploaded as ZIP
- [ ] Set correct file permissions (755 for dirs, 644 for files)

## Installation
- [ ] Run `npm install --production` in cPanel terminal
- [ ] Run `npm run build` in cPanel terminal
- [ ] Set environment variables in Node.js App Manager
- [ ] Start the application

## Post-Deployment
- [ ] Test main application functionality
- [ ] Test admin panel login
- [ ] Verify database connections
- [ ] Test image uploads
- [ ] Configure SSL certificate
- [ ] Set up domain redirects

## Monitoring
- [ ] Check application logs
- [ ] Monitor resource usage
- [ ] Set up auto-restart
- [ ] Configure backups

## Common Issues to Check
- [ ] Port 3000 available
- [ ] Database credentials correct
- [ ] Environment variables set
- [ ] File permissions correct
- [ ] Node.js version compatible 

## 📝 Steps to Create Your `.env.production`:

1. **Rename the file:**
   ```bash
   mv env.production.template .env.production
   ```

2. **Generate a secure JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Update the values in `.env.production`:**

### 🔑 Key Variables to Replace:

**Database Configuration:**
- `DB_HOST` - Usually `localhost` for cPanel
- `DB_USER` - Your cPanel MySQL username
- `DB_PASSWORD` - Your cPanel MySQL password  
- `DB_NAME` - Your cPanel MySQL database name

**Security Keys:**
- `JWT_SECRET` - Use the generated secret from step 2
- `NEXTAUTH_SECRET` - Generate another random string
- `UPLOAD_SECRET` - Generate another random string

**Domain Configuration:**
- `NEXTAUTH_URL` - Your actual domain (e.g., `https://munchhaven.com`)
- `NEXT_PUBLIC_APP_URL` - Your actual domain
- `yourdomain.com` - Replace with your actual domain

## 📋 Example of Completed Values:

```env
DB_HOST=localhost
DB_USER=munchhaven_user
DB_PASSWORD=StrongPassword123!
DB_NAME=munchhaven_db
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NEXTAUTH_URL=https://munchhaven.com
NEXT_PUBLIC_APP_URL=https://munchhaven.com
```

Once you've updated the `.env.production` file with your actual values, you can proceed with the cPanel deployment using the guide I created earlier! 