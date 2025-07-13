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