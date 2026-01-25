# PlaceWise Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Vercel Account**: Sign up at [Vercel](https://vercel.com)
3. **Node.js**: Version 16 or higher
4. **Git**: For version control

## Project Structure

```
Smart_placement_portal/
├── backend/                 # Backend API (Node.js/Express)
│   ├── src/
│   ├── scripts/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── vercel.json
├── frontend/                # Frontend React App
│   ├── src/
│   ├── .env
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json
├── README.md
└── DEPLOYMENT.md
```

## Environment Variables

### Backend (.env in backend directory)

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placewise?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server
PORT=5001
NODE_ENV=production

# Client URL (for CORS)
CLIENT_URL=https://your-frontend-domain.vercel.app

# Email Configuration (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend (.env in frontend directory)

```env
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

## Step-by-Step Deployment

### 1. MongoDB Atlas Setup

1. Create a new cluster in MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
4. Get your connection string and update `MONGODB_URI`

### 2. Backend Deployment (Vercel)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `backend`
   - Add environment variables from your `.env` file
   - Deploy

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to your project settings
   - Add all environment variables from your `.env` file
   - Redeploy if necessary

### 3. Frontend Deployment (Vercel)

1. **Create separate Vercel project**:
   - Import the same GitHub repository
   - Set root directory to `frontend`
   - Add `VITE_API_URL` environment variable pointing to your backend URL
   - Deploy

2. **Update Backend CORS**:
   - Update `CLIENT_URL` in backend environment variables
   - Point it to your frontend Vercel URL

### 4. Database Seeding (Optional)

Create test users by running the seeding script:

```bash
cd backend
npm run seed
```

This creates:
- Student: student1@test.com / password123
- Company: company@test.com / company123
- Admin: admin@placewise.com / admin123

## Alternative: CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel --prod

# Deploy frontend
cd frontend
vercel --prod
```

## Testing Your Deployment

### 1. Test API Health
Visit: `https://your-backend-domain.vercel.app/api/health`
Should return: `{"success": true, "message": "PlaceWise API is running"}`

### 2. Test Authentication
1. Go to your frontend URL
2. Register a new account or use test accounts
3. Verify login redirects to appropriate dashboard

### 3. Test Features
- ✅ User registration and login
- ✅ Role-based dashboard access
- ✅ Student profile management
- ✅ Company job posting
- ✅ Admin analytics
- ✅ Job application system

## Production Optimizations

### Backend Optimizations

1. **Add Rate Limiting**:
   ```bash
   npm install express-rate-limit
   ```

2. **Add Helmet for Security**:
   ```bash
   npm install helmet
   ```

3. **Add Compression**:
   ```bash
   npm install compression
   ```

### Frontend Optimizations

1. **Build Optimization**: Already configured in Vite
2. **Code Splitting**: Implemented with React Router
3. **Image Optimization**: Use Vercel's image optimization

## Monitoring and Maintenance

### 1. Error Monitoring

- Set up error tracking with services like Sentry
- Monitor API response times
- Set up uptime monitoring

### 2. Database Monitoring

- Monitor MongoDB Atlas metrics
- Set up alerts for high usage
- Regular backup verification

### 3. Performance Monitoring

- Use Vercel Analytics
- Monitor Core Web Vitals
- Set up performance budgets

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify `CLIENT_URL` in backend environment
   - Check Vercel deployment URLs

2. **Database Connection**:
   - Verify MongoDB connection string
   - Check IP whitelist in Atlas
   - Ensure database user has correct permissions

3. **Environment Variables**:
   - Verify all required variables are set
   - Check for typos in variable names
   - Redeploy after adding new variables

4. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Logs and Debugging

- **Vercel Logs**: Check function logs in Vercel dashboard
- **MongoDB Logs**: Monitor in Atlas dashboard
- **Browser Console**: Check for client-side errors

## Security Checklist

- [ ] JWT secret is strong and secure
- [ ] Database credentials are not exposed
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Environment variables are secure

## Scaling Considerations

### Database Scaling
- Monitor connection limits
- Consider read replicas for heavy read operations
- Implement database indexing for performance

### Application Scaling
- Vercel automatically handles scaling
- Consider serverless functions for heavy operations
- Implement caching strategies

### CDN and Assets
- Use Vercel's CDN for static assets
- Optimize images and media files
- Implement lazy loading

## Backup Strategy

1. **Database Backups**: MongoDB Atlas provides automatic backups
2. **Code Backups**: GitHub repository serves as code backup
3. **Environment Variables**: Keep secure backup of all environment variables

## Development Commands

```bash
# Install dependencies
cd backend && npm install
cd frontend && npm install

# Development
cd backend && npm run dev    # Backend on http://localhost:5001
cd frontend && npm run dev   # Frontend on http://localhost:3001

# Seed database with test data
cd backend && npm run seed

# Build for production
cd frontend && npm run build

# Deploy to Vercel
vercel --prod
```

## Support and Maintenance

- Regular dependency updates
- Security patch monitoring
- Performance optimization reviews
- User feedback integration

---

Your PlaceWise application is now ready for production deployment! 🚀