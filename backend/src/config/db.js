const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Clean, minimal connection options
    await mongoose.connect(process.env.MONGODB_URI);
    
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    isConnected = false;
    throw error;
  }
};

module.exports = connectDB;