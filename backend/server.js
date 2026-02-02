const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Initialize app first
const app = require('./src/app');

// For serverless environments, don't initialize DB here
// Let each request handle its own connection
if (process.env.NODE_ENV !== 'production') {
  // Only connect in development
  connectDB().catch(console.error);
}

const PORT = process.env.PORT || 5001;

// For Vercel deployment
if (process.env.NODE_ENV === 'production') {
  console.log('🚀 Starting CampusConnect Pro Backend in production mode');
  console.log('📊 Environment variables check:');
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
}

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 CampusConnect Pro Backend running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
  });
}

// Export for Vercel
module.exports = app;