const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = require('./src/app');

const PORT = process.env.PORT || 5001;

// For Vercel deployment
if (process.env.NODE_ENV === 'production') {
  console.log('Starting CampusConnect Pro Backend in production mode');
}

app.listen(PORT, () => {
  console.log(`🚀 CampusConnect Pro Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
});

// Export for Vercel
module.exports = app;