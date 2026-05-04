import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

let mongoServer;
const DB_PATH = path.join(process.cwd(), '.mongodb-data');

const connectDB = async () => {
  try {
    // Use in-memory database for development
    if (process.env.USE_MEMORY_DB === 'true') {
      // Create persistent storage directory
      if (!fs.existsSync(DB_PATH)) {
        fs.mkdirSync(DB_PATH, { recursive: true });
      }

      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbPath: DB_PATH,
          storageEngine: 'wiredTiger'
        }
      });
      
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB Memory Server connected successfully');
      console.log('📍 Database URI:', mongoUri);
      console.log('💾 Data persisted at:', DB_PATH);
      return;
    }

    // Try regular MongoDB connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
