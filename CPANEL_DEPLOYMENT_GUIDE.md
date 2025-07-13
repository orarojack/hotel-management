# cPanel Deployment Guide for MunchHaven Next.js App

## Prerequisites
- cPanel hosting with Node.js support
- MySQL database access
- Domain name configured

## Step 1: Prepare Your Application Locally

### 1.1 Build the Application
```bash
pnpm build
```

### 1.2 Create Production Environment File
Create a `.env.production` file in your project root:
```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Next.js Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# Upload Configuration
UPLOAD_SECRET=your_upload_secret_here
```

### 1.3 Create package-lock.json (if using npm)
```bash
npm install
```

## Step 2: Prepare Files for Upload

### 2.1 Create Upload Package
Create a ZIP file containing:
- All source files (app/, components/, lib/, etc.)
- package.json
- package-lock.json (or pnpm-lock.yaml)
- next.config.mjs
- tailwind.config.ts
- tsconfig.json
- .env.production
- public/ folder
- styles/ folder

### 2.2 Files to Exclude from Upload
- node_modules/ (will be installed on server)
- .next/ (will be built on server)
- .git/ folder
- .env.local (development only)

## Step 3: cPanel Setup

### 3.1 Access Node.js App Manager
1. Log into your cPanel
2. Find "Node.js App Manager" or "Node.js" section
3. Click "Create Application"

### 3.2 Configure Node.js App
Fill in the following details:
- **Node.js version**: 18.x or higher
- **Application mode**: Production
- **Application root**: /home/username/your-app-name
- **Application URL**: yourdomain.com
- **Application startup file**: server.js (we'll create this)
- **Node.js package manager**: npm (or pnpm if supported)

### 3.3 Create server.js File
Create a `server.js` file in your project root:
```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
```

## Step 4: Database Setup

### 4.1 Create MySQL Database
1. In cPanel, go to "MySQL Databases"
2. Create a new database
3. Create a database user
4. Add user to database with all privileges
5. Note down the database credentials

### 4.2 Update Environment Variables
Update your `.env.production` with the actual database credentials from cPanel.

## Step 5: Upload and Deploy

### 5.1 Upload Files
1. Use cPanel File Manager or FTP
2. Upload your project files to the application root directory
3. Extract the ZIP file if you uploaded a compressed file

### 5.2 Install Dependencies
1. In cPanel Terminal or SSH:
```bash
cd /home/username/your-app-name
npm install --production
```

### 5.3 Build Application
```bash
npm run build
```

### 5.4 Set Environment Variables
1. In Node.js App Manager, add environment variables:
   - Copy all variables from your `.env.production` file
   - Set NODE_ENV=production

## Step 6: Configure Domain and SSL

### 6.1 Domain Configuration
1. In cPanel, go to "Domains"
2. Add your domain or subdomain
3. Point it to your Node.js app directory

### 6.2 SSL Certificate
1. In cPanel, go to "SSL/TLS"
2. Install SSL certificate for your domain
3. Force HTTPS redirect

## Step 7: Start the Application

### 7.1 Start Node.js App
1. In Node.js App Manager, click "Start Application"
2. Check the logs for any errors
3. Test your application at yourdomain.com

### 7.2 Configure Auto-restart
1. In Node.js App Manager, enable "Auto-restart"
2. Set restart conditions (memory usage, crashes, etc.)

## Step 8: Post-Deployment

### 8.1 Test Your Application
- Test all major features
- Check admin panel functionality
- Verify database connections
- Test image uploads

### 8.2 Monitor Performance
- Check cPanel resource usage
- Monitor application logs
- Set up error notifications

### 8.3 Backup Strategy
- Set up automatic database backups
- Backup application files regularly
- Keep local development copy updated

## Troubleshooting

### Common Issues:
1. **Port conflicts**: Ensure port 3000 is available
2. **Database connection**: Verify database credentials
3. **File permissions**: Set correct permissions (755 for directories, 644 for files)
4. **Memory limits**: Increase Node.js memory if needed
5. **Build errors**: Check for missing dependencies

### Useful Commands:
```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart your-app-name

# Check Node.js version
node --version

# Check npm version
npm --version
```

## Security Considerations

1. **Environment Variables**: Never commit .env files to version control
2. **Database Security**: Use strong passwords and limit database access
3. **SSL**: Always use HTTPS in production
4. **Dependencies**: Regularly update dependencies for security patches
5. **Backups**: Maintain regular backups of your application and database

## Performance Optimization

1. **Image Optimization**: Use Next.js Image component
2. **Caching**: Implement proper caching strategies
3. **Database Indexing**: Optimize database queries
4. **CDN**: Use CDN for static assets
5. **Compression**: Enable gzip compression

## Support

If you encounter issues:
1. Check cPanel error logs
2. Review Node.js application logs
3. Contact your hosting provider's support
4. Check Next.js documentation for specific issues 