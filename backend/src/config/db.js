const mongoose = require('mongoose');

// Global connection cache for serverless
let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    console.log('🔄 Creating new MongoDB connection...');
    
    // Optimized options for Vercel serverless
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
      maxPoolSize: 1, // Limit to 1 connection for serverless
      minPoolSize: 0,
    };

    // Connect to MongoDB
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`✅ MongoDB Connected: ${cachedConnection.connection.host}`);
    
    return cachedConnection;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    cachedConnection = null;
    throw error;
  }
};

module.exports = connectDB;